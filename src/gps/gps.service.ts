import { Injectable, Logger } from '@nestjs/common';
import * as net from 'net';
import * as crc from 'crc';
import fmParser, { IAvl, IEvent } from './fmParser';
import { InjectModel } from '@nestjs/mongoose';
import { FMLast, FMLastDocument } from './schemas/fm-last.schema';
import { FMData, FMDataDocument } from './schemas/fm-data.schema';
import { Device, DeviceDocument } from './schemas/devices.schema';
import { Parser } from 'binary-parser';
import { Model } from 'mongoose';

interface FMSocket extends net.Socket {
	deviceId: string;
	imei: string;
}

@Injectable()
export class GpsService {
	private server: net.Server;
	private logger = new Logger(GpsService.name);

	constructor(
		@InjectModel(FMLast.name) private fmLastModel: Model<FMLastDocument>,
		@InjectModel(FMData.name) private fmDataModel: Model<FMDataDocument>,
		@InjectModel(Device.name) private deviceModel: Model<DeviceDocument>
	) {
		this.server = net.createServer();
		this.server.on('connection', this.onSocketConnection);
		this.server.on('error', (error) => {
			this.logger.log(error.message);
		});
	}

	onSocketConnection = async (socket: FMSocket) => {
		socket.imei = '';
		socket.deviceId = '';
		this.logger.log('New client connected');

		socket.on('data', async (data) => {
			this.logger.log(`Received data: ${data.toString('hex')}`);
			const result: boolean = await this.socketOnData(data, socket);
			this.logger.log('rezultat zapisu danych');
			this.logger.log(result);
		});

		socket.on('end', () => {
			this.logger.log('Client disconnected');
		});
	};

	async socketOnData(data: Buffer, socket: FMSocket): Promise<boolean> {
		const hasAssignedDeviceId = socket.deviceId !== '';

		if (hasAssignedDeviceId) {
			return this.parseFrame(data, socket);
		}

		const imei = this.parseIMEI(data);
		if (!this.isValidIMEI(imei)) {
			this.disconnectFromSocket(socket);
			return false;
		}

		const deviceId = await this.getDeviceId(imei);
		if (!deviceId) {
			this.disconnectFromSocket(socket);
			return false;
		}

		this.assignDeviceIdAndImeiToSocket(deviceId, imei, socket);
		this.sendSocketReplay('01', socket);
		return true;
	}

	async parseFrame(data: Buffer, socket: FMSocket): Promise<boolean> {
		let recordsCount = '00';

		const frame = fmParser;

		try {
			const parsed = frame.parse(data);
			recordsCount = parsed.recordsCount2;

			if (parsed.codecId !== 0x08 && parsed.codecId !== 0x8e) {
				this.disconnectFromSocket(socket);
				return false;
			}

			const calcCRC = crc.crc16(data.slice(8, -4));
			const frameCRC = parseInt(parsed.crc, 16);

			if (calcCRC !== frameCRC) {
				this.disconnectFromSocket(socket);
				return;
			}

			const { avlArray }: { avlArray: IAvl[] } = parsed;
			const savedCounter = await this.parseAVLArray(avlArray, socket);

			if (savedCounter === parseInt(recordsCount, 16)) {
				this.sendSocketReplay(`000000${recordsCount}`, socket);
				this.logger.log(recordsCount);
			}
		} catch (error) {
			console.error(error);
			return false;
		}
		return true;
	}

	parseAVLArray = async (avlArray: IAvl[], socket: FMSocket): Promise<number> => {
		let savedCounter = 0;
		await this.asyncForEach(avlArray, async (avl: IAvl) => {
			const timestamp: number = parseInt(avl.timestamp, 16);
			const time: Date = new Date(timestamp);
			const latitude: number = parseInt(avl.latitude, 16) / 10000000;
			const longitude: number = parseInt(avl.longitude, 16) / 10000000;
			const altitude: number = parseInt(avl.altitude, 16);
			const angle: number = parseInt(avl.angle, 16);
			const sattelites: number = parseInt(avl.sattelites, 16);
			const speed: number = parseInt(avl.speed, 16);
			const io: [number, number | string][] = [];

			avl.oneByteEvents.forEach((event: IEvent) => {
				io.push([parseInt(event.ioId, 16), parseInt(event.ioValue, 16)]);
			});
			avl.twoBytesEvents.forEach((event: IEvent) => {
				io.push([parseInt(event.ioId, 16), parseInt(event.ioValue, 16)]);
			});
			avl.fourBytesEvents.forEach((event: IEvent) => {
				io.push([parseInt(event.ioId, 16), parseInt(event.ioValue, 16)]);
			});
			avl.eightBytesEvents.forEach((event: IEvent) => {
				io.push([parseInt(event.ioId, 16), parseInt(event.ioValue, 16)]);
			});
			if (avl.nBytesEvents && avl.nBytesEvents.length > 0) {
				avl.nBytesEvents.forEach((event: IEvent) => {
					io.push([parseInt(event.ioId, 16), event.ioValue]);
				});
			}

			this.emitPosition({
				vid: socket.deviceId,
				io,
				time,
				latitude,
				longitude,
				altitude,
				angle,
				sattelites,
				speed,
			});

			const [isLastPositionUpdated, isPositionSaved] = await Promise.all([
				this.updateLastPosition({
					vid: socket.deviceId,
					io,
					time,
					latitude,
					longitude,
					altitude,
					angle,
					sattelites,
					speed,
				}),
				this.savePosition({
					vid: socket.deviceId,
					io,
					time,
					latitude,
					longitude,
					altitude,
					angle,
					sattelites,
					speed,
				}),
			]);

			if (isLastPositionUpdated && isPositionSaved) {
				savedCounter++;
			}
		});
		return savedCounter;
	};

	emitPosition({ vid, io, time, latitude, longitude, altitude, angle, sattelites, speed }) {
		console.log({ vid, io, time, latitude, longitude, altitude, angle, sattelites, speed });
		// clients.emitPosition({
		// 	vid: socket.vehicleId,
		// 	io,
		// 	time,
		// 	gps: {
		// 		pos: [latitude, longitude],
		// 		alt: altitude,
		// 		ang: angle,
		// 		sat: sattelites,
		// 		spd: speed,
		// 	},
		// 	st: new Date(),
		// });
	}

	async updateLastPosition({
		vid,
		io,
		time,
		latitude,
		longitude,
		altitude,
		angle,
		sattelites,
		speed,
	}): Promise<boolean> {
		try {
			const last = await this.fmLastModel.findOne({
				vid,
				time: { $gte: time },
			});
			if (last === null) {
				const payload = {
					io,
					time,
					gps: {
						pos: [latitude, longitude],
						alt: altitude,
						ang: angle,
						sat: sattelites,
						spd: speed,
					},
					st: new Date(),
				};
				await this.fmLastModel.updateOne(
					{
						vid,
					},
					{
						$set: payload,
					},
					{
						upsert: true,
					}
				);
			}
			return true;
		} catch (_err) {
			return false;
		}
	}

	async savePosition({
		vid,
		io,
		time,
		latitude,
		longitude,
		altitude,
		angle,
		sattelites,
		speed,
	}): Promise<boolean> {
		try {
			await this.fmDataModel.updateOne(
				{
					vid,
					time,
				},
				{
					io,
					gps: {
						pos: [latitude, longitude],
						alt: altitude,
						ang: angle,
						sat: sattelites,
						spd: speed,
					},
					st: new Date(),
				},
				{
					upsert: true,
				}
			);
			return true;
		} catch (_err) {
			return false;
		}
	}

	assignDeviceIdAndImeiToSocket(deviceId: string, imei: string, socket: FMSocket) {
		socket.deviceId = deviceId;
		socket.imei = imei;
	}

	async getDeviceId(imei: string): Promise<string> {
		const deviceDocument = await this.deviceModel.findOne({ imei }).exec();

		if (deviceDocument === null) {
			// TODO: config option 'saveNewIMEI ?'
			return await this.addDeviceToDb(imei);
		}
		if (!deviceDocument.allow) {
			return null;
		}
		const { vehicleId } = deviceDocument;
		return vehicleId;
	}

	async addDeviceToDb(imei: string): Promise<string> {
		const newDevice = new this.deviceModel({
			imei,
			allow: false,
			name: imei,
			vehicleId: imei,
		});
		console.log('dodaje nowe uzadzenie');
		await newDevice.save();
		return newDevice._id.toString();
	}

	parseIMEI(data: Buffer): string {
		const frame = new Parser().uint16('length').string('imei', { length: 'length' });
		const { imei }: { imei: string } = frame.parse(data);
		return imei;
	}

	sendSocketReplay(replay: string, socket: FMSocket) {
		try {
			const message = Buffer.from(replay, 'hex');
			socket.write(message);
		} catch (err) {
			console.log(err);
		}
	}
	disconnectFromSocket(socket: FMSocket) {
		this.sendSocketReplay('00', socket);
		socket.end();
	}

	isValidIMEI(imei: string) {
		if (typeof imei !== 'string') {
			return false;
		}
		const { length } = imei;
		const parity = length % 2;
		let sum = 0;
		let position;
		for (position = length - 1; position >= 0; position -= 1) {
			let c = parseInt(imei.charAt(position), 10);
			if (position % 2 === parity) {
				c *= 2;
			}
			if (c > 9) {
				c -= 9;
			}
			sum += c;
		}
		return sum % 10 === 0;
	}

	async asyncForEach(array: any, callback: any) {
		for (let index = 0; index < array.length; index += 1) {
			// eslint-disable-next-line no-await-in-loop
			await callback(array[index], index, array);
		}
	}

	startServer() {
		this.server.listen(5005, () => {
			this.logger.log('Server listening on port 5005');
		});
	}
}

import { Parser } from 'binary-parser';
import codec08 from './codec08';
import codec8e from './codec8e';

export interface IEvent {
	ioId: string;
	ioValue: string;
}

export interface IAvl {
	timestamp: string;
	latitude: string;
	longitude: string;
	altitude: string;
	angle: string;
	sattelites: string;
	speed: string;
	oneByteEvents: IEvent[];
	twoBytesEvents: IEvent[];
	fourBytesEvents: IEvent[];
	eightBytesEvents: IEvent[];
	nBytesEvents?: IEvent[];
}

const parser: any = new Parser()
	.uint32('zeroes')
	.uint32('avlLength')
	.uint8('codecId')
	.choice('avlArray', {
		tag: 'codecId',
		choices: {
			0x08: new Parser()
				.uint8('recordsCount1')
				.array('avlArray', { length: 'recordsCount1', type: codec08 }),
			0x8e: new Parser()
				.uint8('recordsCount1')
				.array('avlArray', { length: 'recordsCount1', type: codec8e }),
		},
		formatter(item: any) {
			return item.avlArray;
		},
	})
	.string('recordsCount2', { encoding: 'hex', length: 1 })
	.string('crc', { encoding: 'hex', length: 4 });

export default parser;

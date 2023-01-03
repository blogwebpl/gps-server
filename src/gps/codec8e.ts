import { Parser } from 'binary-parser';

const oneByteIO = new Parser()
	.string('ioId', { encoding: 'hex', length: 2 })
	.string('ioValue', { encoding: 'hex', length: 1 });

const twoBytesIO = new Parser()
	.string('ioId', { encoding: 'hex', length: 2 })
	.string('ioValue', { encoding: 'hex', length: 2 });

const fourBytesIO = new Parser()
	.string('ioId', { encoding: 'hex', length: 2 })
	.string('ioValue', { encoding: 'hex', length: 4 });

const eightBytesIO = new Parser()
	.string('ioId', { encoding: 'hex', length: 2 })
	.string('ioValue', { encoding: 'hex', length: 8 });

const nBytesIO = new Parser()
	.string('ioId', { encoding: 'hex', length: 2 })
	.uint32('ioLen')
	.string('ioValue', {
		encoding: 'hex',
		length: 'ioLen',
	});

export default new Parser()
	.string('timestamp', { encoding: 'hex', length: 8 })
	.string('priority', { encoding: 'hex', length: 1 })
	.string('longitude', { encoding: 'hex', length: 4 })
	.string('latitude', { encoding: 'hex', length: 4 })
	.string('altitude', { encoding: 'hex', length: 2 })
	.string('angle', { encoding: 'hex', length: 2 })
	.string('sattelites', { encoding: 'hex', length: 1 })
	.string('speed', { encoding: 'hex', length: 2 })
	.string('event', { encoding: 'hex', length: 2 })
	.uint16('totalIOCount')
	.uint16('oneByteIOCount')
	.array('oneByteEvents', {
		type: oneByteIO,
		length: 'oneByteIOCount',
	})
	.uint16('twoBytesIOCount')
	.array('twoBytesEvents', {
		type: twoBytesIO,
		length: 'twoBytesIOCount',
	})
	.uint16('fourBytesIOCount')
	.array('fourBytesEvents', {
		type: fourBytesIO,
		length: 'fourBytesIOCount',
	})
	.uint16('eightBytesIOCount')
	.array('eightBytesEvents', {
		type: eightBytesIO,
		length: 'eightBytesIOCount',
	})
	.uint16('nBytesIOCount')
	.array('nBytesEvents', {
		type: nBytesIO,
		length: 'nBytesIOCount',
	});

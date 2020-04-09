import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
	codigo: {
		type: String,
		required: true,
	},
	classe: {
		type: String,
		required: true,
	},
	teoria: {
		type: String,
	},
	pratica: {
		type: String,
	},
	docenteTeoria: {
		type: String,
	},
	docentePratica: {
		type: String,
	},
	listaRa: {
		type: [String],
		required: true,
	},
});

export default mongoose.model('Class', ClassSchema);

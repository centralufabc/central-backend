import mongoose from 'mongoose';

const DisciplineSchema = new mongoose.Schema({
	sigla: {
		type: String,
		required: true,
	},
	disciplina: {
		type: String,
		required: true,
	},
	tpi: {
		type: String,
		required: true,
	},
	recomendacao: {
		type: String,
	},
	ementa: {
		type: String,
	},
	basica: {
		type: String,
	},
	complementar: {
		type: String,
	},
});

export default mongoose.model('Discipline', DisciplineSchema);

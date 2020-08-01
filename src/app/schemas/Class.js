import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
	},
	acronym: {
		type: String,
		required: true,
	},
	class: {
		type: String,
		required: true,
	},
	theory: {
		day: String,
		start: String,
		finish: String,
		place: String,
		freq: String,
	},
	practice: {
		day: String,
		start: String,
		finish: String,
		place: String,
		freq: String,
	},
	theoryProfessor: {
		type: String,
	},
	practiceProfessor: {
		type: String,
	},
	raList: {
		type: [String],
	},
});

export default mongoose.model('Class', ClassSchema);

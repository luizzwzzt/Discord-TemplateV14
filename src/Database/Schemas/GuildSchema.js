import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	userName: { type: String },
	xp: { type: Number, default: 0 },
	level: { type: Number, default: 1 },
	nextLevelExp: { type: Number, default: 100 },
	colorCustomization: {
		background: { type: String, default: '#2a2e35' },
		sideline: { type: String, default: '#23272a' },
		progressbar: { type: String, default: '#dad9d1' },
		xpColor: { type: String, default: '#85848a' },
	},
});

const serverSchema = new mongoose.Schema({
	serverId: { type: String, required: true, unique: true },
	serverName: { type: String },
	users: [userSchema],
	language: { type: String, default: 'pt-BR' },
});

export const Server = mongoose.models.Server || mongoose.model('Server', serverSchema);
const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    semesterId: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true }
}, { timestamps: true });

const labSchema = new mongoose.Schema({
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    name: { type: String, required: true }
}, { timestamps: true });

const Module = mongoose.model('Module', moduleSchema);
const Lab = mongoose.model('Lab', labSchema);

module.exports = { Module, Lab };
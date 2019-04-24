const mongoose = require('../db/mongoose');

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isNote: {
        type: Boolean,
        required: true
    },
    completed:{
        type: Boolean,
        required: true
    },
    date:{
        type: Date
    },
    repeat:{
        type: String
    },
    owner:{
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
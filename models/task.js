const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});
// Compile model from schema
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
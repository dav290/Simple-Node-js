const mongoose = require('mongoose');
// Creating the model
const exerciseSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  });
const exercisesModel = mongoose.model('exercises', exerciseSchema);
// Exporting the model
module.exports = exercisesModel;

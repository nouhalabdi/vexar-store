const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  wilayaId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  home: { type: Number, required: true, min: 0 },
  desk: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Delivery', deliverySchema);
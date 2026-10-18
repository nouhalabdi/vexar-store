const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cat: { type: String, required: true, enum: ['classic', 'sneakers', 'formal', 'loafers'] },
  catName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: 0, min: 0 },
  img: { type: String, default: '' },
  desc: { type: String, default: '' },
  badge: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
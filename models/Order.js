const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    wilaya: { type: String, required: true },
    wilayaId: { type: Number, required: true },
    commune: { type: String, required: true },
    deliveryType: { type: String, enum: ['home', 'desk'], required: true },
    notes: { type: String, default: '' }
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    size: String,
    qty: Number,
    price: Number,
    img: String
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
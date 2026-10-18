const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    const delivery = await Delivery.find().sort({ wilayaId: 1 });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:wilayaId', auth, async (req, res) => {
  try {
    const delivery = await Delivery.findOneAndUpdate(
      { wilayaId: req.params.wilayaId },
      req.body,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(delivery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:wilayaId', auth, async (req, res) => {
  try {
    await Delivery.findOneAndDelete({ wilayaId: req.params.wilayaId });
    res.json({ message: 'تم حذف الولاية' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
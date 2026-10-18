const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
  try {
    const username = (req.body.username || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();

    console.log('\n🔐 محاولة دخول:', { username });

    if(!username || !password){
      return res.status(400).json({ error: 'املأ جميع الحقول' });
    }

    
    const admin = await Admin.findOne({
      username: { $regex: new RegExp('^' + username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
    });

    if(!admin){
      console.log('❌ المستخدم غير موجود في قاعدة البيانات:', username);
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    console.log('✓ المستخدم موجود، جاري التحقق من كلمة المرور...');

    const isValid = await bcrypt.compare(password, admin.password);
    if(!isValid){
      console.log('❌ كلمة المرور غير صحيحة');
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    console.log('✅ تم التحقق بنجاح، إصدار التوكن...');

    const token = jwt.sign(
      { id: admin._id, username: admin.username, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, admin: { name: admin.name, username: admin.username } });
  } catch(err){
    console.error('❌ خطأ في login:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
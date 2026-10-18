require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const Admin = require('./models/Admin');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function question(q){ return new Promise(r => rl.question(q, r)); }

async function main(){
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ متصل بـ MongoDB Atlas\n');

    const name = (await question('👤 اسم المسؤول: ')).trim();
    const username = (await question('🔑 اسم المستخدم: ')).trim().toLowerCase();
    const password = (await question('🔒 كلمة المرور: ')).trim();

    if(!name || !username || !password){
      console.log('❌ جميع الحقول مطلوبة');
      process.exit(1);
    }

    const existing = await Admin.findOne({ username });
    if(existing){
      console.log('❌ اسم المستخدم موجود بالفعل:', username);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, username, password: hashedPassword });
    await admin.save();

    console.log('\n✅ تم إنشاء حساب المسؤول بنجاح!');
    console.log('   الاسم:', name);
    console.log('   اسم المستخدم:', username, '(تم تحويله لحروف صغيرة)');
    console.log('   كلمة المرور:', '*'.repeat(password.length));
    console.log('\n💡 استخدم هذه البيانات بالضبط في صفحة الدخول');
    process.exit(0);
  } catch(err){
    console.error('❌ خطأ:', err.message);
    process.exit(1);
  }
}
main();
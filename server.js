require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Product = require('./models/Product');
const Delivery = require('./models/Delivery');

const app = express();
app.use(cors());
app.use(express.json());

/* ============================================================
   SEED DATA — الولايات الـ58
   ============================================================ */
const DEFAULT_WILAYAS = [
  {wilayaId:1,name:'أدرار',home:900,desk:600},{wilayaId:2,name:'الشلف',home:450,desk:300},
  {wilayaId:3,name:'الأغواط',home:600,desk:400},{wilayaId:4,name:'أم البواقي',home:500,desk:350},
  {wilayaId:5,name:'باتنة',home:500,desk:350},{wilayaId:6,name:'بجاية',home:450,desk:300},
  {wilayaId:7,name:'بسكرة',home:550,desk:350},{wilayaId:8,name:'بشار',home:800,desk:550},
  {wilayaId:9,name:'البليدة',home:400,desk:250},{wilayaId:10,name:'البويرة',home:450,desk:300},
  {wilayaId:11,name:'تمنراست',home:1000,desk:700},{wilayaId:12,name:'تبسة',home:550,desk:350},
  {wilayaId:13,name:'تلمسان',home:500,desk:350},{wilayaId:14,name:'تيارت',home:500,desk:350},
  {wilayaId:15,name:'تيزي وزو',home:450,desk:300},{wilayaId:16,name:'الجزائر',home:400,desk:250},
  {wilayaId:17,name:'الجلفة',home:600,desk:400},{wilayaId:18,name:'جيجل',home:450,desk:300},
  {wilayaId:19,name:'سطيف',home:450,desk:300},{wilayaId:20,name:'سعيدة',home:550,desk:350},
  {wilayaId:21,name:'سكيكدة',home:450,desk:300},{wilayaId:22,name:'سيدي بلعباس',home:500,desk:350},
  {wilayaId:23,name:'عنابة',home:450,desk:300},{wilayaId:24,name:'قالمة',home:500,desk:350},
  {wilayaId:25,name:'قسنطينة',home:450,desk:300},{wilayaId:26,name:'المدية',home:450,desk:300},
  {wilayaId:27,name:'مستغانم',home:500,desk:350},{wilayaId:28,name:'المسيلة',home:500,desk:350},
  {wilayaId:29,name:'معسكر',home:500,desk:350},{wilayaId:30,name:'ورقلة',home:700,desk:450},
  {wilayaId:31,name:'وهران',home:450,desk:300},{wilayaId:32,name:'البيض',home:650,desk:450},
  {wilayaId:33,name:'إليزي',home:1100,desk:800},{wilayaId:34,name:'برج بوعريريج',home:450,desk:300},
  {wilayaId:35,name:'بومرداس',home:400,desk:250},{wilayaId:36,name:'الطارف',home:500,desk:350},
  {wilayaId:37,name:'تندوف',home:1200,desk:800},{wilayaId:38,name:'تيسمسيلت',home:550,desk:350},
  {wilayaId:39,name:'الوادي',home:650,desk:450},{wilayaId:40,name:'خنشلة',home:550,desk:350},
  {wilayaId:41,name:'سوق أهراس',home:550,desk:350},{wilayaId:42,name:'تيبازة',home:400,desk:250},
  {wilayaId:43,name:'ميلة',home:450,desk:300},{wilayaId:44,name:'عين الدفلى',home:500,desk:350},
  {wilayaId:45,name:'النعامة',home:650,desk:450},{wilayaId:46,name:'عين تموشنت',home:500,desk:350},
  {wilayaId:47,name:'غرداية',home:700,desk:450},{wilayaId:48,name:'غليزان',home:500,desk:350},
  {wilayaId:49,name:'تيميمون',home:900,desk:600},{wilayaId:50,name:'برج باجي مختار',home:1100,desk:800},
  {wilayaId:51,name:'أولاد جلال',home:600,desk:400},{wilayaId:52,name:'بني عباس',home:900,desk:600},
  {wilayaId:53,name:'عين صالح',home:1000,desk:700},{wilayaId:54,name:'عين قزام',home:1200,desk:800},
  {wilayaId:55,name:'تقرت',home:650,desk:450},{wilayaId:56,name:'جانت',home:1200,desk:850},
  {wilayaId:57,name:'المغير',home:650,desk:450},{wilayaId:58,name:'المنيعة',home:750,desk:500}
];

/* ============================================================
   SEED DATA — 20 منتج
   ============================================================ */
const DEFAULT_PRODUCTS = [
  // ============ CLASSIC (5) ============
  {name:'أوكسفورد كلاسيك', cat:'classic', catName:'كلاسيك', price:12500, oldPrice:15800, badge:'جديد',
   img:'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=700&q=80',
   desc:'حذاء أوكسفورد من الجلد الإيطالي الطبيعي، تصميم كلاسيكي خالد مع نعل جلدي مدبوغ يدوياً. مثالي للمناسبات الرسمية والعمل.'},

  {name:'شيلسي براون', cat:'classic', catName:'كلاسيك', price:13800, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=700&q=80',
   desc:'حذاء تشيلسي بلون بني دافئ، مرونة في الارتداء مع فخامة الجلد المدبوغ. عصري بلا مجهود.'},

  {name:'أوكسفورد فينتاج', cat:'classic', catName:'كلاسيك', price:15200, oldPrice:18000, badge:'خصم',
   img:'https://images.unsplash.com/photo-1478186014792-9f671c3cb7a3?w=700&q=80',
   desc:'أوكسفورد بطراز فينتاج خالد، جلد طبيعي بلون بني غني، وتفاصيل مخيطة يدوياً بعناية.'},

  {name:'بووت ديبي', cat:'classic', catName:'كلاسيك', price:11800, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=700&q=80',
   desc:'بووت صحراوي كلاسيكي من جلد السويد، خفيف ومريح، مثالي للإطلالات الكاجوال.'},

  {name:'شوز أرتيزان', cat:'classic', catName:'كلاسيك', price:16500, oldPrice:0, badge:'إصدار محدود',
   img:'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=700&q=80',
   desc:'قطعة فنية من الجلد الطبيعي، مصنوعة يدوياً بأكثر من 78 خطوة. لعشاق الحرفية الأصيلة.'},

  // ============ SNEAKERS (8) ============
  {name:'سنيكرز أوربان', cat:'sneakers', catName:'سنيكرز', price:9800, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80',
   desc:'سنيكرز عصري بتصميم مينيمال، نعل مرن مريح لليوم الكامل. يجمع بين الأناقة والراحة.'},

  {name:'سنيكرز وايت كلاسيك', cat:'sneakers', catName:'سنيكرز', price:8900, oldPrice:11000, badge:'الأكثر مبيعاً',
   img:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&q=80',
   desc:'سنيكرز أبيض كلاسيكي لا يفقد بريقه، يناسب كل الإطلالات. جلد طبيعي ونعل مطاطي متين.'},

  {name:'سنيكرز ريسر', cat:'sneakers', catName:'سنيكرز', price:10400, oldPrice:0, badge:'جديد',
   img:'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&q=80',
   desc:'سنيكرز رياضي خفيف، مصمم للسرعة والأناقة، بنعل مطاطي مرن يمنحك راحة استثنائية.'},

  {name:'سنيكرز ريترو', cat:'sneakers', catName:'سنيكرز', price:9200, oldPrice:11500, badge:'خصم',
   img:'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=700&q=80',
   desc:'سنيكرز بروح الثمانينات، ألوان جريئة وتصميم كلاسيكي لا يمل. لفتة شبابية مميزة.'},

  {name:'سنيكرز تشونكي', cat:'sneakers', catName:'سنيكرز', price:11200, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80',
   desc:'سنيكرز بنعل سميك عصري، يجمع بين الراحة والستايل الحديث. ترند الموضة الحالي.'},

  {name:'سنيكرز ريد لايت', cat:'sneakers', catName:'سنيكرز', price:8500, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80',
   desc:'سنيكرز رياضي بألوان حيوية، مصمم للأداء العالي والراحة اليومية. لافت للأنظار.'},

  {name:'سنيكرز سنو', cat:'sneakers', catName:'سنيكرز', price:9600, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80',
   desc:'سنيكرز أبيض نقي، بسيط وأنيق، مثالي للإطلالات الصيفية والكاجوال.'},

  {name:'سنيكرز بلاك إيديشين', cat:'sneakers', catName:'سنيكرز', price:10900, oldPrice:0, badge:'جديد',
   img:'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700&q=80',
   desc:'سنيكرز أسود بالكامل، تصميم بسيط وقوي. يرافقك من الصباح حتى المساء.'},

  // ============ FORMAL (5) ============
  {name:'ديربي بني', cat:'formal', catName:'رسمي', price:13400, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=700&q=80',
   desc:'ديربي بني دافئ، جلد طبيعي بلون كراميلي، يناسب العمل والمناسبات. أناقة يومية.'},

  {name:'أوكسفورد أسود', cat:'formal', catName:'رسمي', price:15900, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=700&q=80',
   desc:'أوكسفورد أسود أيقوني، قطعة أساسية في خزانة كل رجل أنيق. جلد مصقول لامع.'},

  {name:'دريس كلاسيك', cat:'formal', catName:'رسمي', price:14500, oldPrice:18000, badge:'خصم',
   img:'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=700&q=80',
   desc:'حذاء رسمي كلاسيكي بجلد العجل الكامل، بتفاصيل يدوية دقيقة. لأهم مناسباتك.'},

  {name:'مونك ستراب', cat:'formal', catName:'رسمي', price:17200, oldPrice:0, badge:'جديد',
   img:'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=700&q=80',
   desc:'حذاء مونك ستراب بإبزيم فضي، تصميم راقٍ بديل عصري عن الأوكسفورد. لمسة فاخرة.'},

  {name:'بروغ نايت', cat:'formal', catName:'رسمي', price:14100, oldPrice:16500, badge:'خصم',
   img:'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=700&q=80',
   desc:'حذاء بروغ بنقوش دقيقة، جلد بني داكن، أنيق وغير رسمي. مثالي للحفلات المسائية.'},

  // ============ LOAFERS (2) ============
  {name:'لوفر موناكو', cat:'loafers', catName:'لوفر', price:11200, oldPrice:0, badge:'',
   img:'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=700&q=80',
   desc:'لوفر بلمسة إيطالية راقية، جلد ناعم مع تفاصيل معدنية ذهبية. للإطلالات شبه الرسمية.'},

  {name:'لوفر لوكس', cat:'loafers', catName:'لوفر', price:12900, oldPrice:0, badge:'جديد',
   img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=80',
   desc:'لوفر فاخر بتفاصيل يدوية راقية، جلد طبيعي بلون كراميلي غني. الأناقة بلا مجهود.'}
];

/* ============================================================
   AUTO SEED — يعمل تلقائياً عند أول تشغيل
   ============================================================ */
async function seedDatabase() {
  try {
    const deliveryCount = await Delivery.countDocuments();
    if (deliveryCount === 0) {
      await Delivery.insertMany(DEFAULT_WILAYAS);
      console.log(`✅ تمت إضافة ${DEFAULT_WILAYAS.length} ولاية تلقائياً`);
    } else {
      console.log(`ℹ️  الولايات موجودة مسبقاً (${deliveryCount})`);
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(DEFAULT_PRODUCTS);
      console.log(`✅ تمت إضافة ${DEFAULT_PRODUCTS.length} منتج تلقائياً`);
    } else {
      console.log(`ℹ️  المنتجات موجودة مسبقاً (${productCount})`);
    }
  } catch (err) {
    console.error('❌ خطأ في seed البيانات:', err.message);
  }
}

/* ============================================================
   CONNECT MONGODB
   ============================================================ */
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ متصل بـ MongoDB Atlas');
    await seedDatabase();
  })
  .catch(err => console.error('❌ خطأ في الاتصال:', err.message));

/* ============================================================
   API ROUTES
   ============================================================ */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/delivery', require('./routes/delivery'));

/* ============================================================
   STATIC FILES
   ============================================================ */
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Catch-all (متوافق مع Express 4 و 5)
app.use((req, res) => {
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

/* ============================================================
   START SERVER
   ============================================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 الخادم يعمل على http://localhost:${PORT}`);
  console.log(`🛍️  المتجر: http://localhost:${PORT}`);
  console.log(`🔐 الإدارة: http://localhost:${PORT}/admin\n`);
});
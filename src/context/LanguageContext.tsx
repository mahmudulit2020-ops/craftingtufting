import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type LanguageCode = 'en' | 'bn' | 'ar' | 'fr' | 'de';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<LanguageCode, LanguageConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: 'EN', dir: 'ltr' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: 'BN', dir: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'AR', dir: 'rtl' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR', dir: 'ltr' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE', dir: 'ltr' },
};

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Header & Announcement
    announcement: 'Handcrafted in Bangladesh · Worldwide Express Delivery · 50% Advance on Custom Rugs',
    shopRugs: 'Shop Rugs',
    customRugStudio: 'Custom Rug Studio',
    tuftingSupplies: 'Tufting Supplies',
    juteHandicrafts: 'Jute Handicrafts',
    trackOrder: 'Track Order',
    aboutAtelier: 'About Atelier',
    search: 'Search catalog',
    wishlist: 'Wishlist',
    cart: 'Shopping Bag',
    account: 'Account',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    clientDashboard: 'Client Dashboard',
    adminConsole: 'Admin Atelier Console',
    language: 'Language',
    currency: 'Currency',
    menu: 'Menu',
    close: 'Close',

    // Hero & Home
    heroTitle: 'Bespoke Hand-Tufted Rugs & Delta Jute Handicrafts',
    heroSubtitle: 'Directly from our artisan looms in Bangladesh. Premium acrylic, New Zealand wool, and golden jute crafted into museum-grade statement pieces.',
    designCustomRug: 'Design Custom Rug',
    tuftingSuppliesBtn: 'Tufting Supplies',
    readyMadeRugs: 'Ready-Made Rugs',
    exploreCollection: 'Explore Collections',
    discoverMore: 'Discover More',

    // Product Cards & Catalog
    bestSeller: 'Best Seller',
    newArrival: 'New Arrival',
    quickView: 'Quick View',
    addToBag: 'Add to Bag',
    addedToBag: 'Added to Bag',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    viewDetails: 'View Details',
    price: 'Price',
    filterByCategory: 'Filter by Category',
    allProducts: 'All Products',
    sortBy: 'Sort by',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',

    // Pricing & Breakdown
    baseRate: 'Base Rate',
    totalArea: 'Total Rug Area',
    yarnUpgrade: 'Yarn Upgrade',
    pileDepth: 'Pile Depth / Relief',
    shapeContour: 'Custom Shape Contour',
    selectedAddons: 'Selected Add-ons',
    estimatedTotal: 'Estimated Total',
    advanceModel: '50% Advance Payment Model',
    securesLoom: 'Secures Artisan Loom',
    payNowAdvance: 'Pay Now (50% Advance)',
    toStartTufting: 'To start hand-tufting',
    dueOnDelivery: 'Due on Final Delivery',
    remainingBalance: 'Remaining 50% Balance',

    // Custom Rug Studio
    customStudioTitle: 'Interactive Custom Rug Studio',
    selectShape: '1. Select Shape',
    dimensions: '2. Dimensions & Unit',
    width: 'Width',
    length: 'Length',
    diameter: 'Diameter',
    unit: 'Unit',
    pileHeight: '3. Pile Height & Texture',
    backingMaterial: '4. Backing & Finishing',
    yarnType: '5. Yarn Fiber',
    colorSelection: '6. Atelier Palette',
    rectangle: 'Rectangle',
    square: 'Square',
    circle: 'Circle',
    oval: 'Oval',
    customShape: 'Custom Shape',

    // Cart & Checkout
    yourCart: 'Your Shopping Bag',
    cartEmpty: 'Your shopping bag is empty',
    emptyCartMessage: 'Explore our artisan hand-tufted rugs and golden jute crafts to fill your space with elegance.',
    continueShopping: 'Continue Shopping',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    freeShipping: 'Complimentary Worldwide Express',
    checkout: 'Proceed to Checkout',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    shippingAddress: 'Shipping Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country',
    paymentMethod: 'Payment Method',
    cashOnDelivery: '50% Advance + Balance on Delivery',
    onlinePayment: 'Full International Card Payment',
    placeOrder: 'Confirm & Place Order',
    orderPlaced: 'Order Successfully Placed!',
    orderConfirmation: 'Your custom order is confirmed with our master weavers in Dhaka.',

    // Tracking
    trackYourOrder: 'Track Your Custom Atelier Order',
    orderIdPlaceholder: 'Enter your Order ID (e.g., CT-8942)',
    trackButton: 'Track Status',
    orderStatus: 'Order Status',
    orderedOn: 'Ordered On',
    estimatedDelivery: 'Estimated Delivery',
    statusPending: 'Order Received',
    statusProcessing: 'Yarn Dyeing & Prep',
    statusTufting: 'Hand-Tufting on Loom',
    statusShipped: 'International Transit',
    statusDelivered: 'Delivered to Doorstep',

    // Wishlist
    myWishlist: 'My Wishlist',
    wishlistEmpty: 'Your wishlist is currently empty',
    moveToCart: 'Move to Bag',
    clearWishlist: 'Clear Wishlist',

    // Footer
    brandQuote: 'Crafting & Tufting delivers bespoke handmade rugs & golden delta handicrafts that outshine industry standards. Our commitment to delta fiber excellence and precision hand-tufting ensures each custom project achieves exceptional results and lasting impact.',
    satisfactionGuaranteed: 'Satisfaction Guaranteed',
    satisfactionGuaranteedDesc: 'Begin your journey — where brilliant bespoke ideas meet flawless artisan execution.',
    quickLinks: 'Quick Links',
    customerCare: 'Customer Care',
    newsletterTitle: 'Join the Atelier Circle',
    newsletterDesc: 'Receive private invitations to new releases, studio tufting journals, and exclusive collector previews.',
    subscribe: 'Subscribe',
    subscribed: 'Subscribed Successfully!',
    allRightsReserved: 'All rights reserved. Handcrafted with passion in Bangladesh.',
  },

  bn: {
    // Header & Announcement
    announcement: 'বাংলাদেশে হাতে তৈরি · বিশ্বব্যাপী এক্সপ্রেস ডেলিভারি · কাস্টম কার্পেটে ৫০% অগ্রিম',
    shopRugs: 'কার্পেট কিনুন',
    customRugStudio: 'কাস্টম টাফটিং স্টুডিও',
    tuftingSupplies: 'টাফটিং সরঞ্জাম',
    juteHandicrafts: 'পাটের হস্তশিল্প',
    trackOrder: 'অর্ডার ট্র্যাক করুন',
    aboutAtelier: 'আমাদের গল্প',
    search: 'ক্যাটালগ খুঁজুন',
    wishlist: 'উইশলিস্ট',
    cart: 'শপিং ব্যাগ',
    account: 'অ্যাকাউন্ট',
    signIn: 'লগইন করুন',
    signOut: 'লগআউট',
    clientDashboard: 'ক্লায়েন্ট ড্যাশবোর্ড',
    adminConsole: 'অ্যাডমিন কনসোল',
    language: 'ভাষা',
    currency: 'মুদ্রা',
    menu: 'মেনু',
    close: 'বন্ধ করুন',

    // Hero & Home
    heroTitle: 'হাতে বোনা কাস্টম রাগ ও সোনালী পাটের হস্তশিল্প',
    heroSubtitle: 'বাংলাদেশের ঐতিহ্যবাহী কারিগরদের নিখুঁত হাতে তৈরি। প্রিমিয়াম এক্রিলিক, নিউজিল্যান্ড উল এবং গোল্ডেন জুট দিয়ে তৈরি বিশ্বমানের রাজকীয় কার্পেট।',
    designCustomRug: 'কাস্টম কার্পেট ডিজাইন করুন',
    tuftingSuppliesBtn: 'টাফটিং সাপ্লাইস',
    readyMadeRugs: 'প্রস্তুত কার্পেট',
    exploreCollection: 'সংগ্রহ দেখুন',
    discoverMore: 'আরও জানুন',

    // Product Cards & Catalog
    bestSeller: 'বেস্ট সেলার',
    newArrival: 'নতুন কালেকশন',
    quickView: 'এক নজরে দেখুন',
    addToBag: 'ব্যাগে যোগ করুন',
    addedToBag: 'ব্যাগে যোগ করা হয়েছে',
    outOfStock: 'স্টক শেষ',
    inStock: 'স্টকে আছে',
    viewDetails: 'বিস্তারিত দেখুন',
    price: 'মূল্য',
    filterByCategory: 'ক্যাটাগরি ফিল্টার',
    allProducts: 'সকল পণ্য',
    sortBy: 'সাজান',
    priceLowHigh: 'মূল্য: কম থেকে বেশি',
    priceHighLow: 'মূল্য: বেশি থেকে কম',

    // Pricing & Breakdown
    baseRate: 'ভিত্তি মূল্য',
    totalArea: 'মোট কার্পেট আয়তন',
    yarnUpgrade: 'সুতার গ্রেড আপগ্রেড',
    pileDepth: 'পাইল গভীরতা ও খোদাই',
    shapeContour: 'কাস্টম আকৃতির খরচ',
    selectedAddons: 'নির্বাচিত অতিরিক্ত সুবিধা',
    estimatedTotal: 'আনুমানিক সর্বমোট',
    advanceModel: '৫০% অগ্রিম পেমেন্ট মডেল',
    securesLoom: 'কারিগরদের লুম নিশ্চিত করে',
    payNowAdvance: 'এখনই দিন (৫০% অগ্রিম)',
    toStartTufting: 'হাতে বোনা শুরু করতে',
    dueOnDelivery: 'ডেলিভারির সময় বকেয়া',
    remainingBalance: 'অবশিষ্ট ৫০% মূল্য',

    // Custom Rug Studio
    customStudioTitle: 'ইন্টারেক্টিভ কাস্টম রাগ স্টুডিও',
    selectShape: '১. আকৃতি নির্বাচন করুন',
    dimensions: '২. মাপ ও একক',
    width: 'প্রস্থ',
    length: 'দৈর্ঘ্য',
    diameter: 'ব্যাস',
    unit: 'একক',
    pileHeight: '৩. ফাইবারের উচ্চতা ও ঘনত্ব',
    backingMaterial: '৪. পেছনের ব্যাকিং ফিনিশিং',
    yarnType: '৫. সুতা ও ফাইবারের ধরন',
    colorSelection: '৬. রঙের প্যালেট',
    rectangle: 'আয়তাকার',
    square: 'বর্গাকার',
    circle: 'গোলাকার',
    oval: 'ডিম্বাকার',
    customShape: 'কাস্টম আকৃতি',

    // Cart & Checkout
    yourCart: 'আপনার শপিং ব্যাগ',
    cartEmpty: 'আপনার শপিং ব্যাগ খালি',
    emptyCartMessage: 'আপনার বাসস্থান সাজাতে আমাদের ঐতিহ্যবাহী হাতে বোনা কার্পেট ও পাটের পণ্য অন্বেষণ করুন।',
    continueShopping: 'কেনাকাটা চালিয়ে যান',
    orderSummary: 'অর্ডার বিবরণী',
    subtotal: 'সাবটোটাল',
    shipping: 'শিপিং খরচ',
    freeShipping: 'বিনামূল্যে বিশ্বব্যাপী এক্সপ্রেস ডেলিভারি',
    checkout: 'অর্ডার সম্পন্ন করুন',
    fullName: 'আপনার পূর্ণ নাম',
    emailAddress: 'ইমেইল ঠিকানা',
    phoneNumber: 'মোবাইল নম্বর',
    shippingAddress: 'ডেলিভারি ঠিকানা',
    city: 'শহর',
    postalCode: 'পোস্ট কোড',
    country: 'দেশ',
    paymentMethod: 'মূল্য পরিশোধ পদ্ধতি',
    cashOnDelivery: '৫০% অগ্রিম + বাকি টাকা ডেলিভারির সময়',
    onlinePayment: 'সম্পূর্ণ আন্তর্জাতিক কার্ড পেমেন্ট',
    placeOrder: 'অর্ডার নিশ্চিত করুন',
    orderPlaced: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
    orderConfirmation: 'ঢাকার অভিজ্ঞ তাঁতিদের সাথে আপনার কাস্টম অর্ডার নিশ্চিত করা হয়েছে।',

    // Tracking
    trackYourOrder: 'আপনার অর্ডার ট্র্যাক করুন',
    orderIdPlaceholder: 'অর্ডার আইডি লিখুন (যেমন CT-8942)',
    trackButton: 'স্ট্যাটাস দেখুন',
    orderStatus: 'অর্ডারের বর্তমান অবস্থা',
    orderedOn: 'অর্ডারের তারিখ',
    estimatedDelivery: 'সম্ভাব্য ডেলিভারি',
    statusPending: 'অর্ডার গৃহীত হয়েছে',
    statusProcessing: 'সুতা ডাইং ও প্রস্তুতি',
    statusTufting: 'লুমে হাতে বোনা চলছে',
    statusShipped: 'আন্তর্জাতিক ট্রানজিটে আছে',
    statusDelivered: 'গন্তব্যে পৌঁছে গেছে',

    // Wishlist
    myWishlist: 'পছন্দের তালিকা',
    wishlistEmpty: 'আপনার পছন্দের তালিকা খালি',
    moveToCart: 'ব্যাগে নিন',
    clearWishlist: 'তালিকা খালি করুন',

    // Footer
    brandQuote: 'ক্রাফটিং অ্যান্ড টাফটিং পরিবেশন করে সেরা মানের হাতে তৈরি কার্পেট ও সোনালী পাটের হস্তশিল্প। আমাদের প্রতিটি কাস্টম প্রজেক্ট বিশ্বমানের নিপুণতা নিশ্চিত করে।',
    satisfactionGuaranteed: '১০০% সন্তুষ্টির নিশ্চয়তা',
    satisfactionGuaranteedDesc: 'আপনার স্বপ্নের নকশা যখন মিলিত হয় অভিজ্ঞ কারিগরের নিখুঁত বুননে।',
    quickLinks: 'দ্রুত লিংক',
    customerCare: 'গ্রাহক সেবা',
    newsletterTitle: 'আমাদের সাথে যুক্ত থাকুন',
    newsletterDesc: 'নতুন কালেকশন এবং বিশেষ অফারের খবরাখবর সবার আগে পেতে সাবস্ক্রাইব করুন।',
    subscribe: 'সাবস্ক্রাইব করুন',
    subscribed: 'সাবস্ক্রিপশন সফল হয়েছে!',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত। বাংলাদেশে নিখুঁত আবেগে হাতে তৈরি।',
  },

  ar: {
    // Header & Announcement
    announcement: 'صناعة يدوية في بنغلاديش · توصيل سريع لجميع أنحاء العالم · دفع 50% مقدماً للسجاد المخصص',
    shopRugs: 'تسوق السجاد',
    customRugStudio: 'استوديو السجاد المخصص',
    tuftingSupplies: 'معدات التفريغ والغزل',
    juteHandicrafts: 'مشغولات الخيش والجوت',
    trackOrder: 'تتبع الطلب',
    aboutAtelier: 'عن الاستوديو',
    search: 'بحث في الكتالوج',
    wishlist: 'المفضلة',
    cart: 'حقيبة التسوق',
    account: 'الحساب',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    clientDashboard: 'لوحة العميل',
    adminConsole: 'لوحة الإدارة',
    language: 'اللغة',
    currency: 'العملة',
    menu: 'القائمة',
    close: 'إغلاق',

    // Hero & Home
    heroTitle: 'سجاد فاخر مصنوع يدوياً وحرف الجوت الذهبي',
    heroSubtitle: 'مباشرة من أنوال الحرفيين في بنغلاديش. صوف نيوزيلندي فاخر وألياف الجوت النقية المصنوعة بأعلى معايير الإتقان.',
    designCustomRug: 'صمم سجادتك المخصصة',
    tuftingSuppliesBtn: 'معدات التفريغ',
    readyMadeRugs: 'سجاد جاهز',
    exploreCollection: 'استكشف التشكيلة',
    discoverMore: 'اكتشف المزيد',

    // Product Cards & Catalog
    bestSeller: 'الأكثر مبيعاً',
    newArrival: 'وصل حديثاً',
    quickView: 'معاينة سريعة',
    addToBag: 'أضف للحقيبة',
    addedToBag: 'تمت الإضافة',
    outOfStock: 'نفد المخزون',
    inStock: 'متوفر',
    viewDetails: 'عرض التفاصيل',
    price: 'السعر',
    filterByCategory: 'تصنيف المنتجات',
    allProducts: 'جميع المنتجات',
    sortBy: 'ترتيب حسب',
    priceLowHigh: 'السعر: من الأقل للأعلى',
    priceHighLow: 'السعر: من الأعلى للأقل',

    // Pricing & Breakdown
    baseRate: 'السعر الأساسي',
    totalArea: 'مساحة السجاد الإجمالية',
    yarnUpgrade: 'ترقية خيوط الغزل',
    pileDepth: 'عمق وبروز الوبر',
    shapeContour: 'شكل محيطي خاص',
    selectedAddons: 'الإضافات المختارة',
    estimatedTotal: 'الإجمالي المقدر',
    advanceModel: 'نموذج دفعة مقدمة 50%',
    securesLoom: 'يحجز نول الحرفيين المباشر',
    payNowAdvance: 'ادفع الآن (50% مقدماً)',
    toStartTufting: 'لبدء الحياكة اليدوية',
    dueOnDelivery: 'مستحق عند الاستلام النهائي',
    remainingBalance: 'المتبقي 50% عند التسليم',

    // Custom Rug Studio
    customStudioTitle: 'استوديو تصميم السجاد التفاعلي',
    selectShape: '١. اختر الشكل',
    dimensions: '٢. الأبعاد والوحدة',
    width: 'العرض',
    length: 'الطول',
    diameter: 'القطر',
    unit: 'الوحدة',
    pileHeight: '٣. كثافة وارتفاع الوبر',
    backingMaterial: '٤. البطانة السفلية والتشطيب',
    yarnType: '٥. نوع خيوط الصوف',
    colorSelection: '٦. لوحة ألوان الأتيليه',
    rectangle: 'مستطيل',
    square: 'مربع',
    circle: 'دائري',
    oval: 'بيضاوي',
    customShape: 'شكل مخصص',

    // Cart & Checkout
    yourCart: 'حقيبة التسوق الخاصة بك',
    cartEmpty: 'حقيبة التسوق فارغة',
    emptyCartMessage: 'استكشف تشكيلاتنا اليدوية الفاخرة لإضفاء الأصافة والجمال على منزلك.',
    continueShopping: 'متابعة التسوق',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    freeShipping: 'شحن دولي سريع مجاني',
    checkout: 'إتمام الشراء',
    fullName: 'الاسم الكامل',
    emailAddress: 'البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    shippingAddress: 'عنوان الشحن',
    city: 'المدينة',
    postalCode: 'الرمز البريدي',
    country: 'الدولة',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: '50% دفعة أولى + الباقي عند الاستلام',
    onlinePayment: 'دفع إلكتروني دولي كامل',
    placeOrder: 'تأكيد الطلب',
    orderPlaced: 'تم تقديم الطلب بنجاح!',
    orderConfirmation: 'تم تأكيد طلبك مع نخبة النساجين في دكا.',

    // Tracking
    trackYourOrder: 'تتبع طلبك الحرفي',
    orderIdPlaceholder: 'أدخل رقم الطلب (مثال: CT-8942)',
    trackButton: 'تتبع الحالة',
    orderStatus: 'حالة الطلب',
    orderedOn: 'تاريخ الطلب',
    estimatedDelivery: 'التسليم المتوقع',
    statusPending: 'تم استلام الطلب',
    statusProcessing: 'صباغة الخيوط والتحضير',
    statusTufting: 'الحياكة على النول اليدوي',
    statusShipped: 'في الشحن الدولي',
    statusDelivered: 'تم التسليم بنجاح',

    // Wishlist
    myWishlist: 'قائمة الرغبات',
    wishlistEmpty: 'قائمة الرغبات فارغة حالياً',
    moveToCart: 'نقل للحقيبة',
    clearWishlist: 'تفريغ القائمة',

    // Footer
    brandQuote: 'يقدم كرافتنج آند تفتنج سجاداً مصنعاً يدوياً ومشغولات خيش فائقة التميز تتجاوز معايير الصناعة.',
    satisfactionGuaranteed: 'ضمان الرضا 100%',
    satisfactionGuaranteedDesc: 'ابدأ رحلتك حيث تلتقي الأفكار المبتكرة بالتنفيذ الحرفي الخالي من العيوب.',
    quickLinks: 'روابط سريعة',
    customerCare: 'خدمة العملاء',
    newsletterTitle: 'انضم إلى مجتمع الأتيليه',
    newsletterDesc: 'احصل على دعوات حصرية لأحدث التصاميم والمجموعات الخاصة.',
    subscribe: 'اشتراك',
    subscribed: 'تم الاشتراك بنجاح!',
    allRightsReserved: 'جميع الحقوق محفوظة. صُنع بشغف وإتقان في بنغلاديش.',
  },

  fr: {
    // Header & Announcement
    announcement: 'Fait main au Bangladesh · Livraison Express Mondiale · Acompte de 50% sur mesure',
    shopRugs: 'Collection Tapis',
    customRugStudio: 'Studio Tapis Sur Mesure',
    tuftingSupplies: 'Fournitures Tufting',
    juteHandicrafts: 'Artisanat du Jute',
    trackOrder: 'Suivi de Commande',
    aboutAtelier: 'Notre Atelier',
    search: 'Rechercher',
    wishlist: 'Favoris',
    cart: 'Panier',
    account: 'Compte',
    signIn: 'Connexion',
    signOut: 'Déconnexion',
    clientDashboard: 'Espace Client',
    adminConsole: 'Console Atelier',
    language: 'Langue',
    currency: 'Devise',
    menu: 'Menu',
    close: 'Fermer',

    // Hero & Home
    heroTitle: 'Tapis Tuftés Main & Artisanat Doré en Jute',
    heroSubtitle: 'Directement depuis nos métiers artisanaux au Bangladesh. Acrylique haut de gamme, laine de Nouvelle-Zélande et fibre dorée de jute.',
    designCustomRug: 'Créer un Tapis',
    tuftingSuppliesBtn: 'Outils Tufting',
    readyMadeRugs: 'Tapis Prêts',
    exploreCollection: 'Découvrir la Collection',
    discoverMore: 'En Savoir Plus',

    // Product Cards & Catalog
    bestSeller: 'Meilleure Vente',
    newArrival: 'Nouveauté',
    quickView: 'Aperçu Rapide',
    addToBag: 'Ajouter au Panier',
    addedToBag: 'Ajouté au Panier',
    outOfStock: 'Rupture de Stock',
    inStock: 'En Stock',
    viewDetails: 'Détails du Produit',
    price: 'Prix',
    filterByCategory: 'Filtrer par Catégorie',
    allProducts: 'Tous les Produits',
    sortBy: 'Trier par',
    priceLowHigh: 'Prix : Croissant',
    priceHighLow: 'Prix : Décroissant',

    // Pricing & Breakdown
    baseRate: 'Tarif de Base',
    totalArea: 'Surface Totale du Tapis',
    yarnUpgrade: 'Qualité du Fil',
    pileDepth: 'Épaisseur et Relief du Velours',
    shapeContour: 'Découpe Forme Spéciale',
    selectedAddons: 'Options Sélectionnées',
    estimatedTotal: 'Total Estimé',
    advanceModel: 'Modèle Acompte 50%',
    securesLoom: 'Réserve le Métier Artisan',
    payNowAdvance: 'Payer Maintenant (50% Acompte)',
    toStartTufting: 'Pour débuter le tuftage manuel',
    dueOnDelivery: 'Solde à la Livraison',
    remainingBalance: 'Solde Restant de 50%',

    // Custom Rug Studio
    customStudioTitle: 'Studio Interactif Tapis Sur Mesure',
    selectShape: '1. Choisissez la Forme',
    dimensions: '2. Dimensions & Unité',
    width: 'Largeur',
    length: 'Longueur',
    diameter: 'Diamètre',
    unit: 'Unité',
    pileHeight: '3. Hauteur & Densité de Velours',
    backingMaterial: '4. Finition Envers & Antidérapant',
    yarnType: '5. Fibre de Laine & Fil',
    colorSelection: '6. Palette Atelier',
    rectangle: 'Rectangle',
    square: 'Carré',
    circle: 'Rond',
    oval: 'Ovale',
    customShape: 'Forme Libre',

    // Cart & Checkout
    yourCart: 'Votre Panier',
    cartEmpty: 'Votre panier est vide',
    emptyCartMessage: 'Découvrez nos pièces d’artisanat faites main pour habiller votre intérieur d’exception.',
    continueShopping: 'Continuer mes Achats',
    orderSummary: 'Récapitulatif de Commande',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    freeShipping: 'Livraison Express Mondiale Offerte',
    checkout: 'Commander',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse Email',
    phoneNumber: 'Numéro de Téléphone',
    shippingAddress: 'Adresse de Livraison',
    city: 'Ville',
    postalCode: 'Code Postal',
    country: 'Pays',
    paymentMethod: 'Mode de Règlement',
    cashOnDelivery: '50% Acompte + Solde à la Livraison',
    onlinePayment: 'Paiement International par Carte',
    placeOrder: 'Confirmer la Commande',
    orderPlaced: 'Commande Enregistrée avec Succès !',
    orderConfirmation: 'Votre commande sur mesure est confiée à nos maîtres tisserands à Dhaka.',

    // Tracking
    trackYourOrder: 'Suivi de Votre Pièce Atelier',
    orderIdPlaceholder: 'Entrez votre numéro de commande (ex: CT-8942)',
    trackButton: 'Suivre le Statut',
    orderStatus: 'Statut Actuel',
    orderedOn: 'Commandé le',
    estimatedDelivery: 'Livraison Estimée',
    statusPending: 'Commande Reçue',
    statusProcessing: 'Teinture & Préparation des Laines',
    statusTufting: 'Tuftage Manuel sur Métier',
    statusShipped: 'En Transit International',
    statusDelivered: 'Livré à Domicile',

    // Wishlist
    myWishlist: 'Mes Favoris',
    wishlistEmpty: 'Votre liste de favoris est vide',
    moveToCart: 'Ajouter au Panier',
    clearWishlist: 'Vider les Favoris',

    // Footer
    brandQuote: 'Crafting & Tufting conçoit des tapis d’artisanat d’art et des créations en jute dorée qui subliment les plus beaux intérieurs.',
    satisfactionGuaranteed: 'Garantie de Satisfaction 100%',
    satisfactionGuaranteedDesc: 'Là où les inspirations sur mesure rencontrent l’excellence artisanale.',
    quickLinks: 'Accès Rapide',
    customerCare: 'Service Client',
    newsletterTitle: 'Rejoindre le Cercle Atelier',
    newsletterDesc: 'Recevez nos invitations exclusives et carnets d’atelier en avant-première.',
    subscribe: 'S’inscrire',
    subscribed: 'Inscription Confirmée !',
    allRightsReserved: 'Tous droits réservés. Façonné avec passion au Bangladesh.',
  },

  de: {
    // Header & Announcement
    announcement: 'Handgefertigt in Bangladesch · Weltweiter Expressversand · 50% Anzahlung für Maßteppiche',
    shopRugs: 'Teppiche Kaufen',
    customRugStudio: 'Maßteppich Studio',
    tuftingSupplies: 'Tufting Zubehör',
    juteHandicrafts: 'Jute Handwerk',
    trackOrder: 'Bestellung Verfolgen',
    aboutAtelier: 'Über Atelier',
    search: 'Katalog Durchsuchen',
    wishlist: 'Wunschliste',
    cart: 'Warenkorb',
    account: 'Konto',
    signIn: 'Anmelden',
    signOut: 'Abmelden',
    clientDashboard: 'Kundenbereich',
    adminConsole: 'Atelier Konsole',
    language: 'Sprache',
    currency: 'Währung',
    menu: 'Menü',
    close: 'Schließen',

    // Hero & Home
    heroTitle: 'Handgetuftete Maßteppiche & Kunsthandwerk aus Goldjute',
    heroSubtitle: 'Direkt von unseren Webern in Bangladesch. Hochwertiges Acryl, Neuseelandwolle und feinstes Jutehandwerk.',
    designCustomRug: 'Teppich Gestalten',
    tuftingSuppliesBtn: 'Tufting Zubehör',
    readyMadeRugs: 'Fertige Teppiche',
    exploreCollection: 'Kollektionen Entdecken',
    discoverMore: 'Mehr Erfahren',

    // Product Cards & Catalog
    bestSeller: 'Bestseller',
    newArrival: 'Neuheit',
    quickView: 'Schnellansicht',
    addToBag: 'In den Warenkorb',
    addedToBag: 'Hinzugefügt',
    outOfStock: 'Ausverkauft',
    inStock: 'Auf Lager',
    viewDetails: 'Produktdetails',
    price: 'Preis',
    filterByCategory: 'Nach Kategorie Filtern',
    allProducts: 'Alle Produkte',
    sortBy: 'Sortieren nach',
    priceLowHigh: 'Preis: Aufsteigend',
    priceHighLow: 'Preis: Absteigend',

    // Pricing & Breakdown
    baseRate: 'Grundpreis',
    totalArea: 'Gesamtfläche des Teppichs',
    yarnUpgrade: 'Garn-Upgrade',
    pileDepth: 'Florhöhe & Relieftiefe',
    shapeContour: 'Sonderform-Zuschlag',
    selectedAddons: 'Gewählte Zusatzoptionen',
    estimatedTotal: 'Geschätzter Gesamtpreis',
    advanceModel: '50% Anzahlungsmodell',
    securesLoom: 'Reserviert den Webstuhl',
    payNowAdvance: 'Jetzt Zahlen (50% Anzahlung)',
    toStartTufting: 'Um mit dem Handtuften zu beginnen',
    dueOnDelivery: 'Fällig bei Endlieferung',
    remainingBalance: 'Verbleibende 50% Restsumme',

    // Custom Rug Studio
    customStudioTitle: 'Interaktives Maßteppich-Studio',
    selectShape: '1. Form Wählen',
    dimensions: '2. Maße & Einheit',
    width: 'Breite',
    length: 'Länge',
    diameter: 'Durchmesser',
    unit: 'Einheit',
    pileHeight: '3. Florhöhe & Struktur',
    backingMaterial: '4. Rückenbeschichtung',
    yarnType: '5. Garnfaser',
    colorSelection: '6. Atelier Farbpalette',
    rectangle: 'Rechteck',
    square: 'Quadrat',
    circle: 'Kreis',
    oval: 'Oval',
    customShape: 'Individuelle Form',

    // Cart & Checkout
    yourCart: 'Ihr Warenkorb',
    cartEmpty: 'Ihr Warenkorb ist leer',
    emptyCartMessage: 'Entdecken Sie handgetuftete Meisterwerke für Ihr stilvolles Zuhause.',
    continueShopping: 'Weiter Einkaufen',
    orderSummary: 'Bestellübersicht',
    subtotal: 'Zwischensumme',
    shipping: 'Versand',
    freeShipping: 'Kostenloser Weltweiter Expressversand',
    checkout: 'Zur Kasse',
    fullName: 'Vollständiger Name',
    emailAddress: 'E-Mail-Adresse',
    phoneNumber: 'Telefonnummer',
    shippingAddress: 'Lieferadresse',
    city: 'Stadt',
    postalCode: 'Postleitzahl',
    country: 'Land',
    paymentMethod: 'Zahlungsart',
    cashOnDelivery: '50% Anzahlung + Restbetrag bei Lieferung',
    onlinePayment: 'Vollständige Kartenzahlung',
    placeOrder: 'Bestellung Bestätigen',
    orderPlaced: 'Bestellung Erfolgreich Aufgegeben!',
    orderConfirmation: 'Ihre Maßanfertigung wurde an unsere Meisterweber in Dhaka übermittelt.',

    // Tracking
    trackYourOrder: 'Bestellung Verfolgen',
    orderIdPlaceholder: 'Bestellnummer eingeben (z. B. CT-8942)',
    trackButton: 'Status Prüfen',
    orderStatus: 'Bestellstatus',
    orderedOn: 'Bestellt am',
    estimatedDelivery: 'Voraussichtliche Lieferung',
    statusPending: 'Bestellung Eingegangen',
    statusProcessing: 'Färben & Vorbereitung',
    statusTufting: 'Handtuften am Webstuhl',
    statusShipped: 'Im Internationalen Versand',
    statusDelivered: 'Erfolgreich Zugestellt',

    // Wishlist
    myWishlist: 'Meine Wunschliste',
    wishlistEmpty: 'Ihre Wunschliste ist leer',
    moveToCart: 'In den Warenkorb',
    clearWishlist: 'Wunschliste Leeren',

    // Footer
    brandQuote: 'Crafting & Tufting liefert handgefertigte Unikate und Goldjute-Kreationen höchster Güte.',
    satisfactionGuaranteed: '100% Zufriedenheitsgarantie',
    satisfactionGuaranteedDesc: 'Wo maßgeschneiderte Visionen auf vollendete Handwerkskunst treffen.',
    quickLinks: 'Schnellzugriff',
    customerCare: 'Kundenservice',
    newsletterTitle: 'Dem Atelier-Kreis Beitreten',
    newsletterDesc: 'Erhalten Sie exklusive Vorschauen auf neue Kollektionen und Atelier-Tagebücher.',
    subscribe: 'Abonnieren',
    subscribed: 'Erfolgreich Abonniert!',
    allRightsReserved: 'Alle Rechte vorbehalten. Mit Leidenschaft in Bangladesch handgefertigt.',
  },
};

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  currentLanguageConfig: LanguageConfig;
  allLanguages: LanguageConfig[];
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'ct_language_pref';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && LANGUAGES[saved]) return saved;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (code: LanguageCode) => {
    if (LANGUAGES[code]) {
      setLanguageState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    const config = LANGUAGES[language];
    if (config?.dir) {
      document.documentElement.dir = config.dir;
      document.documentElement.lang = config.code;
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageConfig: LANGUAGES[language],
        allLanguages: Object.values(LANGUAGES),
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

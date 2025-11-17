export const notifications = {
  product: {
    addSuccess: "Mahsulot muvaffaqiyatli qo‘shildi",
    updateSuccess: "Mahsulot yangilandi",
    deleteSuccess: "Mahsulot o‘chirildi",
    notFound: "Xato: mahsulot topilmadi",
    outOfStock: "Omborda mahsulot yetarli emas",
  },
  sale: {
    createSuccess: "Sotuv muvaffaqiyatli amalga oshirildi",
    createError: "Sotuvni amalga oshirishda xato yuz berdi",
    createDebt: "Sotuv qarzga yozildi",
    printSuccess: "Chek muvaffaqiyatli chop etildi",
    printError: "Chekni chop etishda xato yuz berdi",
  },
  client: {
    addSuccess: "Mijoz qo‘shildi",
    updateSuccess: "Mijoz ma’lumotlari yangilandi",
    deleteSuccess: "Mijoz o‘chirildi",
    notFound: "Mijoz topilmadi",
    smsSuccess: "SMS yuborildi",
    smsError: "SMS yuborishda xato yuz berdi",
  },
  analytics: {
    loadSuccess: "Tahlil ma’lumotlari yangilandi",
    loadError: "Tahlilni yuklashda xato yuz berdi",
  },
  settings: {
    saveSuccess: "Sozlamalar saqlandi",
    filterApplied: "Filtr qo‘llanildi",
    filterError: "Filtrni qo‘llashda xato",
    filterReset: "Filtrlar tiklandi",
  },
  sms: {
    templateCreated: "Shablon muvaffaqiyatli yaratildi",
    templateUpdated: "Shablon yangilandi",
    templateDeleted: "Shablon o‘chirildi",
    sentSuccess: "SMS yuborildi",
    sentError: "SMS yuborishda xato",
  },
  auth: {
    loginSuccess: "Tizimga kirildi",
    logoutSuccess: "Hisobdan chiqildi",
    profileUpdated: "Profil yangilandi",
    loginError: "Login yoki parol noto‘g‘ri",
    sessionExpired: "Sessiya tugadi, qaytadan kiring",
  },
  barcode: {
    found: "Mahsulot topildi",
    notFound: "Shtrix-kod bo‘yicha mahsulot topilmadi",
    scanError: "Skanerlashda xato",
  },
} as const;

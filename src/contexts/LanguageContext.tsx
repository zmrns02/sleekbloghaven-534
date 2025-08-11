import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import noTranslations from '@/locales/no.json';
import enTranslations from '@/locales/en.json';
import trTranslations from '@/locales/tr.json';

export type Language = 'no' | 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  no: {
    // Header
    'nav.home': 'Hjem',
    'nav.menu': 'Meny',
    'nav.about': 'Om oss',
    'nav.contact': 'Kontakt',
    'nav.gallery': 'Galleri',
    'nav.dashboard': 'Dashboard',
    'nav.language': 'Språk',
    
    // Hero
    'hero.title': 'Autentisk Balkan Smak',
    'hero.subtitle': 'Opplev de rike smakene fra Balkan med våre tradisjonelle oppskrifter',
    'hero.cta': 'Se Meny',
    
    // Menu
    'menu.title': 'Vår Meny',
    'menu.addToCart': 'Legg i handlekurv',
    'menu.itemsShown': 'elementer vises',
    'menu.popular': 'Populær',
    'menu.vegetarian': 'Vegetarisk',
    'menu.spicy': 'Sterk',
    'menu.mediumSpicy': 'Middels sterk',
    'menu.selectedOptions': 'Valgte alternativer',
    'menu.normal': 'Normal',
    
    // Categories
    'category.appetizers': 'Forretter',
    'category.mains': 'Hovedretter',
    'category.desserts': 'Desserter',
    'category.drinks': 'Drikker',
    
    // Cart
    'cart.title': 'Handlevogn',
    'cart.empty': 'Handlevognen er tom',
    'cart.total': 'Totalt',
    'cart.orderWhatsApp': 'Bestill via WhatsApp',
    'cart.remove': 'Fjern',
    'cart.quantity': 'Antall',
    
    // Restaurant Info
    'info.title': 'Om Restauranten',
    'info.description': 'Vi serverer autentisk Balkan-mat laget med kjærlighet og tradisjonelle oppskrifter.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.orders': 'Bestillinger',
    'dashboard.revenue': 'Inntekt',
    'dashboard.customers': 'Kunder',
    'dashboard.settings': 'Innstillinger',
    'dashboard.language': 'Språkinnstillinger',
    'dashboard.theme': 'Tema',
    'dashboard.darkMode': 'Mørk modus',
    'dashboard.lightMode': 'Lys modus',
    
    // Language Page
    'language.title': 'Språkinnstillinger',
    'language.description': 'Velg ditt foretrukne språk',
    'language.norwegian': 'Norsk',
    'language.english': 'Engelsk',
    'language.turkish': 'Tyrkisk',
    'language.save': 'Lagre',
    'language.cancel': 'Avbryt',
    'language.available': 'Tilgjengelige språk',
    
    // Order Form
    'order.title': 'Bestillingsinformasjon',
    'order.customerName': 'Navn *',
    'order.customerPhone': 'Telefonnummer *',
    'order.notes': 'Bestillingsnotater (valgfritt)',
    'order.notesPlaceholder': 'Hvis du har spesielle ønsker, kan du skrive dem her...',
    'order.paymentMethod': 'Betalingsmetode *',
    'order.cash': 'Kontant betaling',
    'order.card': 'Kredit-/bankkort',
    'order.vipps': 'Vipps',
    'order.total': 'Totalt beløp',
    'order.cancel': 'Avbryt',
    'order.submit': 'Legg inn bestilling',
    'order.submitting': 'Sender...',
    
    // Orders Manager
    'orders.title': 'Bestillingsadministrasjon',
    'orders.totalCount': 'Totalt {count} bestillinger',
    'orders.noOrders': 'Ingen bestillinger ennå',
    'orders.orderDetails': 'Bestillingsdetaljer',
    'orders.note': 'Notat',
    'orders.status': 'Status',
    'orders.pending': 'Venter',
    'orders.preparing': 'Forbereder',
    'orders.ready': 'Klar',
    'orders.delivered': 'Levert',
    'orders.cancelled': 'Avbrutt',

    // Admin Management
    'admin.menuItems': 'Menü Elementer',
    'admin.menuItemsManagement': 'Menü Element Administrasjon',
    'admin.newMenuItem': 'Nytt Menü Element',
    'admin.editMenuItem': 'Rediger Menü Element',
    'admin.itemName': 'Element Navn',
    'admin.price': 'Pris',
    'admin.category': 'Kategori',
    'admin.selectCategory': 'Velg kategori',
    'admin.description': 'Beskrivelse',
    'admin.image': 'Bilde',
    'admin.uploadImage': 'Last opp bilde',
    'admin.uploading': 'Laster opp...',
    'admin.imageUploaded': 'Bilde lastet opp',
    'admin.preview': 'Forhåndsvisning',
    'admin.prepTime': 'Forberedelsestid (min)',
    'admin.calories': 'Kalorier',
    'admin.available': 'Tilgjengelig',
    'admin.popular': 'Populær',
    'admin.vegetarian': 'Vegetarianer',
    'admin.spicy': 'Krydret',
    'admin.update': 'Oppdater',
    'admin.add': 'Legg til',
    'admin.cancel': 'Avbryt',
    'admin.actions': 'Handlinger',
    'admin.status': 'Status',
    'admin.features': 'Funksjoner',
    'admin.notAvailable': 'Ikke tilgjengelig',
    'admin.confirmDelete': 'Er du sikker på at du vil slette dette elementet?',
    'admin.confirmDeleteCategory': 'Er du sikker på at du vil slette denne kategorien?',
    'admin.categoryManagement': 'Kategoriadministrasjon',
    'admin.newCategory': 'Ny kategori',
    'admin.editCategory': 'Rediger kategori',
    'admin.categoryName': 'Kategorinavn',
    'admin.icon': 'Ikon (emoji eller CSS-klasse)',
    'admin.iconPlaceholder': '🍕 eller fa-pizza',
    'admin.sorting': 'Sortering',
    'admin.order': 'Rekkefølge',
    'admin.categories': 'Kategorier',
    'admin.parentCategory': 'Overordnet kategori',
    'admin.selectParentCategory': 'Velg overordnet kategori',
    'admin.noParentCategory': 'Hovedkategori (ingen overordnet)',
    'admin.unknown': 'Ukjent',
    'admin.tabs.orders': 'Bestillinger',
    'admin.tabs.daily': 'Daglig',
    'admin.tabs.categories': 'Kategorier',
    'admin.tabs.menu': 'Meny',
    'admin.tabs.contact': 'Kontakt',
    'admin.tabs.hours': 'Åpningstider',
    'admin.tabs.settings': 'Innstillinger',

    // Dashboard
    'dashboard.deleteOrder': 'Slett bestilling',
    'dashboard.printOrder': 'Skriv ut bestilling',
    'dashboard.clearOrders': 'Fjern alle bestillinger',
    'dashboard.confirmClear': 'Er du sikker på at du vil fjerne alle bestillinger?',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.gallery': 'Gallery',
    'nav.dashboard': 'Dashboard',
    'nav.language': 'Language',
    
    // Hero
    'hero.title': 'Authentic Balkan Taste',
    'hero.subtitle': 'Experience the rich flavors of the Balkans with our traditional recipes',
    'hero.cta': 'View Menu',
    
    // Menu
    'menu.title': 'Our Menu',
    'menu.addToCart': 'Add to Cart',
    'menu.itemsShown': 'items shown',
    'menu.popular': 'Popular',
    'menu.vegetarian': 'Vegetarian',
    'menu.spicy': 'Spicy',
    'menu.mediumSpicy': 'Medium Spicy',
    'menu.selectedOptions': 'Selected Options',
    'menu.normal': 'Normal',
    
    // Categories
    'category.appetizers': 'Appetizers',
    'category.mains': 'Main Courses',
    'category.desserts': 'Desserts',
    'category.drinks': 'Drinks',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Cart is empty',
    'cart.total': 'Total',
    'cart.orderWhatsApp': 'Order via WhatsApp',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    
    // Restaurant Info
    'info.title': 'About Restaurant',
    'info.description': 'We serve authentic Balkan food made with love and traditional recipes.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to admin panel',
    'dashboard.orders': 'Orders',
    'dashboard.revenue': 'Revenue',
    'dashboard.customers': 'Customers',
    'dashboard.settings': 'Settings',
    'dashboard.language': 'Language Settings',
    'dashboard.theme': 'Theme',
    'dashboard.darkMode': 'Dark Mode',
    'dashboard.lightMode': 'Light Mode',
    'dashboard.todayData': 'Today\'s data • Click',
    'dashboard.loading': 'Loading...',
    'dashboard.activeOrders': 'ACTIVE ORDERS',
    'dashboard.completedOrders': 'COMPLETED ORDERS',
    'dashboard.noActiveOrders': 'No active orders',
    'dashboard.noCompletedOrders': 'No completed orders',
    'dashboard.orderNumber': 'Order #{id}',
    'dashboard.orderPrint': 'Print',
    'dashboard.orderStatus': {
      'pending': 'Pending',
      'preparing': 'Preparing',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    },
    'dashboard.paymentMethod': {
      'cash': 'Cash',
      'card': 'Card',
      'vipps': 'Vipps'
    },
    'dashboard.dailyOrders': 'DAILY ORDERS',
    'dashboard.noDailyOrders': 'No orders today yet',
    'dashboard.note': 'Note:',
    'dashboard.orderPrinted': 'Order Printed',
    'dashboard.orderPrintedDesc': 'Order #{id} is being printed',
    'dashboard.deleteOrder': 'Delete Order',
    'dashboard.printOrder': 'Print Order',
    'dashboard.clearOrders': 'Clear All Orders',
    'dashboard.confirmClear': 'Are you sure you want to clear all orders?',
    
    // Language Page
    'language.title': 'Language Settings',
    'language.description': 'Choose your preferred language',
    'language.norwegian': 'Norwegian',
    'language.english': 'English',
    'language.turkish': 'Turkish',
    'language.save': 'Save',
    'language.cancel': 'Cancel',
    'language.available': 'Available languages',
    
    // Order Form
    'order.title': 'Order Information',
    'order.customerName': 'Name *',
    'order.customerPhone': 'Phone Number *',
    'order.notes': 'Order Notes (optional)',
    'order.notesPlaceholder': 'If you have special requests, you can write them here...',
    'order.paymentMethod': 'Payment Method *',
    'order.cash': 'Cash Payment',
    'order.card': 'Credit/Debit Card',
    'order.vipps': 'Vipps',
    'order.total': 'Total Amount',
    'order.cancel': 'Cancel',
    'order.submit': 'Place Order',
    'order.submitting': 'Submitting...',
    
    // Orders Manager
    'orders.title': 'Order Management',
    'orders.totalCount': 'Total {count} orders',
    'orders.noOrders': 'No orders yet',
    'orders.orderDetails': 'Order Details',
    'orders.note': 'Note',
    'orders.status': 'Status',
    'orders.pending': 'Pending',
    'orders.preparing': 'Preparing',
    'orders.ready': 'Ready',
    'orders.delivered': 'Delivered',
    'orders.cancelled': 'Cancelled',

    // Admin Management
    'admin.menuItems': 'Menu Items',
    'admin.menuItemsManagement': 'Menu Items Management',
    'admin.newMenuItem': 'New Menu Item',
    'admin.editMenuItem': 'Edit Menu Item',
    'admin.itemName': 'Item Name',
    'admin.price': 'Price',
    'admin.category': 'Category',
    'admin.selectCategory': 'Select category',
    'admin.description': 'Description',
    'admin.image': 'Image',
    'admin.uploadImage': 'Upload Image',
    'admin.uploading': 'Uploading...',
    'admin.imageUploaded': 'Image uploaded',
    'admin.preview': 'Preview',
    'admin.prepTime': 'Preparation Time (min)',
    'admin.calories': 'Calories',
    'admin.available': 'Available',
    'admin.popular': 'Popular',
    'admin.vegetarian': 'Vegetarian',
    'admin.spicy': 'Spicy',
    'admin.update': 'Update',
    'admin.add': 'Add',
    'admin.cancel': 'Cancel',
    'admin.actions': 'Actions',
    'admin.status': 'Status',
    'admin.features': 'Features',
    'admin.notAvailable': 'Not Available',
    'admin.confirmDelete': 'Are you sure you want to delete this item?',
    'admin.confirmDeleteCategory': 'Are you sure you want to delete this category?',
    'admin.categoryManagement': 'Category Management',
    'admin.newCategory': 'New Category',
    'admin.editCategory': 'Edit Category',
    'admin.categoryName': 'Category Name',
    'admin.icon': 'Icon (emoji or CSS class)',
    'admin.iconPlaceholder': '🍕 or fa-pizza',
    'admin.sorting': 'Sorting',
    'admin.order': 'Order',
    'admin.categories': 'Categories',
    'admin.parentCategory': 'Parent Category',
    'admin.selectParentCategory': 'Select parent category',
    'admin.noParentCategory': 'Main category (no parent)',
    'admin.unknown': 'Unknown',
    'admin.tabs.orders': 'Orders',
    'admin.tabs.daily': 'Daily',
    'admin.tabs.categories': 'Categories',
    'admin.tabs.menu': 'Menu',
    'admin.tabs.contact': 'Contact',
    'admin.tabs.hours': 'Hours',
    'admin.tabs.settings': 'Settings',
  },
  tr: {
    // Header
    'nav.home': 'Ana Sayfa',
    'nav.menu': 'Menü',
    'nav.about': 'Hakkımızda',
    'nav.contact': 'İletişim',
    'nav.gallery': 'Galeri',
    'nav.dashboard': 'Dashboard',
    'nav.language': 'Dil',
    
    // Hero
    'hero.title': 'Otantik Balkan Lezzeti',
    'hero.subtitle': 'Geleneksel tariflerimizle Balkan\'ların zengin lezzetlerini deneyimleyin',
    'hero.cta': 'Menüyü Görüntüle',
    
    // Menu
    'menu.title': 'Menümüz',
    'menu.addToCart': 'Sepete Ekle',
    'menu.itemsShown': 'öğeler gösteriliyor',
    'menu.popular': 'Popüler',
    'menu.vegetarian': 'Vejetaryen',
    'menu.spicy': 'Acılı',
    'menu.mediumSpicy': 'Orta Acılı',
    'menu.selectedOptions': 'Seçilen Seçenekler',
    'menu.normal': 'Normal',
    
    // Categories
    'category.appetizers': 'Mezeler',
    'category.mains': 'Ana Yemekler',
    'category.desserts': 'Tatlılar',
    'category.drinks': 'İçecekler',
    
    // Cart
    'cart.title': 'Sepet',
    'cart.empty': 'Sepet boş',
    'cart.total': 'Toplam',
    'cart.orderWhatsApp': 'WhatsApp ile Sipariş Ver',
    'cart.remove': 'Kaldır',
    'cart.quantity': 'Adet',
    
    // Restaurant Info
    'info.title': 'Restoran Hakkında',
    'info.description': 'Sevgiyle ve geleneksel tariflerle hazırlanmış otantik Balkan yemekleri sunuyoruz.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Yönetim paneline Velkomst',
    'dashboard.orders': 'Siparişler',
    'dashboard.revenue': 'Gelir',
    'dashboard.customers': 'Müşteriler',
    'dashboard.settings': 'Ayarlar',
    'dashboard.language': 'Dil Ayarları',
    'dashboard.theme': 'Tema',
    'dashboard.darkMode': 'Karanlık Mod',
    'dashboard.lightMode': 'Aydınlık Mod',
    'dashboard.todayData': 'Bugünkü veriler • Tıklayın',
    'dashboard.loading': 'Yükleniyor...',
    'dashboard.activeOrders': 'AKTİF SİPARİŞLER',
    'dashboard.completedOrders': 'TAMAMLANAN SİPARİŞLER',
    'dashboard.noActiveOrders': 'Aktif sipariş yok',
    'dashboard.noCompletedOrders': 'Tamamlanan sipariş yok',
    'dashboard.orderNumber': 'Sipariş #{id}',
    'dashboard.orderPrint': 'Yazdır',
    'dashboard.orderStatus': {
      'pending': 'Bekliyor',
      'preparing': 'Hazırlanıyor',
      'ready': 'Hazır',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal'
    },
    'dashboard.paymentMethod': {
      'cash': 'Nakit',
      'card': 'Kart',
      'vipps': 'Vipps'
    },
    'dashboard.dailyOrders': 'GÜNLÜK SİPARİŞLER',
    'dashboard.noDailyOrders': 'Bugün henüz sipariş yok',
    'dashboard.note': 'Not:',
    'dashboard.orderPrinted': 'Sipariş Yazdırıldı',
    'dashboard.orderPrintedDesc': 'Sipariş #{id} yazdırılıyor',
    'dashboard.deleteOrder': 'Siparişi Sil',
    'dashboard.printOrder': 'Siparişi Yazdır',
    'dashboard.clearOrders': 'Tüm Siparişleri Temizle',
    'dashboard.confirmClear': 'Tüm siparişleri silmek istediğinizden emin misiniz?',
    
    // Language Page
    'language.title': 'Dil Ayarları',
    'language.description': 'Tercih ettiğiniz dili seçin',
    'language.norwegian': 'Norveççe',
    'language.english': 'İngilizce',
    'language.turkish': 'Türkçe',
    'language.save': 'Kaydet',
    'language.cancel': 'İptal',
    'language.available': 'Mevcut diller',
    
    // Order Form
    'order.title': 'Sipariş Bilgileri',
    'order.customerName': 'Adınız Soyadınız *',
    'order.customerPhone': 'Telefon Numaranız *',
    'order.notes': 'Sipariş Notu (İsteğe bağlı)',
    'order.notesPlaceholder': 'Özel talepleriniz varsa buraya yazabilirsiniz...',
    'order.paymentMethod': 'Ödeme Yöntemi *',
    'order.cash': 'Nakit Ödeme',
    'order.card': 'Kredi/Banka Kartı',
    'order.vipps': 'Vipps',
    'order.total': 'Toplam Tutar',
    'order.cancel': 'İptal',
    'order.submit': 'Sipariş Ver',
    'order.submitting': 'Gönderiliyor...',
    
    // Orders Manager
    'orders.title': 'Sipariş Yönetimi',
    'orders.totalCount': 'Toplam {count} sipariş',
    'orders.noOrders': 'Henüz sipariş bulunmuyor',
    'orders.orderDetails': 'Sipariş Detayları',
    'orders.note': 'Not',
    'orders.status': 'Durum',
    'orders.pending': 'Bekliyor',
    'orders.preparing': 'Hazırlanıyor',
    'orders.ready': 'Hazır',
    'orders.delivered': 'Teslim Edildi',
    'orders.cancelled': 'İptal Edildi',

    // Admin Management
    'admin.menuItems': 'Menü Öğeleri',
    'admin.menuItemsManagement': 'Menü Öğeleri Yönetimi',
    'admin.newMenuItem': 'Yeni Menü Öğesi',
    'admin.editMenuItem': 'Menü Öğesi Düzenle',
    'admin.itemName': 'Öğe Adı',
    'admin.price': 'Fiyat (kr)',
    'admin.category': 'Kategori',
    'admin.selectCategory': 'Kategori seçin',
    'admin.description': 'Açıklama',
    'admin.image': 'Resim',
    'admin.uploadImage': 'Resim Yükle',
    'admin.uploading': 'Yükleniyor...',
    'admin.imageUploaded': 'Resim yüklendi',
    'admin.preview': 'Önizleme',
    'admin.prepTime': 'Hazırlık Süresi (dk)',
    'admin.calories': 'Kalori',
    'admin.available': 'Mevcut',
    'admin.popular': 'Popüler',
    'admin.vegetarian': 'Vejetaryen',
    'admin.spicy': 'Acılı',
    'admin.update': 'Güncelle',
    'admin.add': 'Ekle',
    'admin.cancel': 'İptal',
    'admin.actions': 'İşlemler',
    'admin.status': 'Durum',
    'admin.features': 'Özellikler',
    'admin.notAvailable': 'Mevcut Değil',
    'admin.confirmDelete': 'Bu menü öğesini silmek istediğinizden emin misiniz?',
    'admin.confirmDeleteCategory': 'Bu kategoriyi silmek istediğinizden emin misiniz?',
    'admin.categoryManagement': 'Kategori Yönetimi',
    'admin.newCategory': 'Yeni Kategori',
    'admin.editCategory': 'Kategori Düzenle',
    'admin.categoryName': 'Kategori Adı',
    'admin.icon': 'İkon (emoji veya CSS class)',
    'admin.iconPlaceholder': '🍕 veya fa-pizza',
    'admin.sorting': 'Sıralama',
    'admin.order': 'Sıra',
    'admin.categories': 'Kategoriler',
    'admin.parentCategory': 'Üst Kategori',
    'admin.selectParentCategory': 'Üst kategori seçin',
    'admin.noParentCategory': 'Ana kategori (üst kategori yok)',
    'admin.unknown': 'Bilinmiyor',
    'admin.tabs.orders': 'Siparişler',
    'admin.tabs.daily': 'Günlük',
    'admin.tabs.categories': 'Kategoriler',
    'admin.tabs.menu': 'Menü',
    'admin.tabs.contact': 'İletişim',
    'admin.tabs.hours': 'Saatler',
    'admin.tabs.settings': 'Ayarlar',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('no'); // Norwegian as default

  const t = (key: string): string => {
    // First check in the imported JSON files
    const externalTranslations = {
      'no': noTranslations,
      'en': enTranslations,
      'tr': trTranslations
    };
    
    // Check if the key exists in the external translations
    if (externalTranslations[language] && externalTranslations[language][key]) {
      return externalTranslations[language][key];
    }
    
    // If not found in external translations, check in the inline translations
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
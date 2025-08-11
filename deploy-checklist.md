# Balkan Porsgrunn Web Sitesi Yayınlama Kontrol Listesi

## Yayınlama Öncesi Kontroller

- [ ] Tüm içerikler ve görseller hazır ve doğru
- [ ] Tüm bağlantılar çalışıyor
- [ ] Responsive tasarım tüm cihazlarda test edildi
- [ ] SEO meta etiketleri doğru şekilde ayarlandı
- [ ] Favicon doğru şekilde ayarlandı
- [ ] Performans optimizasyonları yapıldı

## Yayınlama Adımları

### 1. Web Hosting Hazırlığı

- [ ] Web hosting hesabı aktif
- [ ] Alan adı (balkanporsgrunn.com) satın alındı ve DNS ayarları yapıldı
- [ ] SSL sertifikası kuruldu (HTTPS için)

### 2. Dosya Yükleme

- [ ] `dist` klasöründeki tüm dosyaları FTP ile web sunucusunun kök dizinine yükleyin
- [ ] `.htaccess` dosyasının doğru şekilde yüklendiğinden emin olun
- [ ] Dosya izinlerini kontrol edin (genellikle dosyalar için 644, klasörler için 755)

### 3. Yayın Sonrası Kontroller

- [ ] Site ana sayfası doğru şekilde yükleniyor
- [ ] Tüm sayfalar ve yönlendirmeler çalışıyor
- [ ] Formlar doğru şekilde çalışıyor
- [ ] Mobil görünüm doğru şekilde çalışıyor
- [ ] Sayfa yükleme hızı kabul edilebilir seviyede

## Yaygın Sorunlar ve Çözümleri

### 404 Hatası (Sayfa Bulunamadı)

- `.htaccess` dosyasının doğru şekilde yüklendiğinden emin olun
- Sunucunun `.htaccess` dosyalarını desteklediğinden emin olun
- Dosya yollarının doğru olduğundan emin olun

### Stil veya Script Dosyaları Yüklenmiyor

- Tarayıcı konsolunda hataları kontrol edin
- Dosya yollarının doğru olduğundan emin olun
- CORS hatalarını kontrol edin

### HTTPS Sorunları

- SSL sertifikasının doğru şekilde kurulduğundan emin olun
- Karışık içerik (mixed content) uyarılarını kontrol edin
- `.htaccess` dosyasındaki HTTPS yönlendirmelerini kontrol edin

## Önemli Notlar

- Web sunucunuz Apache ise, `.htaccess` dosyası otomatik olarak çalışacaktır
- Web sunucunuz Nginx ise, `.htaccess` dosyasındaki yönlendirmeleri Nginx yapılandırmasına uygun şekilde dönüştürmeniz gerekebilir
- Supabase veya başka bir backend servisi kullanıyorsanız, API anahtarlarının ve URL'lerin doğru şekilde yapılandırıldığından emin olun

## Yardımcı Kaynaklar

- [Vite Dağıtım Kılavuzu](https://vitejs.dev/guide/static-deploy.html)
- [React Router ile Statik Hosting](https://reactrouter.com/en/main/guides/static-hosting)
- [Apache .htaccess Kılavuzu](https://httpd.apache.org/docs/current/howto/htaccess.html)
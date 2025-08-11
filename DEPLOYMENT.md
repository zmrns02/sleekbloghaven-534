# Balkan Porsgrunn Web Sitesi Dağıtım Kılavuzu

## Yapılan Değişiklikler

Web sitenizin doğru şekilde yayınlanabilmesi için aşağıdaki değişiklikler yapılmıştır:

1. **Vite Yapılandırması Düzeltildi**: `vite.config.ts` dosyasındaki `base` parametresi `/balkanporsgrunn.com/` yerine `/` olarak değiştirildi. Bu, sitenin kök dizinde çalışmasını sağlar.

2. **.htaccess Dosyası Güncellendi**: Sunucu yapılandırması, www olmadan ana domain yönlendirmesi ve SPA (Single Page Application) yönlendirmeleri için optimize edildi.

3. **Proje Yeniden Derlendi**: Yapılan değişikliklerle proje yeniden derlenerek güncel `dist` klasörü oluşturuldu.

## Dağıtım Adımları

1. **FTP ile Dosya Yükleme**:
   - Bir FTP istemcisi kullanarak (FileZilla, WinSCP vb.) web sunucunuza bağlanın.
   - `dist` klasöründeki tüm dosyaları web sunucunuzun kök dizinine (`public_html`, `www` veya `htdocs` olabilir) yükleyin.

2. **Alan Adı Yapılandırması**:
   - Alan adınızın (balkanporsgrunn.com) DNS ayarlarının web sunucunuza doğru şekilde yönlendirildiğinden emin olun.
   - SSL sertifikanızın (HTTPS için) doğru şekilde yapılandırıldığından emin olun.

3. **Sunucu Gereksinimleri**:
   - Web sunucunuzun (Apache, Nginx vb.) `.htaccess` dosyalarını desteklediğinden emin olun.
   - Eğer Nginx kullanıyorsanız, `.htaccess` dosyasındaki yönlendirmeleri Nginx yapılandırmasına uygun şekilde dönüştürmeniz gerekebilir.

## Sorun Giderme

Eğer site hala açılmıyorsa, aşağıdaki adımları kontrol edin:

1. **Dosya İzinleri**: Tüm dosyaların doğru izinlere sahip olduğundan emin olun (genellikle dosyalar için 644, klasörler için 755).

2. **Sunucu Hata Günlükleri**: Sunucu hata günlüklerini kontrol ederek olası sorunları tespit edin.

3. **Tarayıcı Önbelleği**: Tarayıcı önbelleğini temizleyerek yeni değişikliklerin görüntülenmesini sağlayın.

4. **CORS Sorunları**: Eğer API çağrıları yapılıyorsa, CORS (Cross-Origin Resource Sharing) ayarlarının doğru yapılandırıldığından emin olun.

## İletişim

Eğer dağıtım sırasında herhangi bir sorunla karşılaşırsanız, lütfen geliştirici ekibiyle iletişime geçin.
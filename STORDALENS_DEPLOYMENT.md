# Stordalens.xyz Web Sitesi Dağıtım Kılavuzu

## Yapılan Değişiklikler

Web sitenizin stordalens.xyz alan adında doğru şekilde yayınlanabilmesi için aşağıdaki değişiklikler yapılmıştır:

1. **Vite Yapılandırması Güncellendi**: `vite.config.ts` dosyasındaki `base` parametresi `/stordalens.xyz/` yerine `/` olarak değiştirildi. Bu, sitenin doğrudan kök dizinde çalışmasını sağlar.

2. **React Router Yapılandırması Güncellendi**: `App.tsx` dosyasındaki `BrowserRouter` bileşeninden `basename` parametresi kaldırıldı. Bu, React Router'ın kök dizinde doğru şekilde çalışmasını sağlar.

3. **.htaccess Dosyası Güncellendi**: Sunucu yapılandırması, www olmadan ana domain yönlendirmesi ve SPA (Single Page Application) yönlendirmeleri için optimize edildi. RewriteBase / olarak ayarlandı.

4. **index.html Dosyası Güncellendi**: Başlık ve açıklama meta etiketleri "Stordalens" ve "Stordalens - Profesyonel web hizmetleri" olarak değiştirildi.

5. **Proje Yeniden Derlendi**: Yapılan değişikliklerle proje yeniden derlenerek güncel `dist` klasörü oluşturuldu.

## Dağıtım Adımları

1. **FTP ile Dosya Yükleme**:
   - Bir FTP istemcisi kullanarak (FileZilla, WinSCP vb.) web sunucunuza bağlanın.
   - `dist` klasöründeki tüm dosyaları web sunucunuzun kök dizinine (`public_html`, `www` veya `htdocs` olabilir) yükleyin.

2. **Alan Adı Yapılandırması**:
   - `stordalens.xyz` alan adınızın DNS ayarlarının web sunucunuza doğru şekilde yönlendirildiğinden emin olun.
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

## Alternatif Yapılandırma: Kök Dizinde Çalıştırma

Eğer sitenizi alt dizin yerine doğrudan kök dizinde çalıştırmak isterseniz, aşağıdaki değişiklikleri yapabilirsiniz:

1. `vite.config.ts` dosyasındaki `base` parametresini `/` olarak değiştirin.
2. Projeyi yeniden derleyin: `npm run build`
3. Oluşturulan `dist` klasöründeki dosyaları web sunucunuzun kök dizinine yükleyin.

Bu durumda, site doğrudan `https://stordalens.xyz/` adresinde çalışacaktır, alt dizin olmadan.

## İletişim

Eğer dağıtım sırasında herhangi bir sorunla karşılaşırsanız, lütfen geliştirici ekibiyle iletişime geçin.
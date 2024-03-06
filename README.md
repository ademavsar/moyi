## [moyi: minimal video flascard app](https://github.com/ademavsar/moyi)
dil öğrenimim için anki ve benzeri flascard uygulamalarında videolu flashcard'lar oluşturamayınca (bu uygulamalar böyle bir çalışma için sizi çok sınırlıyor) basit bir çözüm olarak moyi'yi geliştirdim. 

desteleri oluşturmak için yazdığım **[split-video-by-srt-using-ffmpeg](https://github.com/ademavsar/split-video-by-srt-using-ffmpeg)** scripti ile video bölümleme yapabilir ve oluşturduğunuz dosyaları "deck" klasörüne taşıyarak kendi çalışma destenizi oluşturabilirsiniz.

## demo
[![YouTube](/static/moyi_cover.png)](https://www.youtube.com/embed/ohlDFgKh-KU?si=i6MXtbsQ5p4WaZZ4)

## girizgâh
moyi, video içerikli flashcard'lar aracılığıyla dil öğrenmeyi eğlenceli ve etkili bir hale getiren, yerel sunucuda çalışan basit bir uygulamadır. 

öğrenim sürecinizi görsel ve işitsel materyallerle zenginleştirerek dil öğrenim metodolojinizi çok daha üst seviyelere çıkarabilirsiniz.

## özellikler
- kendi videolarınız ve alt yazılarınızla özelleştirilebilir dil öğrenme deneyimi
- i̇lerlemenizi takip edebileceğiniz sıralı video flashcard'lar
- kullanıcı dostu arayüz, minimal tasarım

## ön koşullar
moyi'yi çalıştırmak için aşağıdaki araçların yüklü olması gerekir:

- python 3.6 veya üstü
- pip (python paket yöneticisi)

## kurulum
1. projeyi klonlayın:

```bash
git clone https://github.com/ademavsar/moyi
```
ya da zip olarak indirin.

2. proje dizinine gidin:

```bash
cd moyi
```

3. gerekli python paketlerini yükleyin:

```bash
pip install -r requirements.txt
```

4. uygulamayı çalıştırın:

```bash
python moyi.py
```

veya ``moyi.py``'yi çalıştırın.
## kullanım
moyi.py dosyasını çalıştırdıktan sonra [``http://127.0.0.1:5000/``](http://127.0.0.1:5000/) adresine gidin.

önceki/sonraki video butonları, rastgele video butonu, alt yazı metnini göster/gizle butonu, önceki/sonraki alt yazıya geçiş butonları ve gizle butonunu göreceksiniz.

o videoflashcard sizin için tamamsa gizle butonuna (yeşil buton) tıklayın.

oldukça basit. iyi çalışmalar.

## not
modern tarayıcılardaki otomatik media oynatma politikası, uygulama için problem çıkarabilir. site (``http://127.0.0.1:5000``) ayarlarını düzgün yapılandırdığınızdan emin olun!

``moyi-chrome.py`` dosyası, açılışta chrome tarayıcıyı da başlatıyor. chrome veya başka bir tarayıcı da olabilir, hangi tarayıcıyı başlatmak istiyorsanız ``moyi-chrome.py`` dosyasındaki uygulama yolunu güncelleyin.
# moyi: minimal video flascard app
anki ve benzeri flascard uygulamalarında videolu flashcard'lar oluşturamayınca (bu uygulamalar böyle bir çalışma için sizi çok sınırlıyor) basit bir çözüm olarak moyi'yi geliştirdim. izlediğiniz herhangi bir videoyu, alt yazıları referans alarak kesip videolu flashcard'larınızı oluşturabilir ve dil öğrenim metodolojinizi çok daha üst seviyelere çıkarabilirsiniz.

**[split-video-by-srt-using-ffmpeg](https://github.com/ademavsar/split-video-by-srt-using-ffmpeg)** ile video bölümleme yapabilir ve oluşturduğunuz dosyaları "deck" klasörüne taşıyarak kendi çalışma destenizi oluşturabilirsiniz.

daha iyi anlayabilmeniz ve örnek olması için, friends'in ilk bölümüne ait oluşturduğum desteyi de paylaştım. 

# girizgâh

moyi, video içerikli flashcard'lar aracılığıyla dil öğrenmeyi eğlenceli ve etkili bir hale getiren bir uygulamadır. öğrenim sürecinizi görsel ve işitsel materyallerle zenginleştirerek dil öğrenimini daha interaktif ve keyifli bir deneyime dönüştürür.

# özellikler

- kendi videolarınız ve alt yazılarınızla özelleştirilebilir dil öğrenme deneyimi
- i̇lerlemenizi takip edebileceğiniz sıralı video flashcard'lar
- kullanıcı dostu arayüz, minimal tasarım

## önkoşullar

moyi'yi çalıştırmak için aşağıdaki araçların yüklü olması gerekir:

- python 3.6 veya üstü
- pip (python paket yöneticisi)

## kurulum

1. projeyi klonlayın:

```
git clone https://github.com/ademavsar/moyi
```

2. proje dizinine gidin:

```
cd moyi
```

3. gerekli python paketlerini yükleyin:

```
pip install -r requirements.txt
```

4. uygulamayı çalıştırın:

```
python moyi.py
```

``moyi.py``'yi çift tıklayarak da çalıştırabilirsiniz. 

## kullanım

uygulama çalıştığında, varsayılan web tarayıcınız otomatik olarak açılır ve moyi'nin ana sayfasına yönlendirilirsiniz. videolar arasında gezinmek, cevapları göstermek/gizlemek ve videoları değerlendirmek için ekrandaki kontrolleri kullanabilirsiniz.

## güncelleme notları

- requirements.txt güncellendi
- indicator (gösterge), geçerli video sayısı yerine video ismi (uzantısız) olacak şekilde güncellendi
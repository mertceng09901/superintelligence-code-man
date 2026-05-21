const https = require('https');

/**
 * POST /api/ai/seller-chat
 * Gemini AI ile satıcı simülasyonu.
 * API key yoksa akıllı fallback cevapları döndürür.
 */
exports.sellerChat = async (req, res) => {
    try {
        const { message, productName, productBrand, productPrice, productSpecs, productDescription } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Mesaj boş olamaz.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        // Gemini API key yoksa akıllı fallback cevap ver
        if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
            return res.json({ reply: getSmartFallback(message, productName, productBrand, productPrice) });
        }

        // Ürün bilgilerini zengin bağlam olarak hazırla
        const productContext = [
            productName ? `Ürün Adı: ${productName}` : '',
            productBrand ? `Marka: ${productBrand}` : '',
            productPrice ? `Fiyat: ${productPrice} ₺` : '',
            productSpecs?.ram ? `RAM: ${productSpecs.ram}` : '',
            productSpecs?.storage ? `Depolama: ${productSpecs.storage}` : '',
            productSpecs?.camera ? `Kamera: ${productSpecs.camera}` : '',
            productSpecs?.battery ? `Batarya: ${productSpecs.battery}` : '',
            productSpecs?.screen ? `Ekran: ${productSpecs.screen}` : '',
            productSpecs?.processor ? `İşlemci: ${productSpecs.processor}` : '',
            productDescription ? `Açıklama: ${productDescription}` : '',
        ].filter(Boolean).join('\n');

        const systemPrompt = `Sen "Superintelligence" adlı bir premium telefon mağazasının uzman ve samimi satış temsilcisin.
Görevin: Müşterinin aşağıdaki ürün hakkındaki sorularını yanıtlamak.

ÜRÜN BİLGİLERİ:
${productContext || 'Genel bir telefon ürünü'}

KURALLAR:
- Her zaman Türkçe konuş
- Samimi, sıcak ve uzman bir satıcı gibi davran
- Kısa ve net cevaplar ver (maksimum 3-4 cümle)
- Bilmediğin teknik detayları uydurmaya çalışma, "Tam teknik detaylar için mağazamızı arayabilirsiniz" de
- Fiyat müzakeresi yapma, sadece belirtilen fiyatı söyle
- Müşteriyi ürünü almaya teşvik et ama baskıcı olma
- Garanti, kargo, iade konularında standart bilgileri ver: 2 yıl garanti, 1-3 iş günü kargo, 14 gün iade

Müşteri sorusu: ${message}`;

        const requestBody = JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
                topP: 0.8,
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const reply = await new Promise((resolve, reject) => {
            const httpreq = https.request(options, (httpres) => {
                let data = '';
                httpres.on('data', chunk => data += chunk);
                httpres.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        
                        // Hata durumunu kontrol et
                        if (parsed.error) {
                            console.error('Gemini API hatası:', parsed.error.message);
                            resolve(getSmartFallback(message, productName, productBrand, productPrice));
                            return;
                        }
                        
                        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            resolve(text.trim());
                        } else {
                            resolve(getSmartFallback(message, productName, productBrand, productPrice));
                        }
                    } catch (e) {
                        console.error('Gemini parse hatası:', e.message);
                        resolve(getSmartFallback(message, productName, productBrand, productPrice));
                    }
                });
            });
            httpreq.on('error', (err) => {
                console.error('Gemini bağlantı hatası:', err.message);
                resolve(getSmartFallback(message, productName, productBrand, productPrice));
            });
            httpreq.write(requestBody);
            httpreq.end();
        });

        res.json({ reply });
    } catch (error) {
        console.error('AI chat hatası:', error.message);
        res.json({ reply: 'Şu an teknik bir sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.' });
    }
};

/**
 * Gemini API yokken akıllı kural tabanlı Türkçe cevaplar.
 */
function getSmartFallback(message, productName, productBrand, productPrice) {
    const msg = message.toLowerCase().trim();
    const urun = productName || 'Bu ürün';
    const marka = productBrand || 'Ürünümüz';

    if (msg.includes('fiyat') || msg.includes('ücret') || msg.includes('kaça') || msg.includes('ne kadar')) {
        return `${urun} şu an ${productPrice ? productPrice.toLocaleString('tr-TR') + ' ₺' : 'belirtilen fiyatta'} satılmaktadır. Bu fiyat için son derece kaliteli bir performans sunuyor! 💜`;
    }
    if (msg.includes('garanti') || msg.includes('güvence')) {
        return `${marka} için 2 yıl resmi distribütör garantisi sunulmaktadır. Sorun yaşamanız durumunda Türkiye genelindeki tüm yetkili servislere başvurabilirsiniz. 🛡️`;
    }
    if (msg.includes('kargo') || msg.includes('teslimat') || msg.includes('ne zaman gel') || msg.includes('kaç gün')) {
        return 'Siparişiniz 1-3 iş günü içinde kargoya verilir. İstanbul, Ankara ve İzmir için aynı gün teslimat seçeneğimiz de mevcuttur! 🚚';
    }
    if (msg.includes('stok') || msg.includes('var mı') || msg.includes('mevcut')) {
        return `${urun} şu an stokta mevcuttur. Hemen sipariş vermenizi öneririm, popüler bir model olduğu için stoklar hızlı tükeniyor! ✅`;
    }
    if (msg.includes('renk') || msg.includes('seçenek') || msg.includes('hangi renk')) {
        return `${urun} için birden fazla renk seçeneğimiz mevcuttur. Sepete ekle adımında mevcut renkleri görebilir, beğendiğinizi seçebilirsiniz. 🎨`;
    }
    if (msg.includes('iade') || msg.includes('geri') || msg.includes('değişim') || msg.includes('iptal')) {
        return 'Satın alma tarihinden itibaren 14 gün içinde koşulsuz iade ve değişim hakkınız bulunmaktadır. Ürünü orijinal kutusunda iade etmeniz yeterlidir. 📦';
    }
    if (msg.includes('kamera') || msg.includes('çekim') || msg.includes('fotoğraf') || msg.includes('video')) {
        return `${marka}'ın kamera sistemi, hem gündüz hem gece fotoğrafçılığında üstün performans sunar. 4K video çekimi ve gelişmiş gece modu ile profesyonel kalitede çekimler yapabilirsiniz. 📸`;
    }
    if (msg.includes('pil') || msg.includes('batarya') || msg.includes('şarj') || msg.includes('dayanıklı')) {
        return `${urun}, büyük kapasiteli bataryası sayesinde yoğun kullanımda bile tüm günü konforla geçirmenizi sağlar. Hızlı şarj desteği ile kısa sürede tamamen dolar! ⚡`;
    }
    if (msg.includes('ekran') || msg.includes('görüntü') || msg.includes('display') || msg.includes('kaç inç')) {
        return `${marka}'ın yüksek çözünürlüklü ekranı, içerik izleme, oyun ve günlük kullanım için mükemmel bir deneyim sunar. Canlı renkleri ve yüksek yenileme hızıyla göz alıcı bir görüntü sunar. 🖥️`;
    }
    if (msg.includes('oyun') || msg.includes('gaming') || msg.includes('performans')) {
        return `${urun}, güçlü işlemcisi ve yeterli RAM kapasitesiyle tüm mobil oyunları yüksek ayarlarda akıcı biçimde çalıştırır. Oyun tutkunları için harika bir seçim! 🎮`;
    }
    if (msg.includes('ram') || msg.includes('bellek') || msg.includes('depolama') || msg.includes('gb') || msg.includes('hafıza')) {
        return `${urun}, günümüz uygulamaları ve multitasking için yeterli RAM ve depolama alanına sahiptir. Fotoğraflarınız, uygulamalarınız ve dosyalarınız için bol alan bulacaksınız. 💾`;
    }
    if (msg.includes('su geçirmez') || msg.includes('dayanıklılık') || msg.includes('sağlam')) {
        return `${marka} dayanıklılık konusunda iyi bir üne sahiptir. Su ve toz direnci için ürün teknik özelliklerine veya mağazamıza danışmanızı öneririm. 💪`;
    }
    if (msg.includes('merhaba') || msg.includes('selam') || msg.includes('iyi') || msg.includes('nasıl')) {
        return `Merhaba! 👋 Ben Superintelligence'ın yapay zeka asistanıyım. ${urun} hakkında her türlü sorunuzu yanıtlamaktan memnuniyet duyarım. Ne öğrenmek istersiniz?`;
    }
    if (msg.includes('teşekkür') || msg.includes('sağ ol') || msg.includes('tamam')) {
        return 'Rica ederim! Başka sorunuz varsa her zaman buradayım. Alışverişlerinizde başarılar! 🛍️';
    }
    
    return `${urun} hakkında sorduğunuz soru için teşekkürler! Daha spesifik bilgi için (kamera, batarya, ekran vb.) tekrar sorabilirsiniz veya mağazamızı arayabilirsiniz. Size en iyi şekilde yardımcı olmak istiyoruz! 😊`;
}

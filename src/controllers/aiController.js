const https = require('https');

// Gemini API ile satıcı simülasyonu
exports.sellerChat = async (req, res) => {
    try {
        const { message, productName, productBrand, productPrice, productSpecs } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Mesaj boş olamaz.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        // Gemini API key yoksa akıllı fallback cevap ver
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_key_here') {
            return res.json({ reply: getSmartFallback(message, productName, productBrand, productPrice) });
        }

        const systemPrompt = `Sen Superintelligence adlı bir telefon mağazasının deneyimli ve yardımsever satış temsilcisin. 
Şu an müşteri sana "${productName || 'bir ürün'}" hakkında soru soruyor.
Ürün Bilgileri: Marka: ${productBrand || '-'}, Fiyat: ${productPrice ? productPrice + ' ₺' : '-'}, RAM: ${productSpecs?.ram || '-'}, Depolama: ${productSpecs?.storage || '-'}.
Her zaman Türkçe, samimi, kısa ve net cevap ver. Maksimum 3 cümle kullan. Fiyat müzakeresi yapma.
Müşteri sorusu: ${message}`;

        const requestBody = JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(requestBody) }
        };

        const reply = await new Promise((resolve, reject) => {
            const httpreq = https.request(options, (httpres) => {
                let data = '';
                httpres.on('data', chunk => data += chunk);
                httpres.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        resolve(text || 'Şu an cevap veremiyorum, lütfen daha sonra tekrar deneyin.');
                    } catch {
                        resolve('Şu an cevap veremiyorum, lütfen daha sonra tekrar deneyin.');
                    }
                });
            });
            httpreq.on('error', reject);
            httpreq.write(requestBody);
            httpreq.end();
        });

        res.json({ reply });
    } catch (error) {
        console.error('AI chat hatası:', error.message);
        res.json({ reply: 'Şu an teknik bir sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin.' });
    }
};

// Gemini API olmadan akıllı kural tabanlı cevaplar
function getSmartFallback(message, productName, productBrand, productPrice) {
    const msg = message.toLowerCase();
    if (msg.includes('fiyat') || msg.includes('ücret') || msg.includes('kaça')) {
        return `${productName || 'Bu ürün'} şu an ${productPrice ? productPrice + ' ₺' : 'belirtilen fiyatta'} satışta. Fiyat/performans açısından çok iyi bir seçenek!`;
    }
    if (msg.includes('garanti') || msg.includes('güvence')) {
        return `${productBrand || 'Tüm ürünlerimiz'} 2 yıl resmi distribütör garantisi ile gelmektedir. Sorun yaşanması durumunda yetkili servis desteği sunulmaktadır.`;
    }
    if (msg.includes('kargo') || msg.includes('teslimat') || msg.includes('ne zaman')) {
        return 'Siparişiniz 1-3 iş günü içinde kargoya verilir. Büyükşehirlerde aynı gün teslimat seçeneğimiz de mevcuttur!';
    }
    if (msg.includes('stok') || msg.includes('var mı') || msg.includes('mevcut')) {
        return `Evet, ${productName || 'bu ürün'} şu an stokta mevcuttur. Hemen sepete ekleyebilirsiniz!`;
    }
    if (msg.includes('renk') || msg.includes('seçenek') || msg.includes('model')) {
        return `${productName || 'Bu ürün'} için farklı renk ve depolama kapasitesi seçeneklerimiz mevcuttur. Ürün sayfasında tüm seçenekleri görebilirsiniz.`;
    }
    if (msg.includes('iade') || msg.includes('ger') || msg.includes('değişim')) {
        return 'Satın alma tarihinden itibaren 14 gün içinde koşulsuz iade ve değişim hakkınız bulunmaktadır.';
    }
    if (msg.includes('kamera') || msg.includes('çekim') || msg.includes('fotoğraf')) {
        return `${productBrand || 'Bu telefon'}'ın kamerası, günlük kullanım ve profesyonel çekimler için mükemmel sonuçlar verir. Gece modunda da çok başarılıdır!`;
    }
    if (msg.includes('pil') || msg.includes('batarya') || msg.includes('şarj')) {
        return 'Büyük kapasiteli bataryası sayesinde yoğun kullanımda bile günü rahatça geçirmenizi sağlar. Hızlı şarj desteği de bulunmaktadır.';
    }
    return `Merhaba! "${productName || 'Bu ürün'}" hakkında sormak istediğiniz her şeyi yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?`;
}

const https = require('https');

/**
 * POST /api/ai/seller-chat
 * Gemini 1.5 Flash ile satici simulasyonu.
 * API key yoksa akilli fallback cevaplar döndürür.
 */
exports.sellerChat = async (req, res) => {
    try {
        const { message, productName, productBrand, productPrice, productSpecs, productDescription } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Mesaj boş olamaz.' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
            return res.json({ reply: getSmartFallback(message, productName, productBrand, productPrice) });
        }

        // Urun bilgilerini zengin baglamda hazirla
        const productContext = [
            productName ? `Urun Adi: ${productName}` : '',
            productBrand ? `Marka: ${productBrand}` : '',
            productPrice ? `Fiyat: ${productPrice} TL` : '',
            productSpecs?.ram ? `RAM: ${productSpecs.ram}` : '',
            productSpecs?.storage ? `Depolama: ${productSpecs.storage}` : '',
            productSpecs?.camera ? `Kamera: ${productSpecs.camera}` : '',
            productSpecs?.battery ? `Batarya: ${productSpecs.battery}` : '',
            productSpecs?.screen ? `Ekran: ${productSpecs.screen}` : '',
            productSpecs?.processor ? `Islemci: ${productSpecs.processor}` : '',
            productDescription ? `Aciklama: ${productDescription}` : '',
        ].filter(Boolean).join('\n');

        const systemPrompt = `Sen "Superintelligence" adli bir premium telefon magazasinin uzman ve samimi satis temsilcisin.
Gorev: Musterinin asagidaki urun hakkindaki sorularini Turkce olarak yanitmak.

URUN BILGILERI:
${productContext || 'Genel bir telefon urunu'}

KURALLAR:
- Her zaman Turkce yaz
- Samimi, sicak ve uzman bir satici gibi davran
- Kisa ve net cevaplar ver (maksimum 3-4 cumle)
- Bilmedigini uydurmaya calisma
- Fiyat muzakeresi yapma
- Garanti: 2 yil, Kargo: 1-3 is gunu, Iade: 14 gun

Musteri sorusu: ${message}`;

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
            path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const reply = await new Promise((resolve) => {
            const httpreq = https.request(options, (httpres) => {
                let data = '';
                httpres.on('data', chunk => data += chunk);
                httpres.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.error) {
                            console.error('Gemini API hatasi:', parsed.error.message);
                            resolve(getSmartFallback(message, productName, productBrand, productPrice));
                            return;
                        }
                        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        resolve(text ? text.trim() : getSmartFallback(message, productName, productBrand, productPrice));
                    } catch (e) {
                        console.error('Gemini parse hatasi:', e.message);
                        resolve(getSmartFallback(message, productName, productBrand, productPrice));
                    }
                });
            });
            httpreq.on('error', (err) => {
                console.error('Gemini baglanma hatasi:', err.message);
                resolve(getSmartFallback(message, productName, productBrand, productPrice));
            });
            httpreq.write(requestBody);
            httpreq.end();
        });

        res.json({ reply });
    } catch (error) {
        console.error('AI chat hatasi:', error.message);
        res.json({ reply: 'Su an teknik bir sorun yasiyoruz. Lutfen daha sonra tekrar deneyin.' });
    }
};

function getSmartFallback(message, productName, productBrand, productPrice) {
    const msg = (message || '').toLowerCase().trim();
    const urun = productName || 'Bu urun';
    const marka = productBrand || 'Urunumuz';
    const fiyat = productPrice ? productPrice.toLocaleString('tr-TR') + ' TL' : 'belirtilen fiyatta';

    if (msg.includes('fiyat') || msg.includes('ucret') || msg.includes('kaca') || msg.includes('ne kadar')) {
        return `${urun} su an ${fiyat} satisinizda. Fiyat/performans acisindan cok iyi bir secim!`;
    }
    if (msg.includes('garanti') || msg.includes('guvence')) {
        return `${marka} icin 2 yil resmi distributor garantisi sunulmaktadir. Turkiye genelindeki tum yetkili servislere basvurabilirsiniz.`;
    }
    if (msg.includes('kargo') || msg.includes('teslimat') || msg.includes('ne zaman') || msg.includes('kac gun')) {
        return 'Siparisleriniz 1-3 is gunu icinde kargoya verilir. Istanbul, Ankara ve Izmir icin ayni gun teslimat secenegimiz de vardir!';
    }
    if (msg.includes('stok') || msg.includes('var mi') || msg.includes('mevcut')) {
        return `${urun} su an stokta mevcuttur. Hemen siparis verebilirsiniz!`;
    }
    if (msg.includes('renk') || msg.includes('secene') || msg.includes('hangi renk')) {
        return `${urun} icin birden fazla renk secenegimiz mevcuttur. Sepete ekle adiminda mevcut renkleri gorebilirsiniz.`;
    }
    if (msg.includes('iade') || msg.includes('geri') || msg.includes('degisim') || msg.includes('iptal')) {
        return 'Satin alma tarihinden itibaren 14 gun icerisinde kosulsuz iade ve degisim hakkiniz bulunmaktadir.';
    }
    if (msg.includes('kamera') || msg.includes('cekim') || msg.includes('fotograf') || msg.includes('video')) {
        return `${marka}'in kamera sistemi, hem gunduz hem gece fotograf kalitesinde ustun performans sunar. 4K video cekim ve gelismis gece modu destegi ile profesyonel kalitede kareler yakalayabilirsiniz.`;
    }
    if (msg.includes('pil') || msg.includes('batarya') || msg.includes('sarj') || msg.includes('dayanik')) {
        return `${urun}, buyuk kapasiteli bataryasi sayesinde yogun kullanim sirasinda bile tum gunu rahatca gecirmenizi saglar. Hizli sarj destegi de sunulmaktadir.`;
    }
    if (msg.includes('ekran') || msg.includes('goruntu') || msg.includes('display') || msg.includes('inc')) {
        return `${marka}'in yuksek cozunurluklu ekrani, oyun, film ve gunluk kullanimda mukemmel bir gorsel deneyim sunar. Canli renkleri ve yuksek yenileme hizi dikkat cekicidir.`;
    }
    if (msg.includes('oyun') || msg.includes('gaming') || msg.includes('performans')) {
        return `${urun}, guclu islemcisi ve yeterli RAM kapasitesiyle tum mobil oyunlari yuksek ayarlarda akici bicimde calistirir. Oyun tutkunlari icin harika bir secim!`;
    }
    if (msg.includes('ram') || msg.includes('bellek') || msg.includes('depolama') || msg.includes('gb') || msg.includes('hafiza')) {
        return `${urun}, gunumuz uygulamalari ve multitasking icin yeterli RAM ve depolama alanina sahiptir. Fotograflariniz, uygulamalariniz ve dosyalariniz icin bol alan bulacaksiniz.`;
    }
    if (msg.includes('merhaba') || msg.includes('selam') || msg.includes('iyi') || msg.includes('nasil')) {
        return `Merhaba! Ben Superintelligence'in AI asistaniyim. ${urun} hakkinda her turlu sorunuzu yanitlamaktan memnuniyet duyarim. Ne ogrenmeyi istersiniz?`;
    }
    if (msg.includes('tesekkur') || msg.includes('sag ol') || msg.includes('tamam')) {
        return 'Rica ederim! Baska sorunuz varsa her zaman buradayim. Alisverislerinizde basarilar!';
    }
    if (msg.includes('detay') || msg.includes('anlat') || msg.includes('bilgi ver') || msg.includes('hakkinda')) {
        return `${urun} ${marka} markasinin amiral gemisi modellerinden biridir. ${productPrice ? fiyat + ' fiyatiyla' : ''} sunulan bu model, guclue performansi, kaliteli kamerasi ve uzun batarya omruyle one cikiyor. Baska merak ettiginiz bir konu var mi?`;
    }

    return `${urun} hakkindaki sorunuz icin tesekkurler! Kamera, batarya, ekran, fiyat, kargo veya garanti gibi konularda daha fazla bilgi almak icin sormaya devam edin. Size en iyi sekilde yardimci olmak istiyoruz!`;
}

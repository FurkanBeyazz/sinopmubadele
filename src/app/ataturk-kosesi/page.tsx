import { Metadata } from "next";
import { getAtaturkData } from "@/actions/ataturk-actions";
import SongPlayer from "./_components/song-player";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Atatürk Köşesi | Sinop Mübadele ve Balkan Halkları Derneği",
    description:
        "Mustafa Kemal Atatürk'ün Balkanlar ve mübadele vizyonu, hatıralardan kareler ve sevdiği Rumeli türküleri.",
};

// Tüm stiller ak- ön ekiyle kapsandı; site genelindeki sınıflarla çakışmaz.
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Poppins:wght@300;400;500;600;700&display=swap');

.ak-wrap {
    --bordo: #6b1e2d;
    --bordo-koyu: #4e1420;
    --lacivert: #1e3a5f;
    --lacivert-koyu: #142a47;
    --gold: #c5a059;
    --gold-acik: #e0c690;
    --krem: #fdfbf7;
    --krem-koyu: #f3ede2;
    --metin: #2a2a2a;
    --metin-acik: #5c5c5c;
    --golge: 0 20px 50px -15px rgba(0, 0, 0, 0.18);
    font-family: 'Poppins', sans-serif;
    color: var(--metin);
    line-height: 1.7;
    background: var(--krem);
}

.ak-wrap h1, .ak-wrap h2, .ak-wrap h3 {
    font-family: 'Playfair Display', serif;
    line-height: 1.2;
    letter-spacing: -0.01em;
}

.ak-konteyner { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.ak-etiket {
    display: inline-block; font-size: 0.78rem; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px;
}

.ak-ayrac { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 18px 0 0; }
.ak-ayrac span { height: 1px; width: 48px; background: var(--gold); opacity: 0.6; }
.ak-ayrac i { width: 9px; height: 9px; transform: rotate(45deg); background: var(--gold); }

/* HERO */
.ak-hero {
    position: relative; min-height: 88vh; display: flex; align-items: center;
    justify-content: center; text-align: center; overflow: hidden; color: #fff;
    /* GÖRSELİ DEĞİŞTİRMEK İÇİN aşağıdaki url(...) kısmını güncelleyin */
    background:
        linear-gradient(135deg, rgba(30,58,95,0.92) 0%, rgba(107,30,45,0.88) 100%),
        url('https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=1600&auto=format&fit=crop')
            center / cover no-repeat;
}
.ak-hero::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.ak-hero-icerik { position: relative; z-index: 2; max-width: 920px; padding: 100px 24px 60px; }
.ak-hero .ak-etiket { color: var(--gold-acik); }
.ak-hero blockquote {
    font-family: 'Playfair Display', serif; font-weight: 700;
    font-size: clamp(1.9rem, 5vw, 3.8rem); line-height: 1.25; margin: 18px 0 28px;
    text-shadow: 0 4px 24px rgba(0,0,0,0.35);
}
.ak-hero blockquote .ak-tirnak { color: var(--gold); }
.ak-hero cite {
    display: block; font-style: normal; font-family: 'Poppins', sans-serif; font-weight: 500;
    font-size: 1rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-acik);
}

/* BÖLÜMLER */
.ak-bolum { padding: 90px 0; }
.ak-bolum-baslik { text-align: center; max-width: 760px; margin: 0 auto 56px; }
.ak-bolum-baslik h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); color: var(--lacivert); font-weight: 700; }
.ak-bolum-baslik p { color: var(--metin-acik); }

/* TARİHİ BİLGİ */
.ak-tarih { background: var(--krem); }
.ak-tarih-kutu {
    position: relative; background: #fff; border: 1px solid var(--krem-koyu);
    border-radius: 18px; padding: 48px; box-shadow: var(--golge); max-width: 900px; margin: 0 auto;
}
.ak-tarih-kutu::before {
    content: ''; position: absolute; left: 0; top: 24px; bottom: 24px; width: 4px;
    border-radius: 4px; background: linear-gradient(var(--bordo), var(--gold));
}
.ak-tarih-kutu p { color: var(--metin-acik); font-size: 1.05rem; margin-bottom: 18px; }
.ak-tarih-kutu p:last-child { margin-bottom: 0; }
.ak-vurgu {
    font-family: 'Playfair Display', serif; font-size: clamp(1.3rem, 2.4vw, 1.7rem);
    font-weight: 700; color: var(--bordo); line-height: 1.4; margin: 28px 0;
    padding-left: 22px; border-left: 3px solid var(--gold);
}

/* GALERİ */
.ak-galeri { background: linear-gradient(var(--krem), var(--krem-koyu)); }
.ak-galeri-izgara { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.ak-foto-kart {
    position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 3 / 4;
    box-shadow: var(--golge); cursor: pointer; transition: transform 0.4s ease, box-shadow 0.4s ease; margin: 0;
}
.ak-foto-kart:hover { transform: translateY(-8px); box-shadow: 0 28px 60px -20px rgba(107,30,45,0.45); }
.ak-foto-kart img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
.ak-foto-kart:hover img { transform: scale(1.08); }
.ak-kapak {
    position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end;
    padding: 20px; background: linear-gradient(to top, rgba(20,42,71,0.85) 0%, transparent 55%); color: #fff; margin: 0;
}
.ak-kapak h3 { font-family: 'Poppins', sans-serif; font-size: 1rem; font-weight: 600; }
.ak-kapak small { color: var(--gold-acik); font-size: 0.78rem; letter-spacing: 0.05em; }

/* ŞARKILAR */
.ak-sarkilar { background: var(--lacivert-koyu); color: #fff; }
.ak-sarkilar .ak-etiket { color: var(--gold); }
.ak-sarkilar .ak-bolum-baslik h2 { color: #fff; }
.ak-sarkilar .ak-bolum-baslik p { color: rgba(255,255,255,0.7); }
.ak-sarki-izgara {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px; max-width: 1000px; margin: 0 auto;
}
.ak-sarki-kart {
    display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(197,160,89,0.25); border-radius: 14px; padding: 18px 20px;
    text-decoration: none; color: #fff; transition: background 0.3s, transform 0.3s, border-color 0.3s;
}
.ak-sarki-kart:hover { background: rgba(197,160,89,0.12); border-color: var(--gold); transform: translateY(-4px); }
.ak-play {
    flex-shrink: 0; width: 46px; height: 46px; border-radius: 50%; background: var(--bordo);
    display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1rem; transition: background 0.3s;
}
.ak-sarki-kart:hover .ak-play { background: var(--gold); color: var(--lacivert-koyu); }
.ak-bilgi b { display: block; font-weight: 600; font-size: 1rem; }
.ak-bilgi span { font-size: 0.8rem; color: rgba(255,255,255,0.6); }

/* RESPONSIVE */
@media (max-width: 992px) { .ak-galeri-izgara { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
    .ak-bolum { padding: 64px 0; }
    .ak-tarih-kutu { padding: 30px 24px; }
}
@media (max-width: 520px) {
    .ak-galeri-izgara { grid-template-columns: 1fr; }
    .ak-konteyner { padding: 0 18px; }
}
`;

export default async function AtaturkKosesiPage() {
    const data = await getAtaturkData();

    // Hero arka planını admin'den gelen görselle oluştur.
    // Konum "center top" => portre/figür genelde üstte olduğu için yüz kırpılmaz.
    const heroBg = `linear-gradient(135deg, rgba(30,58,95,0.88) 0%, rgba(107,30,45,0.82) 100%), url('${data.heroImage}') center 25% / cover no-repeat`;

    return (
        <div className="ak-wrap">
            <style dangerouslySetInnerHTML={{ __html: styles }} />

            {/* 1) HERO / GİRİŞ */}
            <header className="ak-hero" style={{ background: heroBg }}>
                <div className="ak-hero-icerik">
                    <span className="ak-etiket">Sinop Mübadele ve Balkan Halkları Derneği</span>
                    <blockquote>
                        <span className="ak-tirnak">“</span>Muhacirler kaybedilmiş topraklarımızın
                        aziz hatıralarıdır.<span className="ak-tirnak">”</span>
                    </blockquote>
                    <cite>— Mustafa Kemal Atatürk</cite>
                </div>
            </header>

            {/* 2) ATATÜRK VE MÜBADELE */}
            <section className="ak-bolum ak-tarih">
                <div className="ak-konteyner">
                    <div className="ak-bolum-baslik">
                        <span className="ak-etiket">Tarihî Bir Vizyon</span>
                        <h2>Atatürk ve Mübadele</h2>
                        <div className="ak-ayrac"><span></span><i></i><span></span></div>
                    </div>

                    <div className="ak-tarih-kutu">
                        <p>
                            Lozan Antlaşması&apos;nın ardından 1923&apos;te başlayan Nüfus Mübadelesi,
                            yalnızca bir göç hareketi değil; iki yakanın kültürel hafızasının yeniden
                            harmanlandığı tarihî bir dönüm noktasıdır. Mustafa Kemal Atatürk,
                            Balkanlar&apos;dan Anadolu&apos;ya gelen mübadilleri yeni Cumhuriyet&apos;in
                            eşit ve onurlu yurttaşları olarak görmüş; onların üretken yapısını ve zengin
                            kültürel mirasını ulusun kalkınmasında değerli bir güç olarak değerlendirmiştir.
                        </p>
                        <p className="ak-vurgu">“Gelenler yabancı değil, öz kardeşlerimizdir.”</p>
                        <p>
                            Selanik&apos;te doğan ve Balkan coğrafyasının kültürüyle yoğrularak büyüyen
                            Atatürk için mübadiller, geride bırakılan toprakların yaşayan hatırasıydı.
                            Mübadillerin iskânı, üretime kazandırılması ve haklarının korunması için
                            alınan kararlar, devletin bu insanlara duyduğu sorumluluğun açık bir
                            ifadesidir. Bugün derneğimiz, bu köklü mirası araştırarak, belgeleyerek ve
                            gelecek nesillere aktararak Atatürk&apos;ün gösterdiği o saygın yolu sürdürmektedir.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3) FOTOĞRAF GALERİSİ */}
            <section className="ak-bolum ak-galeri">
                <div className="ak-konteyner">
                    <div className="ak-bolum-baslik">
                        <span className="ak-etiket">Hatıralardan Kareler</span>
                        <h2>Fotoğraf Galerisi</h2>
                        <div className="ak-ayrac"><span></span><i></i><span></span></div>
                    </div>

                    <div className="ak-galeri-izgara">
                        {data.gallery.map((item, i) => (
                            <figure className="ak-foto-kart" key={i}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.image} alt={item.title} />
                                <figcaption className="ak-kapak">
                                    <small>{item.subtitle}</small>
                                    <h3>{item.title}</h3>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4) SEVDİĞİ ŞARKILAR */}
            <section className="ak-bolum ak-sarkilar">
                <div className="ak-konteyner">
                    <div className="ak-bolum-baslik">
                        <span className="ak-etiket">Rumeli&apos;nin Sesi</span>
                        <h2>Atatürk&apos;ün Sevdiği Şarkılar</h2>
                        <p>Balkan ve Rumeli türküleriyle dolu, gönülden bir dinleti.</p>
                        <div className="ak-ayrac"><span></span><i></i><span></span></div>
                    </div>

                    <SongPlayer songs={data.songs} />
                </div>
            </section>
        </div>
    );
}

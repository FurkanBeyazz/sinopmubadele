import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ChevronRight, FileText, Heart, Users, ShieldCheck, FileInput } from "lucide-react";

// ⚠️ DÜZENLEYİN: Derneğin gerçek sosyal medya adreslerini buraya yazın.
// Boş bırakılan ("") platform footer'da gösterilmez.
const SOCIAL = {
    facebook: "",   // örn: "https://facebook.com/sinopmubadele"
    instagram: "",  // örn: "https://instagram.com/sinopmubadele"
    twitter: "",    // örn: "https://x.com/sinopmubadele"
};

export default function Footer() {
    const socials = [
        { href: SOCIAL.facebook, icon: Facebook, label: "Facebook" },
        { href: SOCIAL.instagram, icon: Instagram, label: "Instagram" },
        { href: SOCIAL.twitter, icon: Twitter, label: "X (Twitter)" },
    ].filter((s) => s.href);

    return (
        <footer className="bg-stone-50 border-t border-stone-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Kolon 1: Kurumsal */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <span className="font-serif font-bold text-2xl text-slate-900">
                                Sinop Mübadele
                            </span>
                        </Link>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Sinop Mübadele ve Balkan Halkları Kültür Araştırmaları Derneği olarak, köklerimizi unutmuyor, kültürümüzü yarınlara taşıyoruz.
                        </p>
                    </div>

                    {/* Kolon 2: Hızlı Erişim */}
                    <div>
                        <h3 className="font-serif font-semibold text-slate-900 mb-6 uppercase tracking-wider text-sm">Hızlı Erişim</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Ana Sayfa", href: "/" },
                                { label: "Tarihçe", href: "/tarihce" },
                                { label: "Yönetim", href: "/yonetim" },
                                { label: "Atatürk Köşesi", href: "/ataturk-kosesi" },
                                { label: "Etkinlikler", href: "/etkinlikler" },
                                { label: "Haberler", href: "/haberler" },
                                { label: "Galeri", href: "/galeri" },
                                { label: "İletişim", href: "/iletisim" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-slate-600 hover:text-red-900 transition-colors text-sm">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolon 3: Dinamik Sayfalar */}
                    {/* --- KURUMSAL KOLONU --- */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white tracking-wide">
                            KURUMSAL
                        </h3>

                        {/* Link Listesi */}
                        <ul className="space-y-3">
                            {[
                                { label: "Dernek Tüzüğü", href: "/tuzuk", icon: FileText },
                                { label: "Yönetim Kurulu", href: "/yonetim", icon: Users },
                                { label: "KVKK ve Gizlilik", href: "/gizlilik", icon: ShieldCheck },
                                { label: "Sıkça Sorulan Sorular", href: "/sss", icon: FileText },
                                { label: "Üyelik Başvuru Formu", href: "/iletisim", icon: FileInput },
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="group flex items-center text-sm text-slate-500 hover:text-red-900 transition-all duration-300"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-red-900 group-hover:w-3 transition-all mr-2"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Premium Destek Kartı (Boşluğu doldurmak için) */}
                        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-900/10 rounded-lg text-red-900">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gönüllü Olun</h4>
                                    <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">
                                        Kültürümüzü yaşatmak için bize destek olun.
                                    </p>
                                    <Link
                                        href="/iletisim"
                                        className="text-xs font-bold text-red-900 hover:text-red-800 flex items-center group"
                                    >
                                        Başvuru Yap
                                        <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolon 4: İletişim & Sosyal Medya */}
                    <div>
                        <h3 className="font-serif font-semibold text-slate-900 mb-6 uppercase tracking-wider text-sm">İletişim</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-3 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 mt-0.5 text-red-900 shrink-0" />
                                <span>Kefevi, Kuruçeşme Sk. No:23/1, 57000 Sinop Merkez/Sinop</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-red-900 shrink-0" />
                                <a href="tel:+905333431601" className="hover:text-red-900 transition-colors">0533 343 16 01</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-red-900 shrink-0" />
                                <span>info@sinopmubadele.org.tr</span>
                            </li>
                        </ul>

                        {socials.length > 0 && (
                            <div className="flex items-center gap-4 mb-6">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-red-900 hover:text-white transition-all shadow-sm"
                                    >
                                        <s.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
                            <iframe
                                width="100%"
                                height="100%"
                                className="h-48 w-full grayscale hover:grayscale-0 transition-all duration-300"
                                frameBorder="0"
                                title="Sinop Mübadele Derneği Konum"
                                marginHeight={0}
                                marginWidth={0}
                                scrolling="no"
                                src="https://maps.google.com/maps?width=100%25&height=600&hl=tr&q=Kefevi,%20Kuru%C3%A7e%C5%9Fme%20Sk.%20No:23/1,%2057000%20Sinop%20Merkez/Sinop&t=&z=15&ie=UTF8&iwloc=B&output=embed">
                            </iframe>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Sinop Mübadele ve Balkan Halkları Derneği. Tüm hakları saklıdır.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/gizlilik" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">Gizlilik Politikası</Link>
                        <Link href="/kullanim-sartlari" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">Kullanım Şartları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Atatürk Köşesi için paylaşılan tipler ve varsayılan içerik.
// (Server action dosyası yalnızca async fonksiyon export edebildiği için burada tutulur.)

export type GalleryItem = { image: string; title: string; subtitle: string };
export type SongItem = { title: string; subtitle: string; youtube: string };

export type AtaturkData = {
    heroImage: string;
    gallery: GalleryItem[];
    songs: SongItem[];
};

// Admin kaydetmeden önce gösterilecek varsayılan içerik
export const ATATURK_DEFAULTS: AtaturkData = {
    heroImage:
        "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=1600&auto=format&fit=crop",
    gallery: [
        { image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=800&auto=format&fit=crop", title: "Selanik Yılları", subtitle: "Balkan Günleri" },
        { image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=800&auto=format&fit=crop", title: "Büyük Yolculuk", subtitle: "1923 Mübadelesi" },
        { image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop", title: "Mübadillerle Anlar", subtitle: "Halkla İç İçe" },
        { image: "https://images.unsplash.com/photo-1524293581917-878a6d017c71?q=80&w=800&auto=format&fit=crop", title: "Anadolu'da İskân", subtitle: "Yeni Yurt" },
    ],
    songs: [
        { title: "Vardar Ovası", subtitle: "Rumeli Türküsü", youtube: "" },
        { title: "Maya Dağdan Kalkan Kazlar", subtitle: "Rumeli Türküsü", youtube: "" },
        { title: "Manastırın Ortasında Var Bir Havuz", subtitle: "Rumeli Türküsü", youtube: "" },
        { title: "Kırmızı Gülün Âli Var", subtitle: "Anadolu & Rumeli", youtube: "" },
        { title: "Çalın Davulları Çaydan Aşağıya", subtitle: "Selanik Türküsü", youtube: "" },
    ],
};

export function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
    if (!value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && parsed.length === 0 ? fallback : parsed;
    } catch {
        return fallback;
    }
}

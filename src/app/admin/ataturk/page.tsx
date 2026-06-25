'use client';

import { useEffect, useState } from "react";
import { getAtaturkData, updateAtaturkData } from "@/actions/ataturk-actions";
import type { AtaturkData } from "@/lib/ataturk";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import { Loader2, Save, X, Image as ImageIcon, Music } from "lucide-react";

export default function AdminAtaturkPage() {
    const [data, setData] = useState<AtaturkData | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAtaturkData().then(setData);
    }, []);

    if (!data) {
        return <div className="py-20 text-center text-slate-500">Yükleniyor...</div>;
    }

    const setGallery = (i: number, patch: Partial<AtaturkData["gallery"][number]>) => {
        setData((d) => d && { ...d, gallery: d.gallery.map((g, idx) => (idx === i ? { ...g, ...patch } : g)) });
    };
    const setSong = (i: number, patch: Partial<AtaturkData["songs"][number]>) => {
        setData((d) => d && { ...d, songs: d.songs.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
    };

    async function handleSave() {
        if (!data) return;
        setSaving(true);
        const res = await updateAtaturkData(data);
        setSaving(false);
        if (res.success) toast.success("Atatürk Köşesi güncellendi.");
        else toast.error(res.error || "Bir hata oluştu.");
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Atatürk Köşesi</h1>
                    <p className="text-muted-foreground">Sayfanın görsellerini ve türkü videolarını buradan yönetin.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-red-900 hover:bg-red-800">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Kaydet
                </Button>
            </div>

            {/* HERO GÖRSELİ */}
            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <ImageIcon className="h-5 w-5 text-red-900" /> Hero (Giriş) Görseli
                </h2>
                <ImageField
                    value={data.heroImage}
                    onChange={(url) => setData({ ...data, heroImage: url })}
                />
            </section>

            {/* GALERİ */}
            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <ImageIcon className="h-5 w-5 text-red-900" /> Fotoğraf Galerisi ({data.gallery.length} kart)
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {data.gallery.map((g, i) => (
                        <div key={i} className="rounded-lg border border-slate-200 p-4">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Kart {i + 1}</p>
                            <ImageField value={g.image} onChange={(url) => setGallery(i, { image: url })} />
                            <div className="mt-3 space-y-3">
                                <div>
                                    <Label className="text-xs">Başlık</Label>
                                    <Input value={g.title} onChange={(e) => setGallery(i, { title: e.target.value })} className="bg-slate-50" />
                                </div>
                                <div>
                                    <Label className="text-xs">Üst Etiket</Label>
                                    <Input value={g.subtitle} onChange={(e) => setGallery(i, { subtitle: e.target.value })} className="bg-slate-50" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ŞARKILAR */}
            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Music className="h-5 w-5 text-red-900" /> Türküler (Site içinde oynar)
                </h2>
                <p className="mb-4 text-sm text-slate-500">
                    Her türkü için YouTube linkini yapıştırın (örn. <code>https://www.youtube.com/watch?v=...</code>).
                    Link girilen türküler sayfada tıklanınca site içinde açılır.
                </p>
                <div className="space-y-4">
                    {data.songs.map((s, i) => (
                        <div key={i} className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-3">
                            <div>
                                <Label className="text-xs">Şarkı Adı</Label>
                                <Input value={s.title} onChange={(e) => setSong(i, { title: e.target.value })} className="bg-slate-50" />
                            </div>
                            <div>
                                <Label className="text-xs">Açıklama</Label>
                                <Input value={s.subtitle} onChange={(e) => setSong(i, { subtitle: e.target.value })} className="bg-slate-50" />
                            </div>
                            <div>
                                <Label className="text-xs">YouTube Linki</Label>
                                <Input
                                    value={s.youtube}
                                    onChange={(e) => setSong(i, { youtube: e.target.value })}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="bg-slate-50"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="bg-red-900 hover:bg-red-800">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Tüm Değişiklikleri Kaydet
                </Button>
            </div>
        </div>
    );
}

// Görsel önizleme + yükleme/değiştirme alanı
function ImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
    if (value) {
        return (
            <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="Önizleme" className="h-full w-full object-cover" />
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white shadow hover:bg-red-700"
                    title="Görseli kaldır"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }
    return (
        <div className="max-w-sm rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
            <UploadDropzone
                endpoint="imageUploader"
                config={{ mode: "auto" }}
                onClientUploadComplete={(res) => {
                    const f: any = res?.[0];
                    const url = f?.ufsUrl || f?.url || f?.appUrl;
                    if (url) {
                        onChange(url);
                        toast.success("Görsel yüklendi.");
                    }
                }}
                onUploadError={(e: Error) => {
                    toast.error(`Yükleme hatası: ${e.message}`);
                }}
                className="ut-button:bg-red-900 ut-label:text-red-900 ut-allowed-content:text-slate-500 border-none py-8"
            />
        </div>
    );
}

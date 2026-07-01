'use client';

import { useEffect, useMemo, useState } from 'react';
import { getMemories, createMemory, deleteMemory, deleteBulkMemories, updateBulkMemories } from '@/actions/memory-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { UploadButton } from '@/utils/uploadthing';
import { Trash2, Plus, Loader2, Camera, Images, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

type Memory = {
    id: string;
    visitorName: string;
    image: string;
    note: string | null;
    createdAt: Date;
};

type Album = {
    key: string;
    visitorName: string;
    note: string | null;
    createdAt: Date;
    images: Memory[];
};

export default function MemoryAdminPage() {
    const router = useRouter();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Albüm yönetim penceresi
    const [manageKey, setManageKey] = useState<string | null>(null);
    const [renameName, setRenameName] = useState('');
    const [renameNote, setRenameNote] = useState('');
    const [isSavingAlbum, setIsSavingAlbum] = useState(false);

    // Yeni Anı Formu
    const [newMemoryData, setNewMemoryData] = useState({ visitorName: '', note: '' });

    const loadMemories = async () => {
        setIsLoading(true);
        const data = await getMemories();
        setMemories(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadMemories();
    }, []);

    // Aynı başlık altındaki fotoğrafları albümlerde grupla
    const albums = useMemo<Album[]>(() => {
        const map = new Map<string, Album>();
        for (const m of memories) {
            const key = (m.visitorName || '').trim().toLocaleLowerCase('tr');
            const existing = map.get(key);
            if (existing) {
                existing.images.push(m);
            } else {
                map.set(key, { key, visitorName: m.visitorName, note: m.note, createdAt: m.createdAt, images: [m] });
            }
        }
        return Array.from(map.values());
    }, [memories]);

    const manageAlbum = albums.find((a) => a.key === manageKey) || null;

    const openManage = (album: Album) => {
        setManageKey(album.key);
        setRenameName(album.visitorName);
        setRenameNote(album.note || '');
    };

    const handleDeletePhoto = async (id: string) => {
        if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;
        const result = await deleteMemory(id);
        if (result.success) {
            toast.success('Fotoğraf silindi.');
            await loadMemories();
        } else {
            toast.error('Silinemedi.');
        }
    };

    const handleDeleteAlbum = async (album: Album) => {
        if (!confirm(`"${album.visitorName}" albümündeki ${album.images.length} fotoğrafın tamamı silinecek. Emin misiniz?`)) return;
        const result = await deleteBulkMemories(album.images.map((m) => m.id));
        if (result.success) {
            toast.success('Albüm silindi.');
            setManageKey(null);
            await loadMemories();
        } else {
            toast.error('Albüm silinemedi.');
        }
    };

    const handleSaveAlbum = async (album: Album) => {
        setIsSavingAlbum(true);
        const result = await updateBulkMemories(album.images.map((m) => m.id), {
            visitorName: renameName || undefined,
            note: renameNote || undefined,
        });
        setIsSavingAlbum(false);
        if (result.success) {
            toast.success('Albüm güncellendi.');
            setManageKey(null);
            await loadMemories();
        } else {
            toast.error('Güncellenemedi.');
        }
    };

    return (
        <div className="space-y-8 relative pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Anı Köşesi Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Anılar başlığa göre albümlerde gruplanır. Aynı başlıkla yüklenen fotoğraflar tek albüm olur.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-red-900 hover:bg-red-800">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Albüm / Anı Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-950 border border-slate-200 shadow-xl rounded-xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                📸 Yeni Anı Oluştur
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Başlık / Grup Adı <span className="text-red-500">*</span></Label>
                                <Input
                                    className="h-11 border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg p-3 transition-all"
                                    value={newMemoryData.visitorName}
                                    onChange={(e) => setNewMemoryData((prev) => ({ ...prev, visitorName: e.target.value }))}
                                    placeholder="Örn: 1.Balkan Kızları Buluşması"
                                />
                                <p className="text-xs text-slate-400">Aynı başlığı kullanırsan fotoğraflar aynı albüme eklenir.</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Not (Opsiyonel)</Label>
                                <Textarea
                                    className="resize-none border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg p-3 transition-all"
                                    value={newMemoryData.note}
                                    onChange={(e) => setNewMemoryData((prev) => ({ ...prev, note: e.target.value }))}
                                    placeholder="Etkinlik tarihi veya kısa bir not..."
                                    rows={3}
                                />
                            </div>

                            <div className="pt-2">
                                {!newMemoryData.visitorName ? (
                                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-400 text-sm text-center p-4 transition-all">
                                        <Camera className="h-8 w-8 mb-2 opacity-50" />
                                        <p>Fotoğraf yüklemek için önce<br />başlığı girmelisiniz.</p>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-300 p-6 rounded-xl bg-slate-50 transition-colors hover:bg-slate-100">
                                        <UploadButton
                                            endpoint="bulkImageUploader"
                                            onClientUploadComplete={async (res) => {
                                                if (!res || res.length === 0) return;
                                                setIsCreating(true);
                                                try {
                                                    const visitorName = newMemoryData.visitorName;
                                                    const note = newMemoryData.note;
                                                    const results = await Promise.all(
                                                        res.map((file) =>
                                                            createMemory({ visitorName, note: note || undefined, image: file.url })
                                                        )
                                                    );
                                                    const failedCount = results.filter((r) => !r.success).length;
                                                    if (failedCount > 0) throw new Error(`${failedCount} kayıt oluşturulamadı.`);
                                                    toast.success(`${res.length} fotoğraf "${visitorName}" albümüne eklendi!`);
                                                    setNewMemoryData({ visitorName: '', note: '' });
                                                    await loadMemories();
                                                    router.refresh();
                                                } catch (error) {
                                                    console.error('işlem hatası:', error);
                                                    toast.error('Bir hata oluştu: ' + (error as Error).message);
                                                } finally {
                                                    setIsCreating(false);
                                                }
                                            }}
                                            onUploadError={(error: Error) => { toast.error(`Yükleme hatası: ${error.message}`); }}
                                            appearance={{
                                                button: "bg-red-900 text-white hover:bg-red-800 w-full rounded-md shadow-sm h-12 font-bold text-lg",
                                                allowedContent: "hidden",
                                            }}
                                            content={{
                                                button({ ready, isUploading, uploadProgress }) {
                                                    if (isUploading) return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor %{uploadProgress ?? 0}</>;
                                                    if (ready) return <><Camera className="mr-2 h-5 w-5" /> Fotoğrafları Seç</>;
                                                    return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Hazırlanıyor...</>;
                                                },
                                            }}
                                        />
                                        <p className="text-xs text-slate-400 mt-2 font-medium text-center">Ctrl tuşu ile birden fazla fotoğraf seçebilirsiniz.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="animate-spin mx-auto h-8 w-8 text-slate-400" /></div>
            ) : albums.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">Henüz albüm eklenmedi.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {albums.map((album) => (
                        <Card
                            key={album.key}
                            className="overflow-hidden group relative transition-all hover:shadow-lg cursor-pointer"
                            onClick={() => openManage(album)}
                        >
                            <div className="relative aspect-square bg-slate-100">
                                <Image src={album.images[0].image} alt={album.visitorName} fill className="object-cover" />
                                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                    <Images className="h-3.5 w-3.5" />
                                    {album.images.length}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow">
                                        <Settings2 className="h-3.5 w-3.5" /> Yönet
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-4 bg-white">
                                <h3 className="font-bold text-slate-900 line-clamp-1">{album.visitorName}</h3>
                                {album.note && <p className="text-sm text-slate-500 line-clamp-2 mt-1">{album.note}</p>}
                                <p className="text-xs text-slate-400 mt-2">{album.images.length} fotoğraf</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Albüm Yönetim Penceresi */}
            <Dialog open={manageAlbum !== null} onOpenChange={(open) => !open && setManageKey(null)}>
                <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto bg-white">
                    {manageAlbum && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Images className="h-5 w-5 text-red-900" />
                                    Albümü Yönet — {manageAlbum.images.length} fotoğraf
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                {/* Başlık / not düzenleme */}
                                <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <div className="space-y-1.5">
                                        <Label>Albüm Başlığı</Label>
                                        <Input value={renameName} onChange={(e) => setRenameName(e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Not</Label>
                                        <Textarea value={renameNote} onChange={(e) => setRenameNote(e.target.value)} rows={2} className="resize-none" />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button size="sm" onClick={() => handleSaveAlbum(manageAlbum)} disabled={isSavingAlbum}>
                                            {isSavingAlbum && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                            Başlık/Notu Kaydet
                                        </Button>
                                    </div>
                                </div>

                                {/* Fotoğraflar */}
                                <div>
                                    <Label className="mb-2 block">Fotoğraflar (tek tek silebilirsin)</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {manageAlbum.images.map((photo) => (
                                            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                                                <Image src={photo.image} alt="" fill className="object-cover" />
                                                <button
                                                    onClick={() => handleDeletePhoto(photo.id)}
                                                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                                                    title="Bu fotoğrafı sil"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tehlikeli bölge */}
                                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3">
                                    <span className="text-sm text-red-700">Albümün tamamını sil</span>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteAlbum(manageAlbum)}>
                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Albümü Sil
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

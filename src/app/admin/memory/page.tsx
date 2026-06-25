'use client';

import { useEffect, useState } from 'react';
import { getMemories, createMemory, deleteMemory, deleteBulkMemories, updateBulkMemories } from '@/actions/memory-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { UploadButton } from '@/utils/uploadthing';
import { Trash2, Plus, Loader2, Image as ImageIcon, Camera } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Memory = {
    id: string;
    visitorName: string;
    image: string;
    note: string | null;
    createdAt: Date;
};

import { useRouter } from 'next/navigation';

export default function MemoryAdminPage() {
    const router = useRouter();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    // User requested specific state names
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [bulkVisitorName, setBulkVisitorName] = useState('');
    const [bulkNote, setBulkNote] = useState('');

    // New Memory Form State
    const [newMemoryData, setNewMemoryData] = useState({
        visitorName: '',
        note: ''
    });

    const loadMemories = async () => {
        setIsLoading(true);
        const data = await getMemories();
        setMemories(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadMemories();
    }, []);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === memories.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(memories.map(m => m.id));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu anıyı silmek istediğinize emin misiniz?")) return;

        const result = await deleteMemory(id);
        if (result.success) {
            toast.success("Anı silindi.");
            loadMemories();
        } else {
            toast.error("Silinemedi.");
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Seçili ${selectedIds.length} kaydı silmek istediğinize emin misiniz?`)) return;

        setIsBulkDeleting(true);
        const result = await deleteBulkMemories(selectedIds);
        setIsBulkDeleting(false);

        if (result.success) {
            toast.success("Seçilen anılar silindi.");
            setSelectedIds([]);
            loadMemories();
        } else {
            toast.error("Toplu silme işlemi başarısız oldu.");
        }
    };

    const handleBulkUpdate = async () => {
        setIsBulkUpdating(true);
        const result = await updateBulkMemories(selectedIds, {
            visitorName: bulkVisitorName || undefined,
            note: bulkNote || undefined
        });
        setIsBulkUpdating(false);

        if (result.success) {
            toast.success("Seçilen anılar güncellendi.");
            setIsUpdateDialogOpen(false);
            setBulkVisitorName('');
            setBulkNote('');
            setSelectedIds([]);
            loadMemories();
        } else {
            toast.error("Toplu güncelleme başarısız oldu.");
        }
    };

    return (
        <div className="space-y-8 relative pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Anı Köşesi Yönetimi</h1>
                    <p className="text-muted-foreground">Ziyaretçi anılarını buradan yönetebilirsiniz.</p>
                </div>

                <div className="flex gap-2">
                    {memories.length > 0 && (
                        <Button variant="outline" onClick={handleSelectAll}>
                            {selectedIds.length === memories.length ? "Seçimi Kaldır" : "Tümünü Seç"}
                        </Button>
                    )}

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-red-900 hover:bg-red-800">
                                <Plus className="mr-2 h-4 w-4" /> Yeni Anı Ekle
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
                                    <Label className="text-sm font-medium text-slate-700">Ziyaretçi Adı / Grup Adı <span className="text-red-500">*</span></Label>
                                    <Input
                                        className="h-11 border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg p-3 transition-all"
                                        value={newMemoryData.visitorName}
                                        onChange={(e) => setNewMemoryData(prev => ({ ...prev, visitorName: e.target.value }))}
                                        placeholder="Örn: Ahmet Yılmaz veya Pendik Kaymakamlığı"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Not (Opsiyonel)</Label>
                                    <Textarea
                                        className="resize-none border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-lg p-3 transition-all"
                                        value={newMemoryData.note}
                                        onChange={(e) => setNewMemoryData(prev => ({ ...prev, note: e.target.value }))}
                                        placeholder="Ziyaret tarihi veya kısa bir not..."
                                        rows={3}
                                    />
                                </div>

                                <div className="pt-2">
                                    {!newMemoryData.visitorName ? (
                                        <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-400 text-sm text-center p-4 transition-all">
                                            <Camera className="h-8 w-8 mb-2 opacity-50" />
                                            <p>Fotoğraf yüklemek için önce<br />ziyaretçi adını girmelisiniz.</p>
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
                                                                createMemory({
                                                                    visitorName: visitorName,
                                                                    note: note || undefined,
                                                                    image: file.url
                                                                })
                                                            )
                                                        );

                                                        const failedCount = results.filter(r => !r.success).length;
                                                        if (failedCount > 0) {
                                                            throw new Error(`${failedCount} kayıt oluşturulamadı.`);
                                                        }

                                                        toast.success(`${res.length} adet anı başarıyla eklendi!`);
                                                        setNewMemoryData({ visitorName: '', note: '' });
                                                        loadMemories();
                                                        router.refresh();
                                                    } catch (error) {
                                                        console.error("işlem hatası:", error);
                                                        toast.error("Bir hata oluştu: " + (error as Error).message);
                                                    } finally {
                                                        setIsCreating(false);
                                                    }
                                                }}
                                                onUploadError={(error: Error) => { toast.error(`Yükleme hatası: ${error.message}`); }}
                                                appearance={{
                                                    button: "bg-red-900 text-white hover:bg-red-800 w-full rounded-md shadow-sm h-12 font-bold text-lg",
                                                    allowedContent: "hidden"
                                                }}
                                                content={{
                                                    button({ ready, isUploading }) {
                                                        if (isUploading) return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</>;
                                                        if (ready) return <><Camera className="mr-2 h-5 w-5" /> Fotoğrafları Seç (Max 10)</>;
                                                        return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Hazırlanıyor...</>;
                                                    }
                                                }}
                                            />
                                            <p className="text-xs text-slate-400 mt-2 font-medium text-center">Ctrl tuşu ile birden fazla (Max 10) fotoğraf seçebilirsiniz.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="animate-spin mx-auto h-8 w-8 text-slate-400" /></div>
            ) : memories.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">Henüz anı eklenmedi.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {memories.map((memory) => (
                        <Card
                            key={memory.id}
                            className={`overflow-hidden group relative transition-all ${selectedIds.includes(memory.id) ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                            onClick={() => toggleSelection(memory.id)}
                        >
                            <div className="absolute top-2 left-2 z-10 bg-white rounded-md shadow-sm">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 cursor-pointer accent-blue-600 m-1"
                                    checked={selectedIds.includes(memory.id)}
                                    onChange={() => toggleSelection(memory.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <div className="relative aspect-square bg-slate-100">
                                <Image
                                    src={memory.image}
                                    alt={memory.visitorName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-4 bg-white">
                                <h3 className="font-bold text-slate-900 line-clamp-1">{memory.visitorName}</h3>
                                {memory.note && <p className="text-sm text-slate-500 line-clamp-2 mt-1">{memory.note}</p>}
                                <p className="text-xs text-slate-400 mt-2">
                                    {new Date(memory.createdAt).toLocaleDateString("tr-TR")}
                                </p>
                            </CardContent>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(memory.id);
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 shadow-md"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </Card>
                    ))}
                </div>
            )}

            {/* Floating Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
                    <span className="font-medium whitespace-nowrap">
                        {selectedIds.length} öge seçildi
                    </span>
                    <div className="h-6 w-px bg-slate-700" />

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsUpdateDialogOpen(true)}
                        className="hover:bg-slate-100"
                    >
                        Güncelle
                    </Button>

                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={isBulkDeleting}
                    >
                        {isBulkDeleting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Sil
                    </Button>
                </div>
            )}

            {/* Bulk Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Toplu Güncelleme</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                            Dikkat: Bu işlem seçili {selectedIds.length} kaydı güncelleyecektir.
                        </p>
                        <div className="space-y-2">
                            <Label>Ziyaretçi Adını Güncelle</Label>
                            <Input
                                value={bulkVisitorName}
                                onChange={(e) => setBulkVisitorName(e.target.value)}
                                placeholder="Değiştirmek istemiyorsanız boş bırakın"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Notu Güncelle</Label>
                            <Textarea
                                value={bulkNote}
                                onChange={(e) => setBulkNote(e.target.value)}
                                placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                rows={3}
                            />
                        </div>
                        <Button onClick={handleBulkUpdate} disabled={isBulkUpdating} className="w-full">
                            {isBulkUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Kaydet
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

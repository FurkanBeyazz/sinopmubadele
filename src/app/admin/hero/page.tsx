'use client';

import { useEffect, useState } from 'react';
import { getSlides, createSlide, deleteSlide, toggleSlideStatus } from '@/actions/hero-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { UploadButton } from '@/utils/uploadthing';
import { Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Slide = {
    id: string;
    image: string;
    title: string | null;
    subtitle: string | null;
    order: number;
    isActive: boolean;
};

export default function HeroAdminPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New Slide Form State
    const [newSlideData, setNewSlideData] = useState({
        title: '',
        subtitle: '',
        image: ''
    });

    const loadSlides = async () => {
        setIsLoading(true);
        const data = await getSlides();
        setSlides(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadSlides();
    }, []);

    const handleCreate = async () => {
        if (!newSlideData.image) {
            toast.error("Lütfen bir görsel yükleyin.");
            return;
        }

        setIsCreating(true);
        const result = await createSlide(newSlideData);

        if (result.success) {
            toast.success("Slayt eklendi.");
            setNewSlideData({ title: '', subtitle: '', image: '' });
            loadSlides();
            // Close dialog logic or just reset form
        } else {
            toast.error(result.error as string);
        }
        setIsCreating(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;

        const result = await deleteSlide(id);
        if (result.success) {
            toast.success("Slayt silindi.");
            loadSlides();
        } else {
            toast.error("Silinemedi.");
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        const result = await toggleSlideStatus(id, !currentStatus);
        if (result.success) {
            loadSlides();
        } else {
            toast.error("Durum güncellenemedi.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Slider Yönetimi</h1>
                    <p className="text-muted-foreground">Ana sayfa manşet alanını buradan yönetebilirsiniz.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-red-900 hover:bg-red-800">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Slayt Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Yeni Slayt Oluştur</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Görsel</Label>
                                {newSlideData.image ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                                        <Image src={newSlideData.image} alt="Preview" fill className="object-cover" />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                            onClick={() => setNewSlideData(prev => ({ ...prev, image: '' }))}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-300 p-6 rounded-lg bg-slate-50 flex flex-col items-center justify-center transition-colors hover:bg-slate-100">
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]) {
                                                    setNewSlideData(prev => ({ ...prev, image: res[0].url }));
                                                    toast.success("Görsel yüklendi.");
                                                }
                                            }}
                                            onUploadError={(error: Error) => { toast.error(`Yükleme hatası: ${error.message}`); }}
                                            appearance={{
                                                button: "bg-red-900 text-white hover:bg-red-800 w-full rounded-md shadow-sm",
                                                allowedContent: "hidden"
                                            }}
                                            content={{
                                                button({ ready }) {
                                                    if (ready) return <><ImageIcon className="mr-2 h-4 w-4" /> Görsel Seç</>;
                                                    return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</>;
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-slate-400 mt-2 font-medium">PNG, JPG veya WEBP (Max 4MB)</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Başlık (Opsiyonel)</Label>
                                <Input
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    value={newSlideData.title}
                                    onChange={(e) => setNewSlideData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Örn: Hoş Geldiniz"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Alt Başlık (Opsiyonel)</Label>
                                <Input
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    value={newSlideData.subtitle}
                                    onChange={(e) => setNewSlideData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    placeholder="Kısa açıklama..."
                                />
                            </div>
                            <Button onClick={handleCreate} disabled={isCreating} className="w-full bg-red-900 hover:bg-red-800 text-white font-bold rounded-lg h-11">
                                {isCreating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <><Plus className="h-4 w-4 mr-2" /> Slaytı Ekle</>}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="animate-spin mx-auto h-8 w-8 text-slate-400" /></div>
            ) : slides.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">Henüz slayt eklenmedi.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {slides.map((slide) => (
                        <Card key={slide.id} className="overflow-hidden group">
                            <div className="relative aspect-video bg-slate-100">
                                <Image
                                    src={slide.image}
                                    alt={slide.title || "Slayt"}
                                    fill
                                    className={`object-cover transition-opacity ${!slide.isActive ? 'opacity-50 grayscale' : ''}`}
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Switch
                                        checked={slide.isActive}
                                        onCheckedChange={() => handleToggle(slide.id, slide.isActive)}
                                    />
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{slide.title || "Başlıksız"}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-1">{slide.subtitle || "-"}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(slide.id)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

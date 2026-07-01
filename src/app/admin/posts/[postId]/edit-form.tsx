'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { UploadDropzone } from '@/utils/uploadthing';
import { X } from 'lucide-react';
import Image from 'next/image';
import Editor from '@/components/editor';
import UploadthingImageUpload from '@/components/admin/uploadthing-image-upload';
import { updatePost } from '@/actions/post-actions';

const postSchema = z.object({
    title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır.'),
    content: z.string().min(10, 'İçerik en az 10 karakter olmalıdır.'),
    featuredImage: z.string().optional(),
    category: z.string().min(1, 'Kategori seçiniz.'),
    published: z.boolean(),
});

type PostFormData = z.infer<typeof postSchema>;

const categories = [
    { value: 'Duyuru', label: '📢 Duyuru' },
    { value: 'Haber', label: '📰 Haber' },
    { value: 'Etkinlik', label: '🎭 Etkinlik' },
    { value: 'Kültür', label: '🏛️ Kültür & Miras' },
    { value: 'Basın', label: '📋 Basın Açıklaması' },
];

interface PostEditFormProps {
    initialData: {
        id: string;
        title: string;
        content: string;
        featuredImage: string;
        category: string;
        published: boolean;
        images?: string; // JSON string from DB
    };
}

export default function PostEditForm({ initialData }: PostEditFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Parse initial images safely
    const [images, setImages] = useState<string[]>(() => {
        if (!initialData.images) return [];
        try {
            const parsed = JSON.parse(initialData.images);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: initialData.title,
            content: initialData.content,
            featuredImage: initialData.featuredImage,
            category: initialData.category,
            published: initialData.published,
        },
    });

    const published = watch('published');
    const featuredImage = watch('featuredImage');

    const onSubmit = async (data: PostFormData) => {
        setIsSubmitting(true);
        try {
            await updatePost(initialData.id, {
                title: data.title,
                content: data.content,
                featuredImage: data.featuredImage,
                images: images,
                category: data.category,
                published: data.published,
            });
            router.push('/admin/posts');
            router.refresh();
        } catch (error) {
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/posts">
                        <button type="button" className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 serif">Haberi Düzenle</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Mevcut haberi güncelleyin.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setValue('published', !published)}
                        className={`h-11 px-5 rounded-lg font-bold uppercase tracking-widest text-[10px] border transition-all inline-flex items-center gap-2 ${published
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-amber-200 bg-amber-50 text-amber-700'
                            }`}
                    >
                        {published ? <><Eye size={14} /> Yayında</> : <><EyeOff size={14} /> Taslak</>}
                    </button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 px-6 font-bold uppercase tracking-widest text-[10px] bg-primary-red hover:bg-red-800 text-white shadow-lg shadow-red-900/20"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Save size={14} className="mr-2" /> Güncelle</>}
                    </Button>
                </div>
            </div>

            {/* Main */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Başlık <span className="text-red-500">*</span></label>
                        <Input {...register('title')} placeholder="Haber başlığını yazın..." className="h-14 text-lg font-bold border-slate-200 bg-white serif" />
                        {errors.title && <p className="text-xs font-bold text-red-500">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">İçerik <span className="text-red-500">*</span></label>
                        <Editor content={initialData.content} onChange={(html) => setValue('content', html, { shouldValidate: true })} />
                        {errors.content && <p className="text-xs font-bold text-red-500">{errors.content.message}</p>}
                    </div>

                    {/* Haber Galerisi Alanı */}
                    <div className="mt-8 border border-slate-200 rounded-xl p-6 bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Haber/Etkinlik Galerisi</h3>
                        <p className="text-sm text-slate-500 mb-4">Bu habere ait birden fazla fotoğraf seçerek albüm oluşturabilirsiniz.</p>

                        <UploadDropzone
                            endpoint="pageImageUploader" // Çoklu yükleme yetkisi olan endpoint
                            onClientUploadComplete={(res) => {
                                if (res) {
                                    const newUrls = res.map((f) => f.url);
                                    setImages((prev) => [...prev, ...newUrls]);
                                    toast.success(`${res.length} fotoğraf eklendi!`);
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Hata: ${error.message}`);
                            }}
                            content={{
                                button({ ready, isUploading, uploadProgress }) {
                                    if (isUploading) return `Yükleniyor %${uploadProgress ?? 0}`;
                                    if (ready) return "Fotoğrafları Seç";
                                    return "Hazırlanıyor...";
                                },
                                allowedContent({ isUploading, uploadProgress }) {
                                    if (isUploading) return `Yükleniyor... %${uploadProgress ?? 0}`;
                                    return "Birden fazla fotoğraf seçebilirsiniz";
                                },
                            }}
                        />

                        {/* Önizleme Grid'i */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {images.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group">
                                        <Image src={url} alt={`Galeri ${idx}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white font-bold"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-slate-100 shadow-sm bg-white">
                        <CardContent className="p-5 space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Kapak Görseli</label>
                            {featuredImage ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                    <img src={featuredImage} alt="Kapak" className="w-full h-40 object-cover" />
                                    <button type="button" onClick={() => setValue('featuredImage', '')} className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs font-bold">✕</button>
                                </div>
                            ) : (
                                <UploadthingImageUpload onUploadComplete={(url) => setValue('featuredImage', url)} />
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm bg-white">
                        <CardContent className="p-5 space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Kategori <span className="text-red-500">*</span></label>
                            <Select defaultValue={initialData.category} onValueChange={(val) => setValue('category', val)}>
                                <SelectTrigger className="h-11 border-slate-200"><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm bg-white">
                        <CardContent className="p-5 space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Yayın Durumu</label>
                            <button type="button" onClick={() => setValue('published', !published)} className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${published ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                                {published ? (
                                    <><div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" /><span className="text-sm font-bold text-emerald-800">Yayında</span></>
                                ) : (
                                    <><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-sm font-bold text-amber-800">Taslak</span></>
                                )}
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}

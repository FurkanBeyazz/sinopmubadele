'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function ImageUpload({ value, onChange, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Sadece resim dosyaları yüklenebilir.');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onChange(data.url);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Dosya yüklenirken hata oluştu.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    if (value) {
        return (
            <div className={cn('relative rounded-xl overflow-hidden border border-slate-200 group', className)}>
                <img
                    src={value}
                    alt="Kapak fotoğrafı"
                    className="w-full h-48 object-cover"
                />
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                    <X size={16} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Kapak Fotoğrafı</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'border-2 border-dashed rounded-xl transition-all cursor-pointer',
                dragActive ? 'border-primary-red bg-red-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50',
                className
            )}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
        >
            <div className="flex flex-col items-center justify-center py-12 px-6">
                {isUploading ? (
                    <>
                        <Loader2 className="animate-spin text-primary-red mb-3" size={32} />
                        <p className="text-sm font-bold text-slate-600">Yükleniyor...</p>
                    </>
                ) : (
                    <>
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                            <ImageIcon size={24} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Kapak fotoğrafı yükleyin</p>
                        <p className="text-xs text-slate-400 mt-1">Sürükleyip bırakın veya tıklayın</p>
                        <p className="text-[10px] text-slate-300 mt-2 uppercase tracking-widest font-bold">PNG, JPG, WEBP · Maks 4MB</p>
                    </>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
}

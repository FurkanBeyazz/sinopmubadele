'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import { CheckCircle2, ImageIcon, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UploadthingImageUploadProps {
    onUploadComplete?: (url: string) => void;
}

export default function UploadthingImageUpload({ onUploadComplete }: UploadthingImageUploadProps) {
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadPct, setUploadPct] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            {!isSuccess ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 overflow-hidden">
                    <UploadDropzone
                        endpoint="imageUploader"
                        config={{ mode: "auto" }}
                        onUploadBegin={() => setUploadPct(0)}
                        onUploadProgress={(p) => setUploadPct(Math.round(p))}
                        onClientUploadComplete={(res) => {
                            setUploadPct(null);
                            if (res && res[0]) {
                                const url = res[0].url;
                                setUploadedUrl(url);
                                setIsSuccess(true);
                                onUploadComplete?.(url);
                            }
                        }}
                        onUploadError={(error: Error) => {
                            setUploadPct(null);
                            alert(`Yükleme hatası: ${error.message}`);
                        }}
                        appearance={{
                            container: 'border-none bg-transparent',
                            label: 'text-slate-700 font-bold hover:text-primary-red',
                            allowedContent: 'text-slate-400 text-xs',
                            button: 'bg-primary-red hover:bg-red-800 text-white font-bold uppercase tracking-widest text-[10px] ut-uploading:bg-slate-400',
                        }}
                        content={{
                            label: 'Resim dosyanızı sürükleyip bırakın',
                            button({ ready, isUploading }) {
                                if (isUploading) return `Yükleniyor %${uploadPct ?? 0}`;
                                if (ready) return 'Dosya Seç';
                                return 'Hazırlanıyor...';
                            },
                            allowedContent: 'PNG, JPG, WEBP · Maks 100MB',
                        }}
                    />
                    {uploadPct !== null && (
                        <div className="px-4 pb-4">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className="h-full rounded-full bg-red-900 transition-all duration-200"
                                    style={{ width: `${uploadPct}%` }}
                                />
                            </div>
                            <p className="mt-1 text-center text-xs font-bold text-slate-500">Yükleniyor... %{uploadPct}</p>
                        </div>
                    )}
                </div>
            ) : (
                <Card className="border-emerald-200 bg-emerald-50/50">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-emerald-800">Yükleme Başarılı!</p>
                                <p className="text-xs text-emerald-600 mt-0.5">Dosyanız sunucuya yüklendi.</p>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="rounded-xl overflow-hidden border border-emerald-200">
                            <img
                                src={uploadedUrl}
                                alt="Yüklenen resim"
                                className="w-full h-48 object-cover"
                            />
                        </div>

                        {/* URL Display */}
                        <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-emerald-100">
                            <ImageIcon size={14} className="text-slate-400 flex-shrink-0" />
                            <span className="text-xs text-slate-600 truncate flex-1 font-mono">{uploadedUrl}</span>
                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                                title="Linki kopyala"
                            >
                                <Copy size={12} className="text-slate-400" />
                            </button>
                            <a
                                href={uploadedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                                title="Yeni sekmede aç"
                            >
                                <ExternalLink size={12} className="text-slate-400" />
                            </a>
                        </div>

                        {/* Upload Another */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setIsSuccess(false); setUploadedUrl(''); }}
                            className="w-full text-xs font-bold uppercase tracking-widest border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        >
                            Başka Bir Resim Yükle
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

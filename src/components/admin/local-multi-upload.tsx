'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';

/**
 * UploadThing'e bağımlı olmayan çoklu görsel yükleyici.
 * Dosyaları doğrudan /api/upload'a (kendi sunucumuz) yükler,
 * gerçek ilerleme gösterir, toplu seçimi native destekler.
 */
export default function LocalMultiUpload({
    onUrls,
    disabled,
    buttonLabel = 'Fotoğrafları Seç',
}: {
    onUrls: (urls: string[]) => void | Promise<void>;
    disabled?: boolean;
    buttonLabel?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(0);
    const [total, setTotal] = useState(0);

    function uploadOne(file: File): Promise<string | null> {
        return new Promise((resolve) => {
            const fd = new FormData();
            fd.append('file', file);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/upload');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        resolve(JSON.parse(xhr.responseText).url as string);
                    } catch {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };
            xhr.onerror = () => resolve(null);
            xhr.send(fd);
        });
    }

    async function handleFiles(fileList: FileList) {
        const files = Array.from(fileList);
        if (files.length === 0) return;
        setBusy(true);
        setTotal(files.length);
        setDone(0);

        // 4'erli havuz ile paralel yükleme (hız + kararlılık)
        const urls: string[] = [];
        let completed = 0;
        const CONCURRENCY = 4;
        let cursor = 0;

        async function worker() {
            while (cursor < files.length) {
                const i = cursor++;
                const url = await uploadOne(files[i]);
                if (url) urls.push(url);
                completed++;
                setDone(completed);
            }
        }

        await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, worker));

        setBusy(false);
        if (inputRef.current) inputRef.current.value = '';
        await onUrls(urls);
    }

    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <button
                type="button"
                disabled={disabled || busy}
                onClick={() => inputRef.current?.click()}
                className="flex h-12 w-full items-center justify-center rounded-md bg-red-900 px-8 text-lg font-bold text-white shadow-sm transition-all hover:bg-red-800 disabled:opacity-70"
            >
                {busy ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Yükleniyor {done}/{total} (%{pct})
                    </>
                ) : (
                    <>
                        <Camera className="mr-2 h-5 w-5" /> {buttonLabel}
                    </>
                )}
            </button>

            {busy && (
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-red-900 transition-all duration-200" style={{ width: `${pct}%` }} />
                </div>
            )}
        </div>
    );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Move, AlertTriangle } from 'lucide-react';

// İç Küre Bileşeni — texture'ı manuel yükler, hata fırlatmaz (sayfa çökmez)
function SpherePanorama({ imageUrl, onError, onLoaded }: { imageUrl: string; onError: () => void; onLoaded: () => void }) {
    const { gl } = useThree();
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        let cancelled = false;
        const loader = new THREE.TextureLoader();
        // crossOrigin ayarı yalnızca dış (uploadthing vb.) URL'ler için gerekli.
        // Kendi /uploads/ klasörümüz aynı origin — 'anonymous' verirsek Next.js
        // CORS başlığı dönmediği için görsel yüklenmez.
        if (/^https?:\/\//i.test(imageUrl)) {
            loader.setCrossOrigin('anonymous');
        }

        loader.load(
            imageUrl,
            (tex) => {
                if (cancelled) return;

                // Çok büyük panorama fotoğrafları GPU limitini aşabilir; güvenli üst sınıra indir
                const maxSize = gl.capabilities.maxTextureSize || 4096;
                const img = tex.image as HTMLImageElement;
                if (img && (img.width > maxSize || img.height > maxSize)) {
                    const canvas = document.createElement('canvas');
                    const scale = maxSize / Math.max(img.width, img.height);
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    tex.image = canvas;
                    tex.needsUpdate = true;
                }

                tex.mapping = THREE.EquirectangularReflectionMapping;
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.needsUpdate = true;
                setTexture(tex);
                onLoaded();
            },
            undefined,
            (err) => {
                // Konsola detay bas — teşhis için kritik
                console.error('[VirtualTour] Panorama yükleme başarısız:', imageUrl, err);
                if (!cancelled) onError();
            }
        );

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl, gl]);

    if (!texture) return null;

    return (
        <mesh>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

function Loader() {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-white bg-black/50 px-6 py-4 rounded-xl backdrop-blur-md">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm font-medium">360° Mekan Yükleniyor...</span>
            </div>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
            <div className="flex max-w-sm flex-col items-center justify-center gap-2 rounded-xl bg-black/60 px-6 py-5 text-center text-white backdrop-blur-md">
                <AlertTriangle className="h-8 w-8 text-amber-400" />
                <p className="text-sm font-semibold">360° görsel yüklenemedi</p>
                <p className="text-xs text-white/70">
                    Fotoğraf bozuk olabilir veya desteklenmeyen bir formatta olabilir. Lütfen admin panelinden JPEG/PNG formatında, 2:1 oranlı bir panorama fotoğrafı yükleyin.
                </p>
            </div>
        </div>
    );
}

// Ana Export
export default function VirtualTour({ imageUrl }: { imageUrl: string }) {
    const [failed, setFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const failedRef = useRef(false);

    const handleError = () => {
        if (failedRef.current) return;
        failedRef.current = true;
        setFailed(true);
    };

    return (
        <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-slate-200 bg-slate-900">
            {failed ? (
                <ErrorState />
            ) : (
                <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} onError={handleError}>
                    <ambientLight intensity={0.5} />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.05}
                        autoRotate
                        autoRotateSpeed={0.5}
                        rotateSpeed={-0.5}
                    />
                    <SpherePanorama imageUrl={imageUrl} onError={handleError} onLoaded={() => setLoaded(true)} />
                </Canvas>
            )}

            {!failed && !loaded && <Loader />}

            {!failed && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-lg pointer-events-none z-10">
                    <Move className="w-5 h-5 text-primary-red" />
                    <span className="text-sm font-bold text-slate-800 whitespace-nowrap">Etrafa Bakmak İçin Sürükleyin</span>
                </div>
            )}
        </div>
    );
}

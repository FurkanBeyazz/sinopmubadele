'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Move } from 'lucide-react';

// İç Küre Bileşeni
function SpherePanorama({ imageUrl }: { imageUrl: string }) {
    // useTexture yerine useLoader(THREE.TextureLoader) kullanarak daha stabil yükleme sağlayalım
    const texture = useLoader(THREE.TextureLoader, imageUrl);

    // Texture ayarları
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    return (
        <mesh>
            {/* Küre geometrisi (yeterince büyük ve detaylı) */}
            <sphereGeometry args={[500, 60, 40]} />
            {/* Fotoğrafı kürenin İÇ yüzeyine kapla (BackSide) */}
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}

// Yükleme Ekranı
function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center text-white bg-black/50 px-6 py-4 rounded-xl backdrop-blur-md">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm font-medium">360° Mekan Yükleniyor...</span>
            </div>
        </Html>
    );
}

// Ana Export
export default function VirtualTour({ imageUrl }: { imageUrl: string }) {
    return (
        <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-slate-200 bg-slate-900">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                <ambientLight intensity={0.5} />
                {/* Kontroller: Zoom kapalı, sadece etrafa bakış */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableDamping
                    dampingFactor={0.05}
                    autoRotate
                    autoRotateSpeed={0.5}
                    rotateSpeed={-0.5} // Mouse yönünü tersine çevir (içten bakış için daha doğal)
                />
                <Suspense fallback={<Loader />}>
                    <SpherePanorama imageUrl={imageUrl} />
                </Suspense>
            </Canvas>

            {/* Kullanıcı Arayüzü (Overlay) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-lg pointer-events-none z-10">
                <Move className="w-5 h-5 text-primary-red" />
                <span className="text-sm font-bold text-slate-800 whitespace-nowrap">Etrafa Bakmak İçin Sürükleyin</span>
            </div>
        </div>
    );
}

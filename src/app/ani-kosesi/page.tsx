import { getMemories } from "@/actions/memory-actions";
import Image from "next/image";
import MemoryGrid from "@/components/memory-grid";
import { Camera } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MemoryCornerPage() {
    const memories = await getMemories();

    return (
        <main className="min-h-screen bg-[#fdfbf7]">
            {/* Hero Section */}
            <div className="relative h-[40vh] bg-red-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full mb-6">
                        <Camera className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">Anı Köşesi</h1>
                    <p className="text-lg md:text-xl font-light max-w-2xl text-red-100">
                        Derneğimizden yolu geçen güzel insanlar ve unutulmaz anılar...
                    </p>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="container mx-auto px-4 py-20">
                {memories.length > 0 ? (
                    <MemoryGrid memories={memories} />
                ) : (
                    <div className="text-center py-32">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-300">
                            <Camera size={48} />
                        </div>
                        <h3 className="font-serif text-2xl text-stone-400">Henüz anı eklenmedi.</h3>
                        <p className="text-stone-400 mt-2">İlk anıyı siz yükleyin!</p>
                    </div>
                )}
            </div>
        </main>
    );
}

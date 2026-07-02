import { getMemories } from "@/actions/memory-actions";
import MemoryGrid from "@/components/memory-grid";
import Reveal from "@/components/reveal";
import { Camera } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Anı Köşesi | Sinop Mübadele ve Balkan Halkları Derneği",
    description: "Derneğimizden yolu geçen güzel insanlar ve unutulmaz anılar.",
};

export default async function MemoryCornerPage() {
    const memories = await getMemories();

    return (
        <main className="min-h-screen bg-[#fdfbf7] relative overflow-hidden">
            {/* Zarif arka plan parlaması */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

            {/* Editoryal Başlık */}
            <header className="container mx-auto px-4 pt-32 pb-14 md:pt-40 md:pb-20 text-center relative">
                <Reveal>
                    <span className="text-xs font-bold tracking-[0.25em] text-red-900/70 uppercase mb-4 block">
                        Derneğimizden Kareler
                    </span>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1A202C] mb-6 tracking-tight">
                        Anı Köşesi
                    </h1>
                </Reveal>
                <Reveal delay={0.2}>
                    <div className="flex items-center justify-center gap-4 opacity-80 mb-6">
                        <div className="h-[1px] w-12 bg-stone-300" />
                        <div className="w-2 h-2 rotate-45 bg-red-900" />
                        <div className="h-[1px] w-12 bg-stone-300" />
                    </div>
                </Reveal>
                <Reveal delay={0.3}>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Derneğimizden yolu geçen güzel insanlar ve unutulmaz anılar...
                    </p>
                </Reveal>
            </header>

            {/* Albümler */}
            <div className="container mx-auto px-4 pb-24 relative">
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

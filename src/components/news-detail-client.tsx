'use client';

import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface NewsDetailClientProps {
    post: {
        id: string;
        title: string;
        content: string;
        summary: string | null;
        image: string | null;
        date: Date;
        author: string | null;
        category: string | null;
        views: number;
        images?: string[]; // Gallery images
    };
}

export default function NewsDetailClient({ post }: NewsDetailClientProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        setCurrentUrl(window.location.href);
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const copyToClipboard = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link kopyalandı!");
        }
    };

    const readingTime = Math.ceil((post.content?.split(' ').length || 0) / 200);

    // Share Buttons Component
    const ShareButtons = ({ vertical = false }) => (
        <div className={cn("flex items-center", vertical ? 'flex-col gap-3' : 'flex-row gap-4 justify-center')}>
            {/* Facebook */}
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] group" aria-label="Facebook'ta Paylaş">
                <Facebook className="w-5 h-5" />
            </a>
            {/* Twitter/X */}
            <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${post.title}`} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:bg-black hover:text-white hover:border-black group" aria-label="Twitter'da Paylaş">
                <Twitter className="w-5 h-5" />
            </a>
            {/* WhatsApp */}
            <a href={`https://api.whatsapp.com/send?text=${post.title} ${currentUrl}`} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] group" aria-label="WhatsApp'ta Paylaş">
                <MessageCircle className="w-5 h-5" />
            </a>
            {/* LinkedIn */}
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`} target="_blank" rel="noopener noreferrer"
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] group" aria-label="LinkedIn'de Paylaş">
                <Linkedin className="w-5 h-5" />
            </a>
            {/* Link Copy */}
            <button onClick={copyToClipboard}
                className="p-3 rounded-full bg-white border border-slate-100 text-slate-500 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:bg-slate-800 hover:text-white hover:border-slate-800 group" aria-label="Linki Kopyala">
                <LinkIcon className="w-5 h-5" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 relative">

            {/* Reading Progress Bar */}
            <div
                className={cn("fixed top-0 left-0 h-1 bg-red-900 z-50 transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")}
                style={{ width: `${Math.min(100, (typeof window !== 'undefined' ? window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100 : 0))}%` }}
            />



            <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">

                {/* Back Navigation */}
                <div className="mb-8 md:mb-12">
                    <Link href="/haberler" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-900 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Tüm Haberlere Dön
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Column */}
                    <div className="lg:col-span-12 max-w-3xl mx-auto w-full relative">
                        {/* --- 1. DESKTOP STICKY SIDEBAR (Share) --- */}
                        <div className="hidden 2xl:block absolute -left-[100px] top-0 h-full">
                            <div className="sticky top-32 flex flex-col items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>Paylaş</span>
                                <ShareButtons vertical={true} />
                            </div>
                        </div>

                        {/* Article Header */}
                        <header className="mb-10 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                                <Badge variant="outline" className="text-red-900 border-red-200 bg-red-50 hover:bg-red-100 uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                                    {post.category || "GENEL"}
                                </Badge>
                                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest flex items-center">
                                    <Clock className="w-3 h-3 mr-1.5" />
                                    {readingTime} Dk Okuma
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-center md:justify-start border-b border-slate-100 pb-8 gap-6">
                                <div className="flex items-center group">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-serif font-bold text-lg mr-3 border border-slate-200 group-hover:border-red-200 transition-colors">
                                        {(post.author || "Y")[0]}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-red-900 transition-colors">{post.author || "Yönetim"}</div>
                                        <div className="text-xs text-slate-500">Editör</div>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
                                <div className="text-sm font-medium text-slate-600 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    {format(new Date(post.date), 'd MMMM yyyy', { locale: tr })}
                                </div>
                            </div>
                        </header>

                        {/* Featured Image with Lightbox */}
                        {post.image && (
                            <figure className="mb-12 -mx-4 md:-mx-12 cursor-zoom-in group relative select-none" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl backdrop-blur-sm">
                                            <span className="sr-only">Büyüt</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-900"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <figcaption className="mt-3 text-center text-xs text-slate-500 italic flex items-center justify-center gap-1">
                                    <Share2 className="w-3 h-3" /> Görseli büyütmek için üzerine tıklayın
                                </figcaption>
                            </figure>
                        )}

                        <div className="relative">

                            {/* Main Content Body */}
                            <article className="prose prose-lg prose-slate max-w-none w-full
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:tracking-wide 
                                prose-a:text-red-900 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                prose-img:rounded-xl prose-img:shadow-md prose-img:my-10
                                prose-blockquote:border-l-4 prose-blockquote:border-red-900 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                                prose-strong:font-bold prose-strong:text-slate-900
                                prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                                prose-li:marker:text-red-900/50">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </article>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- 2. MOBILE FIXED BOTTOM BAR (Share) --- */}
            {/* Sticks to the bottom on mobile/tablet/laptop. Hidden on 2xl screens. */}
            <div className="2xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 pb-6 safe-area-bottom shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Haberi Paylaş</span>
                    <Share2 className="w-4 h-4 text-slate-400" />
                </div>
                <ShareButtons vertical={false} />
            </div>

            {/* --- HABER GALERİSİ (ALBÜM) BÖLÜMÜ --- */}
            {post.images && post.images.length > 0 && (
                <div className="mt-16 pt-12 border-t border-slate-200/60">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-red-900"></span>
                        Haberden Kareler
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {post.images.map((imgUrl: string, index: number) => (
                            <div
                                key={index}
                                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group bg-slate-100 cursor-pointer"
                                onClick={() => {
                                    // Slaytlar [kapak, ...galeri] sırasında; kapak varsa +1 kaydır
                                    setLightboxIndex((post.image ? 1 : 0) + index);
                                    setLightboxOpen(true);
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imgUrl}
                                    alt={`${post.title} görseli ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Premium Hover Efekti */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Global Lightbox Component - Updated to include gallery images */}
            <Lightbox
                open={lightboxOpen}
                index={lightboxIndex}
                close={() => setLightboxOpen(false)}
                slides={[
                    ...(post.image ? [{ src: post.image }] : []),
                    ...(post.images ? post.images.map((src: string) => ({ src })) : [])
                ]}
                controller={{ closeOnBackdropClick: true }}
            />
        </div>
    );
}

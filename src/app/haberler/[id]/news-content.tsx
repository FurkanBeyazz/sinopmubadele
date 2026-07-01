'use client';

import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewsDetailContent({ post }: { post: any }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link kopyalandı!");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Progress Bar */}
            <div className={cn("fixed top-0 left-0 h-1 bg-red-900 z-50 transition-all duration-300", scrolled ? "opacity-100" : "opacity-0")} style={{ width: `${Math.min(100, (typeof window !== 'undefined' ? window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100 : 0))}%` }} />

            <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">

                {/* Header Navigation */}
                <div className="mb-12">
                    <Link href="/haberler" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-red-900 transition-colors cursor-pointer group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Tüm Haberlere Dön
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-12 max-w-3xl mx-auto w-full">

                        {/* Article Header */}
                        <header className="mb-10 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <Badge variant="outline" className="text-red-900 border-red-200 bg-red-50 hover:bg-red-100 uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                                    {post.category || "GENEL"}
                                </Badge>
                                <span className="text-slate-400 text-xs font-medium uppercase tracking-widest flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {Math.ceil(post.content ? post.content.split(' ').length / 200 : 1)} Dk Okuma
                                </span>
                            </div>

                            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-snug mb-8 tracking-tight [text-wrap:balance]">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-center md:justify-start border-b border-slate-100 pb-8 gap-5">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-serif font-bold text-lg mr-3 border border-slate-200">
                                        {(post.author || "Y")[0]}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-slate-900">{post.author || "Yönetim"}</div>
                                        <div className="text-xs text-slate-500">Editör</div>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                                <div className="text-sm font-medium text-slate-600 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    {new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        </header>

                        {/* Article Image */}
                        {post.featuredImage && (
                            <figure className="mb-12 -mx-4 md:-mx-12 cursor-zoom-in group relative" onClick={() => setLightboxOpen(true)}>
                                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg">
                                    <Image
                                        src={post.featuredImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                            <span className="sr-only">Büyüt</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-900"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <figcaption className="mt-3 text-center text-xs text-slate-500 italic block">
                                    Görseli büyütmek için üzerine tıklayın
                                </figcaption>
                            </figure>
                        )}

                        <div className="flex relative">
                            {/* Desktop Sticky Share (Left) */}
                            <div className="hidden xl:flex flex-col gap-3 absolute -left-20 top-0 sticky h-fit">
                                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-blue-50 transition-all" title="Facebook'ta Paylaş">
                                    <Facebook className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-slate-200 text-slate-400 hover:text-[#1DA1F2] hover:border-[#1DA1F2] hover:bg-sky-50 transition-all" title="Twitter'da Paylaş">
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <div className="w-8 h-px bg-slate-200 mx-auto my-1"></div>
                                <Button variant="outline" size="icon" onClick={copyToClipboard} className="rounded-full w-10 h-10 border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all" title="Linki Kopyala">
                                    <LinkIcon className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Article Body */}
                            <article className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:tracking-wide 
                                prose-a:text-red-900 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                                prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                                prose-blockquote:border-l-4 prose-blockquote:border-red-900 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:pr-4 prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:rounded-r-lg
                                prose-strong:font-bold prose-strong:text-slate-900">
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </article>
                        </div>

                        {/* Mobile Share Bar (Fixed Bottom) */}
                        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex justify-evenly items-center z-40 bg-white/95 backdrop-blur-md">
                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Paylaş</span>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1877F2]">
                                <Facebook className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1DA1F2]">
                                <Twitter className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-slate-500 hover:text-slate-900">
                                <LinkIcon className="w-5 h-5" />
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {post.featuredImage && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={[{ src: post.featuredImage }]}
                />
            )}
        </div>
    );
}

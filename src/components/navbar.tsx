"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, Heart } from "lucide-react"; // Heart eklendi
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isHomePage = pathname === "/";

    // Sayfa değişince mobil menüyü kapat
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/", label: "Ana Sayfa" },
        { href: "/tarihce", label: "Tarihçe" },
        { href: "/yonetim", label: "Yönetim" }, // Yönetim Kurulu -> Yönetim (Kısalttım)
        { href: "/ataturk-kosesi", label: "Atatürk Köşesi" },
        { href: "/etkinlikler", label: "Etkinlikler" },
        { href: "/galeri", label: "Galeri" },
        { href: "/ani-kosesi", label: "Anı Köşesi" },
        { href: "/iletisim", label: "İletişim" },
    ];

    // Premium Header Classes
    const headerClasses = cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b",
        (isScrolled || !isHomePage)
            ? "bg-white/90 backdrop-blur-md border-slate-200/50 py-3 shadow-sm"
            : "bg-transparent border-transparent py-5"
    );

    // Link Text Color Logic
    const linkColorClass = (isScrolled || !isHomePage) ? "text-slate-600 hover:text-red-900" : "text-white/90 hover:text-white";
    const underlineColorClass = (isScrolled || !isHomePage) ? "bg-red-900" : "bg-white";
    const logoTextColor = (isScrolled || !isHomePage) ? "text-slate-900" : "text-white";

    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-4 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative h-11 w-11 md:h-14 md:w-14 shrink-0 rounded-full bg-white/95 p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/logo/logo.png"
                            alt="Sinop Mübadele ve Balkan Halkları Derneği Logosu"
                            fill
                            sizes="56px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className={cn(
                        "font-serif font-bold transition-colors duration-300 flex flex-col leading-tight",
                        logoTextColor
                    )}>
                        <span className="text-lg md:text-2xl tracking-tight">Sinop Mübadele</span>
                        <span className="text-xs md:text-sm font-sans font-medium opacity-80 tracking-wide uppercase">ve Balkan Halkları Derneği</span>
                    </div>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn("relative group px-1 py-2 text-sm font-bold tracking-wide transition-colors", linkColorClass)}
                        >
                            {link.label}
                            {/* Animated Underline */}
                            <span className={cn(
                                "absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full rounded-full",
                                underlineColorClass
                            )}></span>
                        </Link>
                    ))}

                    {/* Donate Button */}
                    <Link
                        href="/bagis"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-900 text-white text-sm font-bold tracking-wide rounded-full shadow-[0_4px_14px_0_rgba(127,29,29,0.39)] hover:shadow-[0_6px_20px_rgba(127,29,29,0.23)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Heart className="w-4 h-4 fill-white/20" />
                        BAĞIŞ YAP
                    </Link>
                </nav>

                {/* MOBILE NAV TOGGLE */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden text-current">
                            <Menu className={cn(
                                "h-8 w-8",
                                (isScrolled || !isHomePage) ? "text-slate-900" : "text-white"
                            )} />
                            <span className="sr-only">Menüyü aç</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <SheetHeader className="mb-8 text-left">
                            <SheetTitle className="font-serif text-2xl font-bold text-red-900">Menü</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-lg font-medium text-slate-700 hover:text-red-900 hover:translate-x-2 transition-all duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/bagis"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-900 text-white text-base font-bold tracking-wide rounded-xl shadow-lg hover:bg-red-800 transition-all mt-4"
                            >
                                <Heart className="w-5 h-5 fill-white/20" />
                                BAĞIŞ YAP
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    FileText,
    ImageIcon,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    User,
    Users,
    ExternalLink,
    ChevronRight,
    FileBox,
    Camera,
    Landmark
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: ImageIcon, label: 'Slider Yönetimi', href: '/admin/hero' },
    { icon: Camera, label: 'Anı Köşesi', href: '/admin/memory' },
    { icon: FileText, label: 'Duyurular & Haberler', href: '/admin/posts' },
    { icon: ImageIcon, label: 'Fotoğraf Galerisi', href: '/admin/gallery' },
    { icon: FileBox, label: 'Sayfa Ayarları', href: '/admin/pages' },
    { icon: Users, label: 'Yönetim Kurulu', href: '/admin/members' },
    { icon: Landmark, label: 'Atatürk Köşesi', href: '/admin/ataturk' },
    { icon: Bell, label: 'Gelen Mesajlar', href: '/admin/messages' },
    { icon: Settings, label: 'Ayarlar', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // If we are on the login page, don't show the layout
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full py-6">
            <div className="px-6 mb-10 flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-red rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-900/20">
                    <span className="font-serif italic font-black text-xl">K</span>
                </div>
                <div>
                    <h1 className="text-sm font-black uppercase tracking-widest text-slate-100">Kürasyon</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-none">Admin Paneli</p>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${isActive
                                ? 'bg-primary-red text-white shadow-xl shadow-red-900/40'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                                }`}
                        >
                            <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight size={14} className="text-white/50" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-6 mt-6 space-y-4">
                <Separator className="bg-slate-800" />
                <Link
                    href="/"
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors group"
                >
                    <ExternalLink size={14} />
                    Siteye Göz At
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="w-full h-12 rounded-xl flex items-center gap-3 px-4 text-sm font-bold text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all border border-transparent hover:border-red-900/30"
                >
                    <LogOut size={18} />
                    Oturumu Kapat
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f8f9fa] font-sans text-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 bg-slate-950 border-r border-slate-900 shadow-2xl relative z-20">
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-slate-600">
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 bg-slate-950 border-slate-900">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>

                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="İçerik, haber veya medya ara..."
                                className="pl-10 h-11 w-80 bg-slate-50 border-slate-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary-red/10 focus:bg-white transition-all text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-primary-red">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-red rounded-full border-2 border-white" />
                        </Button>

                        <Separator orientation="vertical" className="h-8 bg-slate-200" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Kenan Başkan</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mt-1">Süper Yetkili</p>
                                    </div>
                                    <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-primary-red transition-all shadow-sm">
                                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kenan" />
                                        <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">KB</AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl bg-white border-slate-100 shadow-2xl">
                                <DropdownMenuLabel className="px-3 pb-2 text-xs font-black uppercase text-slate-400">Profilim</DropdownMenuLabel>
                                <DropdownMenuItem className="rounded-lg h-10 px-3 font-bold text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                                    <User size={16} className="mr-3 text-slate-400" /> Hesap Ayarları
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                <DropdownMenuItem
                                    onClick={() => signOut()}
                                    className="rounded-lg h-10 px-3 font-bold text-sm text-red-500 hover:bg-red-50 cursor-pointer"
                                >
                                    <LogOut size={16} className="mr-3" /> Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8f9fa]">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

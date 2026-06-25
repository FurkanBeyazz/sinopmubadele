'use client';

import React from 'react';
import {
    LayoutDashboard,
    FileEdit,
    Image as ImageIcon,
    Settings,
    LogOut,
    Bell,
    Search,
    Home
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 text-slate-400 flex flex-col shadow-2xl">
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-red rounded-sm flex items-center justify-center text-white">
                        <span className="font-serif italic font-black">K</span>
                    </div>
                    <span className="text-white font-bold tracking-tight uppercase text-xs">Kürasyon Merkezi</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
                        { icon: FileEdit, label: 'Sayfa Yönetimi', href: '/admin/pages' },
                        { icon: ImageIcon, label: 'Medya Galeri', href: '/admin/gallery' },
                        { icon: Settings, label: 'Sistem Ayarları', href: '#' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all text-sm font-medium hover:bg-slate-900/50 hover:text-slate-200"
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-900 space-y-2">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-medium hover:bg-slate-900/50 hover:text-slate-200 transition-colors"
                    >
                        <Home size={18} />
                        Siteye Dön
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-md text-sm font-medium hover:bg-red-950/20 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        Oturumu Kapat
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-400">
                        <Search size={18} />
                        <input
                            placeholder="Sistemde ara..."
                            className="bg-transparent text-sm focus:outline-none w-64 text-slate-900"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-slate-600 relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-primary-red rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold leading-none text-slate-900">Kenan Başkan</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">Süper Admin</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kenan" alt="avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12 lg:p-16">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

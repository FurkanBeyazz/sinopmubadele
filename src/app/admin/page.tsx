'use client';

import React from 'react';
import {
    Users,
    FileText,
    ImageIcon,
    TrendingUp,
    ArrowUpRight,
    History,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
    {
        label: 'Toplam Ziyaretçi',
        value: '1,284',
        change: '+12%',
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-100'
    },
    {
        label: 'Yayındaki Haberler',
        value: '24',
        change: '+2',
        icon: FileText,
        color: 'text-primary-red',
        bg: 'bg-red-100'
    },
    {
        label: 'Galeri Fotoğrafları',
        value: '156',
        change: '+8',
        icon: ImageIcon,
        color: 'text-amber-600',
        bg: 'bg-amber-100'
    },
    {
        label: 'Aktif Duyurular',
        value: '6',
        change: 'Sabit',
        icon: Activity,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100'
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 serif">Dashboard Özet</h2>
                    <p className="text-slate-500 font-medium mt-1">Kürasyon Merkezi genel durumu ve son aktiviteler.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-6 font-bold uppercase tracking-widest text-[10px] border-slate-200">
                        <History size={16} className="mr-2" /> Arşiv Raporu
                    </Button>
                    <Button className="h-11 px-6 font-bold uppercase tracking-widest text-[10px] bg-primary-red hover:bg-red-800 text-white shadow-lg shadow-red-900/20">
                        Yeni İçerik Ekle
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={18} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1">
                                <span className={stat.change.includes('+') ? 'text-emerald-600' : 'text-slate-400'}>
                                    {stat.change}
                                </span>
                                <span className="text-slate-400 uppercase tracking-tighter">bu ay</span>
                                {stat.change.includes('+') && <TrendingUp size={12} className="text-emerald-600 ml-1" />}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity / Quick Actions Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-slate-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center justify-between">
                            Son Aktiviteler
                            <Button variant="link" className="text-[10px] font-black uppercase text-primary-red p-0 h-auto">
                                Tümünü Gör <ArrowUpRight size={12} className="ml-1" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {[
                                { user: 'Kenan Başkan', action: 'Yeni bir haber yayınladı', target: 'Mübadele Sergisi Hakkında', time: '2 saat önce' },
                                { user: 'Sistem', action: 'Otomatik yedekleme tamamlandı', target: 'Medya Kasası', time: '5 saat önce' },
                                { user: 'Kenan Başkan', action: 'Sayfa tasarımını güncelledi', target: 'Ana Sayfa - Hero', time: 'Dün' },
                                { user: 'Yazılım Ekibi', action: 'Prisma şeması güncellendi', target: 'Database V2', time: '2 gün önce' },
                            ].map((activity, i) => (
                                <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <History size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 leading-none">{activity.user}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                <span className="font-medium">{activity.action}:</span>{' '}
                                                <span className="text-primary-blue font-bold tracking-tight">{activity.target}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm bg-primary-blue text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <CardHeader>
                        <CardTitle className="text-lg font-bold tracking-tight serif">Hızlı Yönetim</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <Button variant="outline" className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary-blue font-bold uppercase tracking-widest text-[10px] justify-start group">
                            <ImageIcon size={16} className="mr-4 group-hover:scale-110 transition-transform" /> Galeriye Resim Yükle
                        </Button>
                        <Button variant="outline" className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary-blue font-bold uppercase tracking-widest text-[10px] justify-start group">
                            <FileText size={16} className="mr-4 group-hover:scale-110 transition-transform" /> Yeni Duyuru Hazırla
                        </Button>
                        <Button variant="outline" className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary-blue font-bold uppercase tracking-widest text-[10px] justify-start group">
                            <Users size={16} className="mr-4 group-hover:scale-110 transition-transform" /> Kullanıcıları Yönet
                        </Button>
                        <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Sistem Durumu</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs font-bold">Veritabanı</span>
                                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Aktif
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

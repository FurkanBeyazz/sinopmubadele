import { Plus, FileText, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { prisma } from '@/lib/prisma';
import { DeletePostButton } from './delete-button';

export default async function PostsPage() {
    const posts = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 serif">Duyurular & Haberler</h2>
                    <p className="text-slate-500 font-medium mt-1">Tüm haberleri yönetin, düzenleyin ve yayınlayın.</p>
                </div>
                <Link href="/admin/posts/new">
                    <Button className="h-11 px-6 font-bold uppercase tracking-widest text-[10px] bg-primary-red hover:bg-red-800 text-white shadow-lg shadow-red-900/20">
                        <Plus size={16} className="mr-2" /> Yeni Haber Ekle
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600"><FileText size={18} /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toplam</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600"><Eye size={18} /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{posts.filter(p => p.published).length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yayında</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600"><EyeOff size={18} /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{posts.filter(p => !p.published).length}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taslak</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-0">
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <FileText size={28} className="text-slate-300" />
                            </div>
                            <p className="text-lg font-bold text-slate-900">Henüz haber eklenmemiş</p>
                            <p className="text-sm text-slate-500 mt-1 mb-6">İlk haberinizi oluşturarak başlayın.</p>
                            <Link href="/admin/posts/new">
                                <Button className="bg-primary-red hover:bg-red-800 text-white font-bold uppercase tracking-widest text-[10px]">
                                    <Plus size={16} className="mr-2" /> İlk Haberi Oluştur
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-6">Başlık</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Kategori</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durum</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Tarih</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-6">İşlem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id} className="group">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                {post.featuredImage ? (
                                                    <img src={post.featuredImage} alt={post.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        <FileText size={16} className="text-slate-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900 line-clamp-1">{post.title}</p>
                                                    {post.excerpt && <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{post.excerpt}</p>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-slate-50 text-slate-600 border-slate-100">
                                                {post.category}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${post.published
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                {post.published ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <span className="text-xs font-medium text-slate-500">
                                                {new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                                                        <MoreHorizontal size={16} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl bg-white border-slate-100 shadow-xl">
                                                    <DropdownMenuItem asChild className="rounded-lg h-9 px-3 font-bold text-sm cursor-pointer">
                                                        <Link href={`/admin/posts/${post.id}`}>
                                                            <Pencil size={14} className="mr-2 text-slate-400" /> Düzenle
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DeletePostButton postId={post.id} postTitle={post.title} />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

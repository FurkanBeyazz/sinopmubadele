'use client';

import { useState } from 'react';
import { Shield, Database, Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { changePassword } from '@/actions/account-actions';

export default function SettingsPage() {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (next !== confirm) {
            toast.error('Yeni şifreler eşleşmiyor.');
            return;
        }
        if (next.length < 8) {
            toast.error('Yeni şifre en az 8 karakter olmalıdır.');
            return;
        }
        setLoading(true);
        const res = await changePassword(current, next);
        setLoading(false);
        if (res.success) {
            toast.success('Şifreniz güncellendi.');
            setCurrent(''); setNext(''); setConfirm('');
        } else {
            toast.error(res.error || 'Bir hata oluştu.');
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="serif text-3xl font-bold tracking-tight text-slate-900">Ayarlar</h2>
                <p className="mt-1 font-medium text-slate-500">Güvenlik ve sistem yönetimi.</p>
            </div>

            {/* Şifre Değiştirme */}
            <div className="max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-red-50 p-3 text-red-900">
                        <Shield size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Şifre Değiştir</h3>
                        <p className="text-sm text-slate-500">Yönetici giriş şifrenizi güncelleyin.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="text-sm">Mevcut Şifre</Label>
                        <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" className="bg-slate-50" required />
                    </div>
                    <div>
                        <Label className="text-sm">Yeni Şifre</Label>
                        <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" placeholder="En az 8 karakter" className="bg-slate-50" required />
                    </div>
                    <div>
                        <Label className="text-sm">Yeni Şifre (Tekrar)</Label>
                        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className="bg-slate-50" required />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-red-900 hover:bg-red-800">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                        Şifreyi Güncelle
                    </Button>
                </form>
            </div>

            {/* Veritabanı / Yedekleme Bilgisi */}
            <div className="max-w-xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 text-slate-500">
                        <Database size={22} />
                    </div>
                    <h3 className="font-bold text-slate-900">Veritabanı Yedekleme</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                    Tüm içerik <code className="rounded bg-slate-100 px-1">prisma/dev.db</code> dosyasında tutulur.
                    Sunucuda bu dosyanın düzenli kopyasını almanız önerilir. Otomatik günlük yedek için
                    sunucuda bir zamanlanmış görev (cron) kurulabilir.
                </p>
            </div>
        </div>
    );
}

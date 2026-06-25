'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Landmark, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                // NextAuth returns the error message from authorize()
                setError(res.error === 'CredentialsSignin'
                    ? 'Geçersiz e-posta veya şifre.'
                    : res.error
                );
                setIsLoading(false);
            } else {
                router.push('/admin');
                router.refresh();
            }
        } catch (err) {
            setError('Sunucu hatası. Lütfen tekrar deneyin.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] px-4 relative overflow-hidden">
            {/* Ambient Background with Blur */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1920"
                    alt="Background"
                    className="w-full h-full object-cover grayscale opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-stone-100/80 via-white/40 to-stone-200/80 backdrop-blur-[2px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md z-10"
            >
                <Card className="border-stone-200 shadow-2xl bg-white/90 backdrop-blur-xl">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto w-12 h-12 bg-primary-red flex items-center justify-center text-white rounded-lg shadow-lg">
                            <Landmark size={24} />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 serif">Yönetici Girişi</CardTitle>
                            <CardDescription className="text-slate-500 font-medium">
                                Sinop Mübadele Derneği Kürasyon Merkezi
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">E-Posta</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <Input
                                        type="text"
                                        placeholder="admin@sinopmubadele.org"
                                        className="pl-10 h-12 bg-stone-50/50 border-stone-200 focus:ring-primary-red/20 focus:border-primary-red"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12 bg-stone-50/50 border-stone-200 focus:ring-primary-red/20 focus:border-primary-red"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                                    <p className="text-xs font-bold text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary-blue hover:bg-slate-800 text-white font-bold uppercase tracking-widest transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    'Sisteme Giriş Yap'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-stone-100 pt-6">
                        <button
                            onClick={() => router.push('/')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-red transition-colors"
                        >
                            ← Ana Sayfaya Dön
                        </button>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-stone-400 mt-6 font-bold uppercase tracking-widest">
                    Korumalı Alan · Yetkisiz Erişim Yasaktır
                </p>
            </motion.div>
        </div>
    );
}

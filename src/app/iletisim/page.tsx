'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { submitMessage, ContactFormData } from "@/actions/contact-actions";
import Reveal from "@/components/reveal";

const contactSchema = z.object({
    name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    phone: z.string()
        .min(7, "Geçerli bir telefon numarası giriniz")
        .regex(/^[0-9+()\s-]+$/, "Telefon yalnızca rakam ve + ( ) - içerebilir"),
    subject: z.string().min(3, "Konu en az 3 karakter olmalıdır"),
    message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

// Arka arkaya gönderim engeli: iki gönderim arasında en az 90 saniye
const COOLDOWN_MS = 90 * 1000;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [honeypot, setHoneypot] = useState(""); // bot tuzağı (gizli)

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    async function onSubmit(data: ContactFormData) {
        // Kullanıcı tarafı bekleme: kısa sürede tekrar göndermeyi engelle
        const last = Number(localStorage.getItem("lastContactSubmit") || 0);
        const remaining = COOLDOWN_MS - (Date.now() - last);
        if (remaining > 0) {
            toast.error(`Çok hızlı gönderdiniz. Lütfen ${Math.ceil(remaining / 1000)} saniye sonra tekrar deneyin.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await submitMessage(data, honeypot);
            if (result.success) {
                localStorage.setItem("lastContactSubmit", String(Date.now()));
                toast.success("Mesajınız iletildi. En kısa sürede size döneceğiz.");
                form.reset();
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#fdfbf7] relative overflow-hidden">
            {/* Zarif arka plan parlaması */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

            {/* Editoryal Başlık */}
            <header className="container mx-auto px-4 pt-32 pb-14 md:pt-40 md:pb-20 text-center relative">
                <Reveal>
                    <span className="text-xs font-bold tracking-[0.25em] text-red-900/70 uppercase mb-4 block">
                        Size Bir Mesaj Uzaklıktayız
                    </span>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1A202C] mb-6 tracking-tight">
                        İletişim
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
                        Derneğimizle ilgili her türlü soru, öneri ve görüşleriniz için bize ulaşabilirsiniz.
                    </p>
                </Reveal>
            </header>

            <div className="container mx-auto px-4 pb-24 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Information & Map */}
                    <Reveal delay={0.1} className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="font-serif text-3xl font-bold text-slate-900">İletişim Bilgilerimiz</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
                                <CardContent className="p-6 flex items-start space-x-4">
                                    <div className="p-3 bg-red-900/10 rounded-full group-hover:bg-red-900 transition-colors duration-300">
                                        <MapPin className="h-6 w-6 text-red-900 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 mb-1 font-serif">Adres</p>
                                        <p className="text-sm text-slate-600 font-light">Kefevi, Kuruçeşme Sk. No:23/1, 57000 Sinop Merkez/Sinop</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl group">
                                <CardContent className="p-6 flex items-start space-x-4">
                                    <div className="p-3 bg-red-900/10 rounded-full group-hover:bg-red-900 transition-colors duration-300">
                                        <Phone className="h-6 w-6 text-red-900 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 mb-1 font-serif">Telefon</p>
                                        <p className="text-sm text-slate-600 font-light">+90 (368) 123 45 67</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl group md:col-span-2">
                                <CardContent className="p-6 flex items-start space-x-4">
                                    <div className="p-3 bg-red-900/10 rounded-full group-hover:bg-red-900 transition-colors duration-300">
                                        <Mail className="h-6 w-6 text-red-900 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 mb-1 font-serif">E-posta</p>
                                        <p className="text-sm text-slate-600 font-light">info@sinopmubadele.org.tr</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Map */}
                        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 grayscale hover:grayscale-0 transition-all duration-700 shadow-xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2979.673857846543!2d35.1508!3d42.0266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40887c4731111111%3A0x1111111111111111!2sKefevi%2C%20Kuru%C3%A7e%C5%9Fme%20Sk.%20No%3A23%2F1%2C%2057000%20Sinop%20Merkez%2FSinop!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </Reveal>

                    {/* Right Column - Form */}
                    <Reveal delay={0.2} className="bg-white p-8 md:p-12 border border-slate-100 shadow-2xl rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
                        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8">Bize Mesaj Gönderin</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Honeypot (bot tuzağı) — ekranda ve okuyucuda gizli */}
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                    aria-hidden="true"
                                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold tracking-wide uppercase text-[10px]">Ad Soyad</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Adınız ve soyadınız" {...field} className="rounded-px border-slate-200 focus:border-red-900 transition-colors py-6" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-900" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold tracking-wide uppercase text-[10px]">E-posta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="E-posta adresiniz" type="email" {...field} className="rounded-px border-slate-200 focus:border-red-900 transition-colors py-6" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-900" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold tracking-wide uppercase text-[10px]">Telefon</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Telefon numaranız" type="tel" {...field} className="rounded-px border-slate-200 focus:border-red-900 transition-colors py-6" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-900" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold tracking-wide uppercase text-[10px]">Konu</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mesajınızın konusu" {...field} className="rounded-px border-slate-200 focus:border-red-900 transition-colors py-6" />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-900" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-semibold tracking-wide uppercase text-[10px]">Mesaj</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Mesajınızı buraya yazın..." className="min-h-[150px] rounded-px border-slate-200 focus:border-red-900 transition-colors resize-none pt-4" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs text-red-900" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-7 rounded-px transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    {isSubmitting ? "Gönderiliyor..." : (
                                        <>
                                            Mesajı Gönder <Send className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}

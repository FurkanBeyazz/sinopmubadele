'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { createMember, updateMember } from "@/actions/member-actions";
import { memberSchema, MemberFormData } from "@/lib/validations";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const NONE_VALUE = "__none__";

interface MemberFormProps {
    initialData?: any;
    members?: any[];
    onSuccess: () => void;
}

export default function MemberForm({ initialData, members = [], onSuccess }: MemberFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const emptyValues = {
        name: "",
        role: "",
        image: "",
        bio: "",
        order: 0,
        type: "birim" as const,
        status: "asil" as const,
        parentId: null,
    };

    const form = useForm<z.input<typeof memberSchema>, any, MemberFormData>({
        resolver: zodResolver(memberSchema),
        defaultValues: initialData
            ? { ...emptyValues, ...initialData }
            : emptyValues,
    });

    // Reset form values when initialData changes
    useEffect(() => {
        if (initialData) {
            form.reset({ ...emptyValues, ...initialData });
        } else {
            form.reset(emptyValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, form]);

    // Üst birim olarak seçilebilecek adaylar (kendisi hariç)
    const parentOptions = members.filter((m) => m.id !== initialData?.id);

    const imageUrl = form.watch("image");

    async function onSubmit(data: MemberFormData) {
        setIsLoading(true);
        try {
            const result = initialData
                ? await updateMember(initialData.id, data)
                : await createMember(data);

            if (result.success) {
                toast.success(initialData ? "Üye güncellendi." : "Üye oluşturuldu.");
                onSuccess();
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-slate-900">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Fotoğraf</p>
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Fotoğraf</FormLabel>
                            <FormControl>
                                {field.value ? (
                                    <div className="relative aspect-square w-40 overflow-hidden rounded-xl border border-slate-200">
                                        <Image
                                            src={field.value}
                                            alt="Üye Fotoğrafı"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => field.onChange("")}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-100 hover:border-red-200 transition-colors">
                                        <UploadDropzone
                                            endpoint="imageUploader"
                                            config={{ mode: "auto" }}
                                            onClientUploadComplete={(res) => {
                                                const f: any = res?.[0];
                                                const url = f?.ufsUrl || f?.url || f?.appUrl;
                                                if (url) {
                                                    field.onChange(url);
                                                    toast.success("Fotoğraf yüklendi.");
                                                } else {
                                                    toast.error("Fotoğraf yüklendi ama adres alınamadı.");
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error(`Yükleme hatası: ${error.message}`);
                                            }}
                                            className="ut-button:bg-red-900 ut-label:text-red-900 ut-allowed-content:text-slate-500 border-none py-10"
                                        />
                                    </div>
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="border-t border-slate-100 pt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kişi Bilgileri</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-slate-700">Ad Soyad</FormLabel>
                                <FormControl>
                                    <Input placeholder="Üyenin adı ve soyadı" {...field} className="rounded-xl bg-slate-50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-slate-700">Unvan / Rol</FormLabel>
                                <FormControl>
                                    <Input placeholder="Örn: Yönetim Kurulu Başkanı" {...field} className="rounded-xl bg-slate-50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Görev / Konum</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-slate-700">Kademe / Tür</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl bg-slate-50">
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="baskan">Başkan</SelectItem>
                                        <SelectItem value="yardimci">Başkan Yardımcısı</SelectItem>
                                        <SelectItem value="yonetim">Yönetim Kurulu Üyesi</SelectItem>
                                        <SelectItem value="denetim">Denetim Kurulu Üyesi</SelectItem>
                                        <SelectItem value="disiplin">Disiplin Kurulu Üyesi</SelectItem>
                                        <SelectItem value="danisman">Danışma Kurulu Üyesi</SelectItem>
                                        <SelectItem value="birim">Birim / Müdürlük</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium">Üyelik Durumu</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="rounded-xl bg-slate-50">
                                            <SelectValue placeholder="Seçiniz" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="asil">Asil</SelectItem>
                                        <SelectItem value="yedek">Yedek</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold text-slate-700">Sıralama (Küçükten büyüğe)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value as number}
                                        className="rounded-xl bg-slate-50"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-slate-700">Bağlı Olduğu Üst Birim</FormLabel>
                            <Select
                                onValueChange={(v) => field.onChange(v === NONE_VALUE ? null : v)}
                                value={field.value || NONE_VALUE}
                            >
                                <FormControl>
                                    <SelectTrigger className="rounded-xl bg-slate-50">
                                        <SelectValue placeholder="Üst birim seçin (opsiyonel)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={NONE_VALUE}>— Yok (En üst seviye) —</SelectItem>
                                    {parentOptions.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.name} — {m.role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-400">
                                Örn: bir müdürlüğü ilgili başkan yardımcısına bağlayın. Başkan için boş bırakın.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-slate-700">Biyografi / Özgeçmiş (Opsiyonel)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Üye hakkında kısa bilgi..."
                                    className="min-h-[100px] rounded-xl resize-none bg-slate-50"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-6 rounded-xl transition-all"
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {initialData ? "Güncelle" : "Ekle"}
                </Button>
            </form>
        </Form>
    );
}

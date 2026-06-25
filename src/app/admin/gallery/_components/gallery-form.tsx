"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UploadButton } from "@/utils/uploadthing";
import { createGallery, updateGallery } from "@/actions/gallery-actions";
import { toast } from "sonner";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const formSchema = z.object({
    title: z.string().min(1, "Bu alan zorunludur."),
    description: z.string().optional(),
    coverImage: z.string().optional(),
});

interface GalleryFormProps {
    initialData?: {
        id: string;
        title: string;
        description: string | null;
        coverImage: string | null;
    };
    onSuccess?: () => void;
}

export default function GalleryForm({ initialData, onSuccess }: GalleryFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            coverImage: initialData?.coverImage || "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                description: initialData.description || "",
                coverImage: initialData.coverImage || "",
            });
        }
    }, [initialData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const result = initialData
                ? await updateGallery(initialData.id, values)
                : await createGallery(values);

            if (result.success) {
                toast.success(initialData ? "Albüm güncellendi." : "Albüm oluşturuldu.");
                if (!initialData) form.reset();
                if (onSuccess) onSuccess();
                router.refresh();
                if (!initialData) router.push(`/admin/gallery/${result.gallery?.id}`);
            } else {
                toast.error(result.error as string);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] font-semibold text-slate-900 uppercase tracking-tight">Albüm Başlığı</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Örn: 2024 Dernek Kermesi"
                                    className={cn(
                                        "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white transition-all h-12",
                                        fieldState.error && "border-red-500 ring-1 ring-red-500"
                                    )}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-xs font-medium text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] font-semibold text-slate-900 uppercase tracking-tight">Açıklama (Opsiyonel)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Albüm hakkında kısa bilgi..."
                                    className="min-h-[120px] bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:bg-white transition-all resize-none p-4"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] font-semibold text-slate-900 uppercase tracking-tight">Kapak Görseli</FormLabel>
                            <div className="mt-2">
                                {field.value ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                                        <Image
                                            src={field.value}
                                            alt="Kapak Görseli"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-3 right-3 shadow-xl rounded-full h-8 w-8"
                                            onClick={() => field.onChange("")}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30 transition-all hover:border-red-900/50 hover:bg-red-50/10 group">
                                        <div className="mb-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-red-900" />
                                        </div>
                                        <UploadButton
                                            endpoint="imageUploader"
                                            appearance={{
                                                button: "bg-red-900 hover:bg-red-800 px-8 py-2 h-auto text-sm font-bold shadow-lg transition-all active:scale-[0.98]",
                                                allowedContent: "text-slate-500 text-[10px] mt-3"
                                            }}
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]) {
                                                    field.onChange(res[0].url);
                                                    toast.success("Kapak görseli yüklendi.");
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error(`Hata: ${error.message}`);
                                            }}
                                        />
                                        <p className="mt-4 text-[11px] text-slate-400 font-medium">PNG, JPG veya WEBP (Max 4MB)</p>
                                    </div>
                                )}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-7 text-lg shadow-xl shadow-red-900/10 rounded-xl transition-all active:scale-[0.98]">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" /> {initialData ? "Güncelleniyor..." : "Oluşturuluyor..."}
                        </>
                    ) : (
                        initialData ? "Bilgileri Güncelle" : "Albüm Oluştur"
                    )}
                </Button>
            </form>
        </Form>
    );
}

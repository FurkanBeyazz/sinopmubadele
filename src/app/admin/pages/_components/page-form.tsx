"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { UploadButton } from "@/utils/uploadthing";
import { createPage, updatePage } from "@/actions/page-actions";
import Editor from "@/components/editor";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().min(2, "Başlık en az 2 karakter olmalıdır."),
    slug: z.string().optional(),
    content: z.string().optional(),
    heroImage: z.string().optional(),
});

interface PageFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        content: string | null;
        heroImage: string | null;
    };
}

export default function PageForm({ initialData }: PageFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            content: initialData?.content || "",
            heroImage: initialData?.heroImage || "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                slug: initialData.slug,
                content: initialData.content || "",
                heroImage: initialData.heroImage || "",
            });
        }
    }, [initialData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            const payload = {
                title: values.title,
                content: values.content || "",
                heroImage: values.heroImage || "",
            };
            const result = initialData
                ? await updatePage(initialData.slug, payload)
                : await createPage({ ...payload, slug: values.slug });

            if (result.success) {
                toast.success(initialData ? "Sayfa güncellendi." : "Sayfa oluşturuldu.");
                router.push("/admin/pages");
                router.refresh();
            } else {
                toast.error((result as any).error || (result as any).message || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sayfa Başlığı</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Örn: Hakkımızda" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL (Slug)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="hakkimizda (Otomatik oluşturulur)" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Boş bırakırsanız başlıktan otomatik oluşturulur.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İçerik</FormLabel>
                                    <FormControl>
                                        <Editor
                                            content={field.value || ""}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="heroImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kapak Görseli</FormLabel>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                        {field.value ? (
                                            <div className="relative w-full aspect-video rounded-md overflow-hidden group">
                                                <Image
                                                    src={field.value}
                                                    alt="Kapak Görseli"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => field.onChange("")}
                                                    >
                                                        <X className="w-4 h-4 mr-2" /> Kaldır
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-8">
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        if (res && res[0]) {
                                                            field.onChange(res[0].url);
                                                            toast.success("Görsel yüklendi");
                                                        }
                                                    }}
                                                    onUploadError={(error: Error) => {
                                                        toast.error(`Yükleme hatası: ${error.message}`);
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Sayfanın en  üstünde görünecek büyük görsel.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full bg-red-900 hover:bg-red-800">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor...
                                </>
                            ) : (
                                initialData ? "Güncelle" : "Oluştur"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}

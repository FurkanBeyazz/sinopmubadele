import { z } from "zod";

export const memberSchema = z.object({
    name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    role: z.string().min(2, "Unvan en az 2 karakter olmalıdır"),
    image: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    order: z.coerce.number().int().default(0),
    type: z.enum(["baskan", "yardimci", "yonetim", "denetim", "disiplin", "danisman", "birim"]).default("birim"),
    status: z.enum(["asil", "yedek"]).default("asil"),
    parentId: z.string().optional().nullable(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export const contactSchema = z.object({
    name: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    subject: z.string().min(3, "Konu en az 3 karakter olmalıdır"),
    message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

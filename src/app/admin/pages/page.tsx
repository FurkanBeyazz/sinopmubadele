import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, FileText } from "lucide-react";
import Link from "next/link";
import React from 'react';

const STATIC_PAGES = [
    { slug: "tarihce", title: "Tarihçe" },
    { slug: "yonetim-kurulu", title: "Yönetim Kurulu" },
    { slug: "iletisim", title: "İletişim" },
    { slug: "hakkimizda", title: "Hakkımızda" },
    { slug: "misyon-vizyon", title: "Misyon ve Vizyon" },
    { slug: "tuzuk", title: "Dernek Tüzüğü" },
    { slug: "gizlilik", title: "KVKK ve Gizlilik" },
    { slug: "uyelik", title: "Üyelik Başvurusu" },
    { slug: "kultur-evi", title: "Kültür Evi Tanıtımı" },
];

export default function PagesList() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sayfa Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Sitedeki sabit sayfaların içeriklerini buradan düzenleyebilirsiniz.
                    </p>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Sayfa Adı</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {STATIC_PAGES.map((page) => (
                            <TableRow key={page.slug}>
                                <TableCell>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </TableCell>
                                <TableCell className="font-medium">{page.title}</TableCell>
                                <TableCell className="text-muted-foreground font-mono text-xs">
                                    /{page.slug}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/pages/${page.slug}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

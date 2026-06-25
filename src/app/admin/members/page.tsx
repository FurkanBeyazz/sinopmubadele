'use client';

import { useEffect, useState } from "react";
import { getMembers, deleteMember } from "@/actions/member-actions";
import { Button } from "@/components/ui/button";
import { Plus, Users, Edit, Trash2, GripVertical } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MemberForm from "./_components/member-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Kurul grupları — anasayfadaki şema sırasıyla aynı
const GROUPS: { type: string; title: string; badge: string }[] = [
    { type: "baskan", title: "Başkan", badge: "bg-red-100 text-red-800" },
    { type: "yardimci", title: "Başkan Yardımcıları", badge: "bg-amber-100 text-amber-800" },
    { type: "yonetim", title: "Yönetim Kurulu", badge: "bg-blue-100 text-blue-800" },
    { type: "denetim", title: "Denetim Kurulu", badge: "bg-purple-100 text-purple-800" },
    { type: "disiplin", title: "Disiplin Kurulu", badge: "bg-rose-100 text-rose-800" },
    { type: "danisman", title: "Yüksek İstişare (Danışma) Kurulu", badge: "bg-emerald-100 text-emerald-800" },
    { type: "birim", title: "Birim / Müdürlükler", badge: "bg-slate-100 text-slate-700" },
];

// Asil önce, sonra yedek; her grup kendi içinde sıraya göre
function sortGroup(list: any[]) {
    return [...list].sort((a, b) => {
        if ((a.status === "yedek") !== (b.status === "yedek")) {
            return a.status === "yedek" ? 1 : -1;
        }
        return (a.order ?? 0) - (b.order ?? 0);
    });
}

export default function AdminMembersPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);

    useEffect(() => {
        loadMembers();
    }, []);

    async function loadMembers() {
        const data = await getMembers();
        setMembers(data);
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu üyeyi silmek istediğinize emin misiniz?")) return;
        const result = await deleteMember(id);
        if (result.success) {
            toast.success("Üye silindi.");
            loadMembers();
        } else {
            toast.error("Üye silinemedi.");
        }
    }

    function handleEdit(member: any) {
        setEditingMember(member);
        setIsSheetOpen(true);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Yönetim Kurulu</h1>
                    <p className="text-muted-foreground">Dernek yönetim kurulu üyelerini yönetin ve sıralayın.</p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                    setIsSheetOpen(open);
                    if (!open) setEditingMember(null);
                }}>
                    <SheetTrigger asChild>
                        <Button className="bg-red-900 hover:bg-red-800">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Üye Ekle
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-xl overflow-y-auto bg-white border-l border-slate-200 shadow-2xl p-0">
                        <SheetHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-5 text-left">
                            <SheetTitle className="text-xl font-bold text-slate-900">
                                {editingMember ? "Üyeyi Düzenle" : "Yeni Üye Ekle"}
                            </SheetTitle>
                            <SheetDescription className="text-slate-500">
                                Yönetim kurulu üyesi bilgilerini buradan {editingMember ? "güncelleyin" : "ekleyin"}.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="px-6 py-6">
                            <MemberForm
                                initialData={editingMember}
                                members={members}
                                onSuccess={() => {
                                    setIsSheetOpen(false);
                                    loadMembers();
                                }}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {members.length === 0 ? (
                <div className="border rounded-xl bg-white py-16 text-center text-slate-500 shadow-sm">
                    Henüz üye eklenmedi.
                </div>
            ) : (
                <div className="space-y-8">
                    {GROUPS.map((group) => {
                        const groupMembers = sortGroup(members.filter((m) => m.type === group.type));
                        if (groupMembers.length === 0) return null;

                        return (
                            <div key={group.type} className="border rounded-xl bg-white overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between border-b bg-slate-50 px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className={"inline-block rounded-full px-3 py-1 text-sm font-bold " + group.badge}>
                                            {group.title}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-400">
                                        {groupMembers.length} kişi
                                    </span>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[70px]">Sıra</TableHead>
                                            <TableHead>Üye</TableHead>
                                            <TableHead>Unvan</TableHead>
                                            <TableHead className="w-[110px]">Durum</TableHead>
                                            <TableHead className="text-right">İşlemler</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {groupMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-mono text-slate-400">{member.order}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border border-slate-100">
                                                            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                                                {member.name.split(" ").map((n: any) => n[0]).join("").toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-bold">{member.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{member.role}</TableCell>
                                                <TableCell>
                                                    <span className={
                                                        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                                                        (member.status === "yedek"
                                                            ? "border border-slate-300 text-slate-500"
                                                            : "bg-green-100 text-green-700")
                                                    }>
                                                        {member.status === "yedek" ? "Yedek" : "Asil"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(member)} title="Düzenle">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(member.id)} title="Sil">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

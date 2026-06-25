'use client';

import { useEffect, useState } from "react";
import { getMessages, markAsRead, deleteMessage } from "@/actions/contact-actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Mail, MailOpen, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    async function loadMessages() {
        const data = await getMessages();
        setMessages(data);
    }

    async function handleView(message: any) {
        setSelectedMessage(message);
        setIsDialogOpen(true);
        if (!message.isRead) {
            const result = await markAsRead(message.id);
            if (result.success) {
                setMessages(prev => prev.map(m => m.id === message.id ? { ...m, isRead: true } : m));
            }
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

        const result = await deleteMessage(id);
        if (result.success) {
            toast.success("Mesaj silindi.");
            setMessages(prev => prev.filter(m => m.id !== id));
        } else {
            toast.error("Mesaj silinemedi.");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gelen Kutusu</h1>
                    <p className="text-muted-foreground">Ziyaretçilerden gelen mesajları yönetin.</p>
                </div>
            </div>

            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[200px]">Gönderen</TableHead>
                            <TableHead>Konu</TableHead>
                            <TableHead className="w-[180px]">Tarih</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                                    Henüz mesaj bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((message) => (
                                <TableRow key={message.id} className={!message.isRead ? "font-bold bg-slate-50/50" : ""}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {!message.isRead ? <Mail className="h-4 w-4 text-red-900" /> : <MailOpen className="h-4 w-4 text-slate-400" />}
                                            <div className="flex flex-col">
                                                <span>{message.name}</span>
                                                <span className="text-xs font-normal text-slate-500">{message.email}</span>
                                                {message.phone && (
                                                    <span className="text-xs font-normal text-slate-500">{message.phone}</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{message.subject}</TableCell>
                                    <TableCell className="text-slate-500">
                                        {format(new Date(message.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleView(message)} title="Oku">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(message.id)} title="Sil">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif">{selectedMessage?.subject}</DialogTitle>
                        <DialogDescription className="flex justify-between items-center mt-2">
                            <span>
                                {selectedMessage?.name} ({selectedMessage?.email})
                                {selectedMessage?.phone ? ` · ${selectedMessage.phone}` : ""}
                            </span>
                            <span className="text-xs">
                                {selectedMessage?.createdAt && format(new Date(selectedMessage.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 p-6 bg-slate-50 rounded-xl whitespace-pre-wrap text-slate-700 leading-relaxed border border-slate-100">
                        {selectedMessage?.message}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

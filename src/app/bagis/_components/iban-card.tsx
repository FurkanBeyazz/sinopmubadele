'use client';

import { useState } from "react";
import { Copy, Check, Landmark } from "lucide-react";
import { toast } from "sonner";

interface IbanCardProps {
    banka: string;
    hesapSahibi: string;
    iban: string;
}

export default function IbanCard({ banka, hesapSahibi, iban }: IbanCardProps) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
            setCopied(true);
            toast.success("IBAN kopyalandı.");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Kopyalanamadı, lütfen elle seçin.");
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-900">
                    <Landmark className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Banka</p>
                    <p className="font-bold text-slate-900">{banka}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hesap Sahibi</p>
                <p className="text-sm font-medium text-slate-700">{hesapSahibi}</p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                <code className="select-all break-all font-mono text-sm text-slate-800">{iban}</code>
                <button
                    type="button"
                    onClick={copy}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-red-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-red-800"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Kopyalandı" : "Kopyala"}
                </button>
            </div>
        </div>
    );
}

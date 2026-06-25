'use client';

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export type AccordionItem = {
    id: string;
    title: string;
    icon?: ReactNode;
    body: ReactNode;
};

// Site paletiyle (bordo/krem) uyumlu, yeniden kullanılabilir akordeon kartları.
export default function AccordionCards({
    items,
    defaultOpenId,
}: {
    items: AccordionItem[];
    defaultOpenId?: string;
}) {
    const [open, setOpen] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {items.map((s) => {
                const isOpen = open === s.id;
                return (
                    <div
                        key={s.id}
                        className={
                            "overflow-hidden rounded-2xl border bg-white shadow-sm transition-all " +
                            (isOpen ? "border-red-900/30 shadow-md" : "border-slate-200")
                        }
                    >
                        <button
                            type="button"
                            onClick={() => setOpen(isOpen ? null : s.id)}
                            className="flex w-full items-center gap-4 px-5 py-5 text-left"
                            aria-expanded={isOpen}
                        >
                            {s.icon && (
                                <span
                                    className={
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors " +
                                        (isOpen ? "bg-red-900 text-white" : "bg-red-50 text-red-900")
                                    }
                                >
                                    {s.icon}
                                </span>
                            )}
                            <span className="flex-1 font-serif text-lg font-bold text-slate-900">
                                {s.title}
                            </span>
                            <ChevronDown
                                className={
                                    "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 " +
                                    (isOpen ? "rotate-180 text-red-900" : "")
                                }
                            />
                        </button>

                        <div
                            className="grid transition-all duration-300 ease-in-out"
                            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                        >
                            <div className="overflow-hidden">
                                <div
                                    className="prose prose-slate max-w-none border-t border-slate-100 px-5 py-5
                                        prose-p:text-slate-600 prose-p:leading-relaxed
                                        prose-li:text-slate-600 prose-strong:text-slate-800
                                        prose-ul:list-disc prose-ul:pl-5"
                                >
                                    {s.body}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

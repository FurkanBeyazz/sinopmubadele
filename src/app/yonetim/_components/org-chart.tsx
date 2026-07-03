'use client';

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface Member {
    id: string;
    name: string;
    role: string;
    image?: string | null;
    bio?: string | null;
    order: number;
    type: string; // baskan | yardimci | yonetim | danisman | denetim | birim
    status?: string; // asil | yedek
    parentId?: string | null;
}

function initials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function PersonCard({
    member,
    variant = "default",
    active = false,
    expandable = false,
    onPhotoClick,
}: {
    member: Member;
    variant?: "root" | "default" | "small";
    active?: boolean;
    expandable?: boolean;
    onPhotoClick?: (member: Member) => void;
}) {
    const isRoot = variant === "root";
    const photoSize = isRoot ? "h-24 w-20 sm:h-28 sm:w-24" : "h-[72px] w-16";

    return (
        <div
            className={
                "relative flex w-full items-center gap-3 rounded-2xl border bg-white p-3 text-left shadow-sm transition-all " +
                (active
                    ? "border-primary ring-2 ring-primary/30 shadow-md"
                    : "border-slate-200 hover:border-primary/40 hover:shadow-md") +
                (isRoot ? " sm:gap-5 sm:p-5" : "")
            }
        >
            <span
                role="button"
                tabIndex={0}
                title="Fotoğrafı büyüt"
                onClick={(e) => {
                    e.stopPropagation();
                    onPhotoClick?.(member);
                }}
                className={
                    "shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-slate-100 bg-slate-50 ring-offset-2 transition hover:ring-2 hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 " +
                    photoSize
                }
            >
                {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover object-top"
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center font-semibold text-slate-400">
                        {initials(member.name)}
                    </span>
                )}
            </span>
            <div className="min-w-0 flex-1">
                <p
                    className={
                        "font-bold uppercase leading-tight tracking-wide text-primary " +
                        (isRoot ? "text-xs" : "text-[10px]")
                    }
                >
                    {member.role}
                </p>
                <p
                    className={
                        "font-bold text-slate-900 " +
                        (isRoot ? "text-lg sm:text-xl" : "text-sm leading-snug")
                    }
                >
                    {member.name}
                </p>
            </div>
            {member.status === "yedek" && (
                <span className="absolute right-2 top-2 rounded-full border border-slate-300 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">
                    Yedek
                </span>
            )}
            {expandable && (
                <ChevronDown
                    className={
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform " +
                        (active ? "rotate-180 text-primary" : "")
                    }
                />
            )}
        </div>
    );
}

// Kurul listelerinde 6'lı dizilim için kompakt dikey kart
function CompactMemberCard({
    member,
    onPhotoClick,
}: {
    member: Member;
    onPhotoClick?: (member: Member) => void;
}) {
    return (
        <div className="relative flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
            {member.status === "yedek" && (
                <span className="absolute right-2 top-2 rounded-full border border-slate-300 bg-white px-1.5 py-0.5 text-[8px] font-semibold text-slate-500">
                    Yedek
                </span>
            )}
            <button
                type="button"
                title="Fotoğrafı büyüt"
                onClick={(e) => {
                    e.stopPropagation();
                    onPhotoClick?.(member);
                }}
                className="mb-2 flex h-16 w-16 shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-50 ring-offset-2 transition hover:ring-2 hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.image} alt={member.name} className="h-full w-full object-cover object-top" />
                ) : (
                    <span className="font-semibold text-slate-400">
                        {initials(member.name)}
                    </span>
                )}
            </button>
            <p className="text-[9px] font-bold uppercase leading-tight tracking-wide text-primary">
                {member.role}
            </p>
            <p className="mt-0.5 text-xs font-bold leading-snug text-slate-900">{member.name}</p>
        </div>
    );
}

function KurulSection({
    title,
    members,
    onPhotoClick,
}: {
    title: string;
    members: Member[];
    onPhotoClick?: (member: Member) => void;
}) {
    if (members.length === 0) return null;
    const asil = members.filter((m) => m.status !== "yedek").sort((a, b) => a.order - b.order);
    const yedek = members.filter((m) => m.status === "yedek").sort((a, b) => a.order - b.order);

    const Grid = ({ items }: { items: Member[] }) => (
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
            {items.map((m) => (
                <div key={m.id} className="w-[140px] sm:w-[150px]">
                    <CompactMemberCard member={m} onPhotoClick={onPhotoClick} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="mt-16 w-full">
            <div className="mb-8 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary/30" />
                <h2 className="font-serif text-xl font-bold uppercase tracking-[0.15em] text-[#1A202C] md:text-2xl">
                    {title}
                </h2>
                <div className="h-px w-12 bg-primary/30" />
            </div>
            {asil.length > 0 && (
                <div className="mb-6">
                    {yedek.length > 0 && (
                        <div className="mb-4 flex justify-center">
                            <span className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white shadow-sm">
                                Asil Üyeler
                            </span>
                        </div>
                    )}
                    <Grid items={asil} />
                </div>
            )}
            {yedek.length > 0 && (
                <div>
                    <div className="mb-4 flex justify-center">
                        <span className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 shadow-sm">
                            Yedek Üyeler
                        </span>
                    </div>
                    <Grid items={yedek} />
                </div>
            )}
        </div>
    );
}

export default function OrgChart({ members }: { members: Member[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [photoMember, setPhotoMember] = useState<Member | null>(null);
    const openPhoto = (m: Member) => setPhotoMember(m);

    useEffect(() => {
        if (!photoMember) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPhotoMember(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [photoMember]);

    const baskan = members.find((m) => m.type === "baskan") || null;
    const yardimcilar = members
        .filter((m) => m.type === "yardimci")
        .sort((a, b) => a.order - b.order);

    const childrenOf = (id: string | null | undefined) =>
        members
            .filter((m) => m.type === "birim" && m.parentId === id)
            .sort((a, b) => a.order - b.order);

    // Doğrudan başkana bağlı birimler (başkan yoksa köksüz birimler)
    const dogrudanBirimler = childrenOf(baskan?.id ?? null);

    const activeYardimci = yardimcilar.find((y) => y.id === activeId) || null;
    const activeChildren = activeYardimci ? childrenOf(activeYardimci.id) : [];

    const yonetimUyeleri = members.filter((m) => m.type === "yonetim");
    const denetciler = members.filter((m) => m.type === "denetim");
    const disiplinUyeleri = members.filter((m) => m.type === "disiplin");
    const danismanlar = members.filter((m) => m.type === "danisman");

    if (members.length === 0) {
        return (
            <div className="py-20 text-center text-slate-500">
                Henüz yönetim şeması oluşturulmadı.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            {/* Başkan */}
            {baskan && (
                <div className="w-full max-w-md">
                    <PersonCard member={baskan} variant="root" onPhotoClick={openPhoto} />
                </div>
            )}

            {/* Bağlantı çizgisi */}
            {baskan && yardimcilar.length > 0 && (
                <div className="h-8 w-px bg-slate-300" />
            )}

            {/* Başkan Yardımcıları */}
            {yardimcilar.length > 0 && (
                <div className="w-full">
                    <div className="flex flex-wrap justify-center gap-4">
                        {yardimcilar.map((y) => {
                            const hasChildren = childrenOf(y.id).length > 0;
                            return (
                                <button
                                    key={y.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveId((prev) => (prev === y.id ? null : y.id))
                                    }
                                    className="w-full text-left focus:outline-none sm:w-[300px]"
                                >
                                    <PersonCard
                                        member={y}
                                        active={activeId === y.id}
                                        expandable={hasChildren}
                                        onPhotoClick={openPhoto}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Seçilen yardımcının bağlı müdürlükleri */}
                    {activeYardimci && (
                        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5">
                            <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-primary">
                                {activeYardimci.name} — Bağlı Müdürlükler
                            </p>
                            {activeChildren.length > 0 ? (
                                <div className="flex flex-wrap justify-center gap-3">
                                    {activeChildren.map((c) => (
                                        <div key={c.id} className="w-full sm:w-[300px]">
                                            <PersonCard member={c} variant="small" onPhotoClick={openPhoto} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-sm text-slate-500">
                                    Bu birime bağlı müdürlük bulunmuyor.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Doğrudan Başkana Bağlı Birimler */}
            {dogrudanBirimler.length > 0 && (
                <div className="mt-12 w-full">
                    <div className="mb-6 flex items-center justify-center gap-4">
                        <div className="h-px w-10 bg-slate-300" />
                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                            Başkana Bağlı Birimler
                        </span>
                        <div className="h-px w-10 bg-slate-300" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {dogrudanBirimler.map((b) => (
                            <div key={b.id} className="w-full sm:w-[300px]">
                                <PersonCard member={b} variant="small" onPhotoClick={openPhoto} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Kurullar */}
            <KurulSection title="Yönetim Kurulu" members={yonetimUyeleri} onPhotoClick={openPhoto} />
            <KurulSection title="Denetim Kurulu" members={denetciler} onPhotoClick={openPhoto} />
            <KurulSection title="Disiplin Kurulu" members={disiplinUyeleri} onPhotoClick={openPhoto} />
            <KurulSection title="Yüksek İstişare (Danışma) Kurulu" members={danismanlar} onPhotoClick={openPhoto} />

            {/* Fotoğraf Önizleme (Lightbox) */}
            {photoMember && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setPhotoMember(null)}
                >
                    <div
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setPhotoMember(null)}
                            aria-label="Kapat"
                            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex max-h-[75vh] w-full items-center justify-center bg-slate-900">
                            {photoMember.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={photoMember.image}
                                    alt={photoMember.name}
                                    className="max-h-[75vh] w-full object-contain"
                                />
                            ) : (
                                <div className="flex aspect-square w-full items-center justify-center bg-slate-50 text-7xl font-serif text-slate-300">
                                    {initials(photoMember.name)}
                                </div>
                            )}
                        </div>
                        <div className="p-5 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                {photoMember.role}
                            </p>
                            <p className="text-xl font-bold text-slate-900">{photoMember.name}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

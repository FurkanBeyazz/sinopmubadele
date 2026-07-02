'use client';

import { useEffect, useState } from 'react';
import {
    Sun, CloudSun, Cloud, CloudFog, CloudDrizzle,
    CloudRain, CloudSnow, CloudLightning, Loader2, LucideIcon,
} from 'lucide-react';

// WMO hava kodu -> Türkçe etiket + ikon
function wmo(code: number): { label: string; Icon: LucideIcon } {
    if (code === 0) return { label: 'Açık', Icon: Sun };
    if (code === 1 || code === 2) return { label: 'Az Bulutlu', Icon: CloudSun };
    if (code === 3) return { label: 'Bulutlu', Icon: Cloud };
    if (code === 45 || code === 48) return { label: 'Sisli', Icon: CloudFog };
    if (code >= 51 && code <= 57) return { label: 'Çisenti', Icon: CloudDrizzle };
    if (code >= 61 && code <= 67) return { label: 'Yağmurlu', Icon: CloudRain };
    if (code >= 71 && code <= 77) return { label: 'Karlı', Icon: CloudSnow };
    if (code >= 80 && code <= 82) return { label: 'Sağanak', Icon: CloudRain };
    if (code === 85 || code === 86) return { label: 'Kar Sağanağı', Icon: CloudSnow };
    if (code >= 95) return { label: 'Gök Gürültülü', Icon: CloudLightning };
    return { label: 'Bulutlu', Icon: Cloud };
}

interface WeatherData {
    temp: number;
    code: number;
    daily: { date: string; code: number; max: number }[];
}

export default function SinopWeather() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [error, setError] = useState(false);
    const [now, setNow] = useState<Date | null>(null);

    // Canlı saat (hidrasyon uyumsuzluğunu önlemek için mount sonrası)
    useEffect(() => {
        setNow(new Date());
        const t = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const url =
            'https://api.open-meteo.com/v1/forecast?latitude=42.0264&longitude=35.1551' +
            '&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max' +
            '&timezone=Europe/Istanbul&forecast_days=4';
        fetch(url)
            .then((r) => r.json())
            .then((j) => {
                if (!j?.current || !j?.daily) throw new Error('veri yok');
                setData({
                    temp: Math.round(j.current.temperature_2m),
                    code: j.current.weather_code,
                    daily: j.daily.time.map((date: string, i: number) => ({
                        date,
                        code: j.daily.weather_code[i],
                        max: Math.round(j.daily.temperature_2m_max[i]),
                    })),
                });
            })
            .catch(() => setError(true));
    }, []);

    if (error) return null; // veri gelmezse tasarımı bozmadan gizle

    const loading = !data;
    const current = data ? wmo(data.code) : null;
    const CurrentIcon = current?.Icon ?? Cloud;
    const nextDays = data?.daily.slice(1, 4) ?? [];

    return (
        <div className="w-full max-w-[300px] overflow-hidden rounded-[25px] shadow-[2px_3px_8px_rgba(0,0,0,0.18)]">
            {/* Üst: mevcut hava */}
            <div className="relative flex h-[128px] items-stretch justify-between overflow-hidden bg-gradient-to-br from-red-900 to-red-800 text-white">
                {/* Dekoratif altın daireler (logo paleti) */}
                <div className="pointer-events-none absolute -right-24 -top-40 h-[300px] w-[300px] rounded-full bg-amber-400/30" />
                <div className="pointer-events-none absolute -right-14 -top-32 h-[210px] w-[210px] rounded-full bg-amber-400/30" />
                <div className="pointer-events-none absolute -right-2 -top-12 h-[90px] w-[90px] rounded-full bg-amber-400/90" />

                {loading ? (
                    <div className="z-10 flex w-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-white/80" />
                    </div>
                ) : (
                    <>
                        {/* Sol: ikon + sıcaklık */}
                        <div className="z-10 flex flex-col justify-center gap-1 pl-5">
                            <div className="flex items-center gap-2">
                                <CurrentIcon className="h-9 w-9" strokeWidth={1.75} />
                                <span className="text-4xl font-semibold leading-none">{data!.temp}°</span>
                            </div>
                            <span className="text-xs font-medium text-white/85">{current!.label}</span>
                        </div>
                        {/* Sağ: konum + saat + tarih */}
                        <div className="z-10 flex flex-col items-end justify-center gap-1 pr-5 text-right">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Sinop</span>
                            <span className="text-xl font-semibold leading-none">
                                {now ? now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </span>
                            <span className="text-[11px] text-white/80">
                                {now ? now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) : ''}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Alt: 3 günlük tahmin */}
            <div className="flex h-[52px] items-stretch gap-[2px] bg-[#5f1518]">
                {(loading ? [0, 1, 2] : nextDays).map((d: any, i: number) => {
                    const day = loading ? null : wmo(d.code);
                    const DIcon = day?.Icon ?? Cloud;
                    return (
                        <div
                            key={i}
                            className="flex flex-1 items-center justify-center gap-1.5 bg-[#7a1c22] text-white/90 transition-transform duration-150 hover:scale-95 hover:rounded-lg"
                        >
                            {loading ? (
                                <span className="text-xs text-white/50">—</span>
                            ) : (
                                <>
                                    <span className="text-[10px] font-medium uppercase text-white/70">
                                        {new Date(d.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
                                    </span>
                                    <DIcon className="h-4 w-4" strokeWidth={1.75} />
                                    <span className="text-xs font-semibold">{d.max}°</span>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

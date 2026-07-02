import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function slugify(text: string) {
    // T\u00FCrk\u00E7e karakterleri ASCII kar\u015F\u0131l\u0131klar\u0131na \u00E7evir (URL'de kodlama sorunu \u00E7\u0131kmas\u0131n)
    const trMap: Record<string, string> = {
        \u00E7: 'c', \u00C7: 'c', \u011F: 'g', \u011E: 'g', \u0131: 'i', \u0130: 'i',
        \u00F6: 'o', \u00D6: 'o', \u015F: 's', \u015E: 's', \u00FC: 'u', \u00DC: 'u',
    };
    return text
        .toString()
        .replace(/[\u00E7\u00C7\u011F\u011E\u0131\u0130\u00F6\u00D6\u015F\u015E\u00FC\u00DC]/g, (ch) => trMap[ch])
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

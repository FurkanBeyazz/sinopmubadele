'use client';

import { usePathname } from 'next/navigation';

/**
 * Admin panelinde sitenin genel menüsü/footer'ı görünmesin diye sarmalayıcı.
 * /admin altındaki tüm rotalarda children render edilmez.
 */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;
    return <>{children}</>;
}

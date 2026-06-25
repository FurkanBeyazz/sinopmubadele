import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;

    // Static routes
    const routes = [
        '',
        '/tarihce',
        '/yonetim',
        '/ataturk-kosesi',
        '/etkinlikler',
        '/galeri',
        '/haberler',
        '/ani-kosesi',
        '/kultur-evi',
        '/iletisim',
        '/bagis',
        '/sss',
        '/tuzuk',
        '/gizlilik',
        '/kullanim-sartlari',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic pages
    const pages = await prisma.page.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    });

    const pageRoutes = pages.map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Dynamic news
    const posts = await prisma.announcement.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
    });

    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/haberler/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    // Dynamic galleries (albümler)
    const galleries = await prisma.gallery.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    });

    const galleryRoutes = galleries.map((g) => ({
        url: `${baseUrl}/galeri/${g.slug}`,
        lastModified: g.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [...routes, ...pageRoutes, ...postRoutes, ...galleryRoutes];
}

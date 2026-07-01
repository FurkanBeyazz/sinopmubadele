/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    // Clickjacking koruması: site iframe'e gömülemez
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    // MIME sniffing koruması
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    // Referrer sızıntısını sınırla
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    // Gereksiz tarayıcı API'lerini kapat
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
            },
            {
                protocol: 'https',
                hostname: '**.ufs.sh',
            },
        ],
    },
};

export default nextConfig;

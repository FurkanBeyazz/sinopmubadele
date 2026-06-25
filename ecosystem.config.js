// PM2 yapılandırması — sunucuda uygulamayı ayakta tutar.
// Kullanım:
//   npm run build
//   pm2 start ecosystem.config.js
//   pm2 save && pm2 startup
module.exports = {
    apps: [
        {
            name: "sinop-site",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3000",
            cwd: __dirname,
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "512M",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],
};

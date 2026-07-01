#!/usr/bin/env bash
# ============================================================
#  Sinop Mübadele Derneği — VPS ilk kurulum scripti
#  Ubuntu/Debian tabanlı Hostinger VPS için.
#  Root (veya sudo) ile çalıştır:
#     bash deploy/setup.sh
# ============================================================
set -euo pipefail

APP_DIR="/var/www/sinopmubadele"
REPO="https://github.com/FurkanBeyazz/sinopmubadele.git"
NODE_MAJOR=20

echo "==> Sistem güncelleniyor..."
apt-get update -y

echo "==> Node.js ${NODE_MAJOR}.x kuruluyor..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
node -v

echo "==> Gerekli araçlar (git, nginx, pm2)..."
apt-get install -y git nginx
npm install -g pm2

echo "==> Proje çekiliyor: ${APP_DIR}"
if [ -d "${APP_DIR}/.git" ]; then
  git -C "${APP_DIR}" pull
else
  git clone "${REPO}" "${APP_DIR}"
fi
cd "${APP_DIR}"

if [ ! -f .env ]; then
  echo "!! .env bulunamadı. Önce .env dosyasını oluştur (bkz. DEPLOYMENT.md), sonra tekrar çalıştır."
  exit 1
fi

echo "==> Bağımlılıklar..."
npm ci

echo "==> Prisma (client + migrate + seed)..."
npx prisma generate
npx prisma migrate deploy
npx tsx prisma/seed.ts || true

echo "==> Production build..."
npm run build

echo "==> PM2 ile başlatılıyor..."
pm2 start ecosystem.config.js || pm2 restart sinop-site
pm2 save
pm2 startup systemd -u "$(whoami)" --hp "$HOME" | tail -1 || true

echo "==> Nginx yapılandırması..."
cp deploy/nginx.conf /etc/nginx/sites-available/sinopmubadele
ln -sf /etc/nginx/sites-available/sinopmubadele /etc/nginx/sites-enabled/sinopmubadele
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "============================================================"
echo " Kurulum tamam! Site http://sinopmubadele.com adresinde."
echo " HTTPS için:"
echo "   apt-get install -y certbot python3-certbot-nginx"
echo "   certbot --nginx -d sinopmubadele.com -d www.sinopmubadele.com"
echo "============================================================"

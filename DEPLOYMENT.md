# 🚀 Yayına Alma Rehberi — sinopmubadele.com (Hostinger VPS)

Bu proje **Node.js sunucusu** gerektirir (Next.js + Prisma/SQLite + NextAuth).
Aşağıdaki adımları **VPS'te SSH ile** uygularsın.

---

## 0) DNS — domaini VPS'e yönlendir (Hostinger paneli)

Hostinger → **Domainler → sinopmubadele.com → DNS / Nameserver → DNS Kayıtları**:

| Tür | Ad (Name) | Değer (Points to) | TTL |
|-----|-----------|-------------------|-----|
| A   | `@`       | **VPS IP adresin** | 3600 |
| A   | `www`     | **VPS IP adresin** | 3600 |

> VPS IP'sini Hostinger → VPS panelinden görebilirsin. DNS'in yayılması 5 dk – birkaç saat sürebilir.

---

## 1) VPS'e bağlan

```bash
ssh root@VPS_IP_ADRESIN
```

## 2) Projeyi çek ve `.env` oluştur

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/FurkanBeyazz/sinopmubadele.git sinopmubadele
cd sinopmubadele
nano .env
```

`.env` içeriği (aşağıyı yapıştır, UploadThing anahtarlarını kendi panelinden/yerel `.env`'inden al):

```env
NEXTAUTH_SECRET=6qG3M5jJgwnlRTLwUbfeYGAEgdinyUa3M6lertjVobM=
NEXTAUTH_URL=https://sinopmubadele.com
NEXT_PUBLIC_SITE_URL=https://sinopmubadele.com

UPLOADTHING_SECRET=...(yerel .env'inden kopyala)
UPLOADTHING_APP_ID=...(yerel .env'inden kopyala)
UPLOADTHING_TOKEN=...(yerel .env'inden kopyala)

NEXT_PUBLIC_GA_ID=
```

> Kaydet: `Ctrl+O`, `Enter`, çık: `Ctrl+X`.

## 3) Tek komutla kurulum

```bash
bash deploy/setup.sh
```

Bu script: Node 20 + Nginx + PM2 kurar, `npm ci`, `prisma migrate deploy`, seed, `npm run build` yapar, PM2 ile başlatır ve Nginx'i yapılandırır.

## 4) HTTPS (ücretsiz SSL — Let's Encrypt)

DNS yayıldıktan **sonra**:

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d sinopmubadele.com -d www.sinopmubadele.com
```

Certbot HTTP→HTTPS yönlendirmesini otomatik ekler. → Site artık `https://sinopmubadele.com`.

---

## 5) İlk giriş & güvenlik

- Admin paneli: `https://sinopmubadele.com/admin` (veya `/giris`)
- Varsayılan giriş: **admin@sinopmubadele.org / admin123**
- ⚠️ **İlk işin şifreyi değiştirmek olsun.**

---

## Sık kullanılan komutlar

```bash
pm2 status                 # uygulama durumu
pm2 logs sinop-site        # canlı loglar
pm2 restart sinop-site     # yeniden başlat
```

## Güncelleme yayınlama (kod değişince)

```bash
cd /var/www/sinopmubadele
git pull
npm ci
npx prisma migrate deploy
npm run build
pm2 restart sinop-site
```

---

## Notlar
- **Veritabanı:** SQLite (`prisma/dev.db`) sunucuda tutulur, git'e girmez. Yedek için bu dosyayı düzenli kopyala.
- **Yüklenen görseller:** UploadThing (bulut) üzerinden gider, sunucu diskini şişirmez.
- **Firewall:** Hostinger VPS'te 80 ve 443 portlarının açık olduğundan emin ol (`ufw allow 'Nginx Full'`).

// Sitenin genel adresi. Yayına alırken .env içine
// NEXT_PUBLIC_SITE_URL=https://alanadiniz.org ekleyin.
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://sinopmubadele.org";

export const SITE_NAME = "Sinop Mübadele ve Balkan Halkları Derneği";

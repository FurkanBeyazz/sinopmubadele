import { ImageResponse } from "next/og";

// Sosyal medyada (WhatsApp, Facebook, X) paylaşımda görünen markalı kapak görseli.
// Next.js bunu otomatik olarak tüm sayfaların OG/Twitter görseli yapar.
export const runtime = "edge";
export const alt = "Sinop Mübadele ve Balkan Halkları Derneği";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "80px",
                    background: "linear-gradient(135deg, #1E3A5F 0%, #6b1e2d 100%)",
                    color: "#fff",
                    fontFamily: "serif",
                }}
            >
                <div
                    style={{
                        fontSize: 26,
                        letterSpacing: 8,
                        textTransform: "uppercase",
                        color: "#e0c690",
                        marginBottom: 28,
                    }}
                >
                    Sinop Mübadele Derneği
                </div>
                <div style={{ display: "flex", flexDirection: "column", fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
                    <span>Geçmişin İzleri,</span>
                    <span>Geleceğin Sesi</span>
                </div>
                <div
                    style={{
                        marginTop: 36,
                        fontSize: 26,
                        color: "rgba(255,255,255,0.85)",
                        fontFamily: "sans-serif",
                    }}
                >
                    Balkan Halkları Kültür Araştırmaları ve Dayanışma
                </div>
            </div>
        ),
        { ...size }
    );
}

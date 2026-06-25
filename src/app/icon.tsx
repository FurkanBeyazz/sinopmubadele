import { ImageResponse } from "next/og";

// Tarayıcı sekmesi simgesi (favicon) — "SM" monogramı, site bordo paletinde.
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#6b1e2d",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 700,
                    borderRadius: 6,
                    fontFamily: "serif",
                }}
            >
                SM
            </div>
        ),
        { ...size }
    );
}

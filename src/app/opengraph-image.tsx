import { ImageResponse } from "next/og"

export const alt = "Dany EntreLaços — Tiaras e Laços Artesanais Sob Encomenda"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

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
          backgroundColor: "#faf7f2",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            backgroundColor: "#e8d5c4",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            backgroundColor: "#c48880",
            opacity: 0.18,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            color: "#985b58",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Dany EntreLaços
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#2d1f1e",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Tiaras e laços artesanais feitos sob encomenda
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "#6f6360",
            textAlign: "center",
          }}
        >
          Casamentos · Formaturas · Ocasiões especiais · Biguaçu, SC
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

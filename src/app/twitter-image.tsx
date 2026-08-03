import { ImageResponse } from "next/og"

export const alt = "Dany EntreLaços — Tiaras e Laços Artesanais Sob Encomenda"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function TwitterImage() {
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
          backgroundColor: "#985b58",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            opacity: 0.08,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -120,
            width: 540,
            height: 540,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            opacity: 0.08,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            color: "#ffffff",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Dany EntreLaços
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Tiaras e laços artesanais — prontas ou sob encomenda
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            color: "#ffffff",
            opacity: 0.8,
            textAlign: "center",
          }}
        >
          Casamentos · Formaturas · Ocasiões especiais
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

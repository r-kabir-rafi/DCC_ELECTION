import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%)",
          fontSize: 76,
          fontWeight: 800,
          color: "#1e3a8a",
          letterSpacing: -2,
        }}
      >
        DA
      </div>
    ),
    size,
  );
}

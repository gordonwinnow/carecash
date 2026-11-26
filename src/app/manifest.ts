import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareCash 家用金",
    short_name: "CareCash",
    start_url: "/home",
    display: "standalone",
    background_color: "#f5f4f0",
    theme_color: "#15803d",
    icons: [
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

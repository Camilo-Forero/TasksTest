import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Crucial: exposes Vite to your local network/PC
    port: 5173, // Keeps it consistent with your Docker mapping
  },
});

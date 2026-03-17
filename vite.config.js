import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/apex_frontend/", // Add this line - must match your repo name exactly
});

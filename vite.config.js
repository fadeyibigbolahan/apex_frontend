import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/apex_frontend/", // Ensure correct base path
  plugins: [react()],
});

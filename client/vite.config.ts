import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  // Read your .env variable (Vite automatically loads .env and .env.[mode])
  const apiUrl = process.env.VITE_API_URL || "http://localhost:3001";

  return {
    server: {
      host: "localhost", // ✅ safer for Windows; avoids EACCES error
      port: 5173,        // ✅ default Vite port; change if needed

      // ✅ Proxy only during local development to avoid CORS
      proxy: isDevelopment
        ? {
            "/api": {
              target: "http://localhost:3001", // local backend
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },

    plugins: [
      react(),
      isDevelopment && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Define a global constant you can use in code
    define: {
      __API_URL__: JSON.stringify(apiUrl),
    },
  };
});

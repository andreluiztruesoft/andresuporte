import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const DEFAULT_DROPBOX_URL = "https://www.dropbox.com/scl/fo/8a4q1l47w88ytfyxpn8em/ANtT3RuihAOgeAyWS_DU-j8?rlkey=kt7dugthnbm5i0yxq0nc00qoj&st=eozgl2gu&e=1&dl=0";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to fetch and parse Dropbox public folder metadata
  app.get("/api/dropbox/info", async (req, res) => {
    const targetUrl = (req.query.url as string) || DEFAULT_DROPBOX_URL;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        return res.json({
          success: false,
          message: `Dropbox retornou status ${response.status}`,
          url: targetUrl,
          directDownloadUrl: targetUrl.replace(/dl=0/, "dl=1"),
        });
      }

      const html = await response.text();

      // Extract page title
      let folderTitle = "Pasta de Suporte - Dropbox";
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        folderTitle = titleMatch[1].replace("- Dropbox", "").trim();
      }

      // Extract OG Description
      let description = "Arquivos e pastas de suporte técnico no Dropbox.";
      const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                           html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
      if (ogDescMatch && ogDescMatch[1]) {
        description = ogDescMatch[1];
      }

      // Try to discover entries or names in JSON blocks within HTML
      const items: Array<{ name: string; isFolder: boolean; type?: string }> = [];
      const seenNames = new Set<string>();

      // Look for filename / display_name patterns in embedded script states
      const filenameRegex = /"(?:filename|display_name|name)"\s*:\s*"([^"]+)"/g;
      let match;
      while ((match = filenameRegex.exec(html)) !== null) {
        const name = match[1];
        // Filter out non-file strings, icons, dropbox internal strings
        if (
          name.length > 2 &&
          !name.includes("Dropbox") &&
          !name.includes("http") &&
          !name.includes(".png") &&
          !name.includes(".svg") &&
          !name.includes("javascript") &&
          !seenNames.has(name)
        ) {
          seenNames.add(name);
          const isFolder = !name.includes(".");
          items.push({ name, isFolder, type: isFolder ? "folder" : name.split(".").pop() });
        }
      }

      // Build zip download URL
      const zipDownloadUrl = targetUrl.includes("dl=0")
        ? targetUrl.replace("dl=0", "dl=1")
        : targetUrl + (targetUrl.includes("?") ? "&dl=1" : "?dl=1");

      return res.json({
        success: true,
        url: targetUrl,
        zipDownloadUrl,
        folderTitle,
        description,
        detectedItems: items.slice(0, 30),
        hasDetectedItems: items.length > 0,
      });
    } catch (err: any) {
      console.error("Erro ao buscar dados do Dropbox:", err);
      const zipDownloadUrl = targetUrl.replace(/dl=0/, "dl=1");
      return res.json({
        success: false,
        error: err?.message || "Erro de conexão",
        url: targetUrl,
        zipDownloadUrl,
        folderTitle: "Pasta de Suporte Compartilhada",
      });
    }
  });

  // API endpoint for Vimeo channel videos info
  app.get("/api/vimeo/info", async (req, res) => {
    const vimeoUrl = "https://vimeo.com/powergestor";
    try {
      const response = await fetch(vimeoUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      if (!response.ok) {
        return res.json({ success: false, url: vimeoUrl, videos: [] });
      }
      const html = await response.text();

      // Look for video links in vimeo page (e.g. /123456789 or clip links)
      const videoRegex = /href="(\/(?:channels\/[^\/]+\/)?(\d{6,11}))"/g;
      const foundIds = new Set<string>();
      let match;
      while ((match = videoRegex.exec(html)) !== null) {
        const id = match[2];
        if (id && !foundIds.has(id)) {
          foundIds.add(id);
        }
      }

      return res.json({
        success: true,
        channelUrl: vimeoUrl,
        detectedIds: Array.from(foundIds),
      });
    } catch (err) {
      return res.json({ success: false, channelUrl: vimeoUrl, error: String(err) });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();

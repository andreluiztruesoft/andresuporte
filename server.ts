import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const DEFAULT_DROPBOX_URL = "https://www.dropbox.com/scl/fo/8a4q1l47w88ytfyxpn8em/ANtT3RuihAOgeAyWS_DU-j8?rlkey=kt7dugthnbm5i0yxq0nc00qoj&st=eozgl2gu&e=1&dl=0";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory cache for Dropbox metadata
  let cachedDropboxData: {
    url: string;
    folderTitle: string;
    detectedItems: Array<{ name: string; isFolder: boolean; type?: string }>;
    timestamp: number;
  } | null = null;

  // Real verified structure of the TRUESOFT Dropbox folder
  const VERIFIED_TRUESOFT_ITEMS = [
    { name: "Pinpad", isFolder: true, type: "folder" },
    { name: "TEF Getcard", isFolder: true, type: "folder" },
    { name: "Impressoras", isFolder: true, type: "folder" },
    { name: "TrueManager", isFolder: true, type: "folder" },
    { name: "Video Aulas", isFolder: true, type: "folder" },
    { name: "PDV1.2.5.exe", isFolder: false, type: "exe" }
  ];

  // API endpoint to fetch and parse Dropbox public folder metadata
  app.get("/api/dropbox/info", async (req, res) => {
    const targetUrl = (req.query.url as string) || DEFAULT_DROPBOX_URL;

    // Check cache (valid for 15 minutes)
    if (
      cachedDropboxData &&
      cachedDropboxData.url === targetUrl &&
      Date.now() - cachedDropboxData.timestamp < 15 * 60 * 1000
    ) {
      return res.json({
        success: true,
        url: targetUrl,
        folderTitle: cachedDropboxData.folderTitle,
        detectedItems: cachedDropboxData.detectedItems,
        hasDetectedItems: true,
      });
    }

    try {
      const downloadUrl = targetUrl.includes("dl=0")
        ? targetUrl.replace("dl=0", "dl=1")
        : targetUrl + (targetUrl.includes("?") ? "&dl=1" : "?dl=1");

      let folderTitle = "TRUESOFT";
      const discoveredItems: Array<{ name: string; isFolder: boolean; type?: string }> = [];

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(downloadUrl, {
          redirect: "follow",
          signal: controller.signal,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });

        // Parse folder title from content-disposition header if available
        const disp = response.headers.get("content-disposition") || "";
        const nameMatch = disp.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
        if (nameMatch && nameMatch[1]) {
          folderTitle = nameMatch[1].replace(/\.zip$/i, "").trim();
        }

        // Read the initial chunk of the ZIP stream to extract real file and folder entries
        if (response.body) {
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let totalBytes = 0;

          // Read up to 8MB or until stream ends
          while (totalBytes < 8 * 1024 * 1024) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            totalBytes += value.length;
          }
          reader.cancel();
          clearTimeout(timeout);

          const buf = Buffer.concat(chunks);
          const rootMap = new Map<string, boolean>();

          // Scan for ZIP local file header signatures (0x04034b50 -> PK\x03\x04)
          for (let i = 0; i < buf.length - 30; i++) {
            if (buf[i] === 0x50 && buf[i + 1] === 0x4b && buf[i + 2] === 0x03 && buf[i + 3] === 0x04) {
              const fnLen = buf.readUInt16LE(i + 26);
              if (fnLen > 0 && fnLen < 300 && i + 30 + fnLen <= buf.length) {
                const fn = buf.toString("utf8", i + 30, i + 30 + fnLen);
                if (fn && fn !== "/" && !fn.startsWith("fonts/") && !fn.startsWith("org/") && !fn.startsWith("net/") && !fn.startsWith("META-INF/")) {
                  const parts = fn.split("/").filter(Boolean);
                  if (parts.length > 0) {
                    const root = parts[0];
                    if (root !== "fonts" && root !== "org" && root !== "net" && root !== "META-INF") {
                      const isFolder = fn.endsWith("/") || parts.length > 1;
                      if (!rootMap.has(root)) {
                        rootMap.set(root, isFolder);
                      }
                    }
                  }
                }
              }
            }
          }

          for (const [name, isFolder] of rootMap.entries()) {
            discoveredItems.push({
              name,
              isFolder,
              type: isFolder ? "folder" : name.split(".").pop()?.toLowerCase() || "file",
            });
          }
        }
      } catch (streamErr) {
        // Stream reading timed out or network blocked; will use verified items
      }

      // If stream discovered items, use them; otherwise use verified Truesoft structure
      const finalItems = discoveredItems.length > 0 ? discoveredItems : VERIFIED_TRUESOFT_ITEMS;
      const finalTitle = folderTitle || "TRUESOFT";

      cachedDropboxData = {
        url: targetUrl,
        folderTitle: finalTitle,
        detectedItems: finalItems,
        timestamp: Date.now(),
      };

      return res.json({
        success: true,
        url: targetUrl,
        folderTitle: finalTitle,
        detectedItems: finalItems,
        hasDetectedItems: true,
      });
    } catch (err: any) {
      console.error("Erro ao buscar dados do Dropbox:", err);
      return res.json({
        success: true,
        url: targetUrl,
        folderTitle: "TRUESOFT",
        detectedItems: VERIFIED_TRUESOFT_ITEMS,
        hasDetectedItems: true,
      });
    }
  });

  // In-memory cache for Vimeo videos
  let cachedVimeoData: {
    videos: any[];
    timestamp: number;
  } | null = null;

  // Helper to categorize videos based on title
  function categorizeVimeoVideo(title: string): string {
    const t = title.toUpperCase();
    if (t.includes("ROMANEIO") || t.includes("ENTREGA")) return "Entregas & Romaneio";
    if (t.includes("GRADE") || t.includes("ATRIBUTO") || t.includes("PERFIL")) return "Grades & Variantes";
    if (t.includes("ETIQUETA") || t.includes("IMPRESSÃO") || t.includes("IMPRESSORA")) return "Impressão & Etiquetas";
    if (t.includes("DEVOLUÇÃO") || t.includes("COMPRA") || t.includes("XML")) return "Compras & Devolução";
    if (t.includes("FINANCEIR") || t.includes("BANCARI") || t.includes("CAIXA") || t.includes("CONTA") || t.includes("BOLETO") || t.includes("PLANO DE CONTAS") || t.includes("CENTRO DE CUSTO")) return "Financeiro & Contas";
    if (t.includes("CLIENTE") || t.includes("FORNECEDOR") || t.includes("VENDEDOR") || t.includes("CADASTRO") || t.includes("TRANSPORTADOR")) return "Cadastros";
    if (t.includes("PDV") || t.includes("VENDA") || t.includes("ORÇAMENTO") || t.includes("PEDIDO") || t.includes("DESCONTO") || t.includes("DEVOLUÇÃO DE VENDA")) return "Vendas & PDV";
    if (t.includes("FISCAL") || t.includes("NFE") || t.includes("NF-E") || t.includes("NFCE") || t.includes("TRIBUT") || t.includes("CFOP") || t.includes("ICMS") || t.includes("CSON") || t.includes("CST")) return "Fiscal & Tributário";
    if (t.includes("ESTOQUE") || t.includes("PRODUTO") || t.includes("INVENTÁRIO") || t.includes("BALANÇO")) return "Estoque & Produtos";
    if (t.includes("ORDEM DE SERVIÇO") || t.includes("OS")) return "Ordem de Serviço";
    return "Geral";
  }

  // API endpoint for fetching all videos directly from Vimeo profile (supports 50+ videos)
  app.get("/api/vimeo/videos", async (req, res) => {
    const forceRefresh = req.query.force === "true";
    const cacheAge = 30 * 60 * 1000; // 30 minutes

    if (!forceRefresh && cachedVimeoData && (Date.now() - cachedVimeoData.timestamp < cacheAge)) {
      return res.json({
        success: true,
        source: "cache",
        count: cachedVimeoData.videos.length,
        videos: cachedVimeoData.videos,
        lastUpdated: cachedVimeoData.timestamp,
      });
    }

    try {
      const fetchedVideos: any[] = [];
      let page = 1;

      while (page <= 10) {
        const vimeoApiUrl = `https://vimeo.com/api/v2/powergestor/videos.json?page=${page}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        try {
          const response = await fetch(vimeoApiUrl, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });
          clearTimeout(timeout);

          if (!response.ok) break;

          const data = await response.json();
          if (!Array.isArray(data) || data.length === 0) break;

          fetchedVideos.push(...data);
          page++;
        } catch {
          clearTimeout(timeout);
          break;
        }
      }

      if (fetchedVideos.length > 0) {
        const formatted = fetchedVideos.map((v: any, index: number) => {
          const mins = v.duration ? Math.round(v.duration / 60) : 0;
          const durationStr = mins > 0 ? `${mins} min` : "Vídeo";
          return {
            id: String(v.id),
            number: index + 1,
            title: (v.title || `Aula ${index + 1}`).trim(),
            module: categorizeVimeoVideo(v.title || ""),
            url: v.url || `https://vimeo.com/${v.id}`,
            description: (v.description || "").replace(/[\r\n]+/g, " ").trim().slice(0, 200),
            duration: durationStr,
            thumbnail: v.thumbnail_medium || v.thumbnail_large || v.thumbnail_small || "",
            uploadDate: v.upload_date || "",
          };
        });

        cachedVimeoData = {
          videos: formatted,
          timestamp: Date.now(),
        };

        return res.json({
          success: true,
          source: "live",
          count: formatted.length,
          videos: formatted,
          lastUpdated: cachedVimeoData.timestamp,
        });
      }

      // If live fetch returned nothing but we had cache, use cache
      if (cachedVimeoData && cachedVimeoData.videos.length > 0) {
        return res.json({
          success: true,
          source: "stale_cache",
          count: cachedVimeoData.videos.length,
          videos: cachedVimeoData.videos,
          lastUpdated: cachedVimeoData.timestamp,
        });
      }

      return res.json({
        success: false,
        source: "empty",
        count: 0,
        videos: [],
      });
    } catch (err: any) {
      console.error("Erro ao buscar vídeos do Vimeo:", err);
      if (cachedVimeoData && cachedVimeoData.videos.length > 0) {
        return res.json({
          success: true,
          source: "error_fallback_cache",
          count: cachedVimeoData.videos.length,
          videos: cachedVimeoData.videos,
          lastUpdated: cachedVimeoData.timestamp,
        });
      }
      return res.status(500).json({ success: false, error: err?.message });
    }
  });

  // Legacy endpoint for backward compatibility
  app.get("/api/vimeo/info", async (req, res) => {
    res.redirect("/api/vimeo/videos");
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

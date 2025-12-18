import { existsSync, copyFileSync, writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import http from "http";

let server: http.Server | null = null;
const PORT = 8000;

export default async function setup() {
  // Copy deepgram.js to examples/browser
  const browserBuildPath = resolve(__dirname, "../../dist/browser/index.global.js");
  const deepgramJsPath = resolve(__dirname, "../../examples/browser/deepgram.js");
  
  if (!existsSync(browserBuildPath)) {
    throw new Error("Browser build not found. Run 'make build' first.");
  }
  
  // Copy the browser build
  copyFileSync(browserBuildPath, deepgramJsPath);
  
  // Append global exposure code
  const globalExposure = `
// Expose Deepgram as global for browser compatibility
if (typeof window !== 'undefined') {
  window.Deepgram = Deepgram;
  window.deepgram = Deepgram;
}`;
  
  writeFileSync(deepgramJsPath, readFileSync(deepgramJsPath, "utf-8") + globalExposure);
  
  // Start HTTP server
  const examplesDir = resolve(__dirname, "../../examples/browser");
  const fs = await import("fs");
  const path = await import("path");
  
  await new Promise<void>((resolvePromise, reject) => {
    server = http.createServer((req, res) => {
      // Handle undefined or null URL
      const urlPath = req.url || "/";
      
      // Remove query string and hash
      const cleanPath = urlPath.split("?")[0].split("#")[0];
      
      // Handle root path
      if (cleanPath === "/" || cleanPath === "") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<html><body>Test server running</body></html>");
        return;
      }
      
      // Remove leading slash
      const relativePath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
      let filePath = path.join(examplesDir, relativePath);
      
      // Security: ensure file is within examplesDir
      const resolvedPath = path.resolve(filePath);
      const resolvedDir = path.resolve(examplesDir);
      if (!resolvedPath.startsWith(resolvedDir)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      
      fs.promises.readFile(filePath).then((data: Buffer) => {
        // Set content type
        const ext = path.extname(filePath);
        const contentTypes: Record<string, string> = {
          ".html": "text/html",
          ".js": "application/javascript",
          ".css": "text/css",
          ".wav": "audio/wav",
        };
        res.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
        res.writeHead(200);
        res.end(data);
      }).catch(() => {
        res.writeHead(404);
        res.end("Not Found");
      });
    });
    
    server.listen(PORT, () => {
      console.log(`Test server started on http://localhost:${PORT}`);
      // Wait a moment for server to be ready
      setTimeout(() => resolvePromise(), 500);
    });
    
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} already in use, assuming server is already running`);
        resolvePromise();
      } else {
        reject(err);
      }
    });
  });

  // Return teardown function
  return async () => {
    if (server) {
      return new Promise<void>((resolve) => {
        server!.close(() => {
          console.log("Test server stopped");
          resolve();
        });
      });
    }
  };
}


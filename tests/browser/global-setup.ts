import { existsSync, copyFileSync, writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import http from "http";
import { spawn, ChildProcess } from "child_process";

let server: http.Server | null = null;
let proxyProcess: ChildProcess | null = null;
const PORT = 8000;
const PROXY_PORT = 8001;

// Teardown function that can be called from signal handlers
async function cleanup() {
  console.log("Starting teardown...");
  const promises: Promise<void>[] = [];
  
  if (server) {
    promises.push(
      new Promise<void>((resolve) => {
        server!.close(() => {
          console.log("Test server stopped");
          resolve();
        });
        // Force close after timeout
        setTimeout(() => {
          console.log("Test server force closed");
          resolve();
        }, 2000);
      })
    );
  }
  
  if (proxyProcess && !proxyProcess.killed) {
    promises.push(
      new Promise<void>((resolve) => {
        let resolved = false;
        
        // Set up exit listener before killing
        const exitHandler = () => {
          if (!resolved) {
            resolved = true;
            console.log("Proxy server stopped");
            resolve();
          }
        };
        
        proxyProcess!.on("exit", exitHandler);
        
        // Try graceful shutdown first
        try {
          proxyProcess!.kill("SIGTERM");
        } catch (error) {
          console.log("Error sending SIGTERM, trying SIGKILL");
          try {
            proxyProcess!.kill("SIGKILL");
          } catch (killError) {
            // Process might already be dead
          }
        }
        
        // Force kill after timeout
        setTimeout(() => {
          if (!resolved && proxyProcess && !proxyProcess.killed) {
            try {
              proxyProcess.kill("SIGKILL");
              console.log("Proxy server force killed");
            } catch (error) {
              // Ignore errors - process might already be dead
            }
            if (!resolved) {
              resolved = true;
              resolve();
            }
          } else if (!resolved) {
            resolved = true;
            resolve();
          }
        }, 3000);
      })
    );
  }
  
  // Wait for all shutdowns with a maximum timeout
  await Promise.race([
    Promise.all(promises),
    new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Teardown timeout reached, forcing exit");
        resolve();
      }, 5000);
    }),
  ]);
  
  console.log("Teardown complete");
}

// Set up signal handlers to ensure cleanup on process termination
process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});

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
  
  // Start proxy server
  const proxyScriptPath = resolve(__dirname, "../../scripts/proxy-server.js");
  if (!existsSync(proxyScriptPath)) {
    throw new Error("Proxy server script not found");
  }
  
  // Check if API key is set
  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error("DEEPGRAM_API_KEY environment variable is required for browser tests");
  }
  
  await new Promise<void>((resolvePromise, reject) => {
    proxyProcess = spawn("node", [proxyScriptPath], {
      stdio: "inherit",
      env: { ...process.env },
    });
    
    proxyProcess.on("error", (error) => {
      reject(new Error(`Failed to start proxy server: ${error.message}`));
    });
    
    // Wait a bit for proxy to start
    setTimeout(() => {
      // Check if process is still running
      if (proxyProcess && proxyProcess.killed) {
        reject(new Error("Proxy server process died immediately after starting"));
      } else {
        console.log(`Proxy server started on http://localhost:${PROXY_PORT}`);
        resolvePromise();
      }
    }, 1000);
  });
  
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

  // Return teardown function (Vitest will call this automatically)
  return cleanup;
}


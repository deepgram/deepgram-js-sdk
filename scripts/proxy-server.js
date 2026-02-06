#!/usr/bin/env node

/**
 * Simple HTTP proxy server for Deepgram API
 * Forwards requests from localhost:8001 to api.deepgram.com
 * Uses raw Node.js http/https modules (no dependencies)
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const PROXY_PORT = 8001;
const DEEPGRAM_API_BASE = 'https://api.deepgram.com';

// Get API key from environment variable
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error('Error: DEEPGRAM_API_KEY environment variable is not set');
  console.error('Please set it before running the proxy server:');
  console.error('  export DEEPGRAM_API_KEY=your_api_key_here');
  process.exit(1);
}

// Create HTTP server that proxies to HTTPS Deepgram API
const server = http.createServer((req, res) => {
  // Parse the incoming request URL
  const requestPath = req.url;
  
  // Handle CORS preflight OPTIONS requests - do NOT forward to Deepgram API
  if (req.method === 'OPTIONS') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${requestPath} (CORS preflight - handled locally)`);
    
    // Get the requested headers from the preflight request
    const requestedHeaders = req.headers['access-control-request-headers'] || '*';
    
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': requestedHeaders, // Echo back requested headers or allow all
      'Access-Control-Max-Age': '86400', // 24 hours
    });
    res.end();
    return;
  }
  
  // Build the target URL for non-OPTIONS requests
  // Note: req.url is already decoded by Node.js http server
  // Split path and query string to handle encoding properly
  const [pathPart, queryPart] = requestPath.split('?');
  
  let finalPath = pathPart;
  if (queryPart) {
    // Use URLSearchParams to properly encode query string values
    // This ensures URLs in query params (like callback URLs) are properly encoded
    const queryParams = new URLSearchParams();
    for (const [key, value] of new URLSearchParams(queryPart).entries()) {
      queryParams.append(key, value);
    }
    finalPath = `${pathPart}?${queryParams.toString()}`;
  }
  
  const targetUrl = `${DEEPGRAM_API_BASE}${finalPath}`;
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${requestPath} -> ${targetUrl}`);
  
  // Parse the target URL to extract hostname and port
  const targetUrlObj = new URL(targetUrl);
  
  // Prepare options for the HTTPS request
  const options = {
    hostname: targetUrlObj.hostname,
    port: targetUrlObj.port || 443,
    path: targetUrlObj.pathname + targetUrlObj.search,
    method: req.method,
    headers: { ...req.headers },
  };
  
  // Remove headers that shouldn't be forwarded
  delete options.headers.host;
  delete options.headers.connection;
  
  // Set Authorization header with API key from environment variable
  options.headers['Authorization'] = `Token ${DEEPGRAM_API_KEY}`;
  
  // Make the request to Deepgram API
  const proxyReq = https.request(options, (proxyRes) => {
    // Copy response headers but remove any existing CORS headers to avoid duplicates
    const responseHeaders = { ...proxyRes.headers };
    
    // Remove any existing CORS headers from Deepgram's response
    delete responseHeaders['access-control-allow-origin'];
    delete responseHeaders['access-control-allow-methods'];
    delete responseHeaders['access-control-allow-headers'];
    delete responseHeaders['access-control-allow-credentials'];
    delete responseHeaders['access-control-expose-headers'];
    delete responseHeaders['access-control-max-age'];
    
    // Add our own CORS headers (single values only)
    responseHeaders['Access-Control-Allow-Origin'] = '*';
    responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
    responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Deepgram-Session-Id';
    
    // Set response headers
    res.writeHead(proxyRes.statusCode, responseHeaders);
    
    // Pipe the response
    proxyRes.pipe(res);
  });
  
  // Handle errors
  proxyReq.on('error', (error) => {
    console.error(`Proxy request error: ${error.message}`);
    if (!res.headersSent) {
      res.writeHead(500, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(`Proxy error: ${error.message}`);
    }
  });
  
  // Handle client errors (e.g., connection closed)
  req.on('error', (error) => {
    console.error(`Client request error: ${error.message}`);
    proxyReq.destroy();
  });
  
  // Handle proxy request abort
  proxyReq.on('abort', () => {
    console.log('Proxy request aborted');
  });
  
  // Pipe the request body
  req.pipe(proxyReq);
  
  // Handle response close
  res.on('close', () => {
    proxyReq.destroy();
  });
});

// Start the server
server.listen(PROXY_PORT, () => {
  console.log(`Deepgram proxy server running on http://localhost:${PROXY_PORT}`);
  console.log(`Proxying requests to ${DEEPGRAM_API_BASE}`);
  console.log(`Using API key from DEEPGRAM_API_KEY environment variable`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PROXY_PORT} is already in use. Please stop the process using that port.`);
  } else {
    console.error(`Server error: ${error.message}`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down proxy server...');
  server.close(() => {
    console.log('Proxy server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down proxy server...');
  server.close(() => {
    console.log('Proxy server closed');
    process.exit(0);
  });
});


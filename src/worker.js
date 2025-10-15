// Import at the top level - this is the correct way for Workers
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      // Try to serve the asset using Workers Sites
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          // Configure caching
          cacheControl: {
            browserTTL: 3600, // 1 hour
            edgeTTL: 86400,   // 1 day
            bypassCache: false,
          },
          // SPA fallback configuration
          mapRequestToAsset: (req) => {
            const url = new URL(req.url);
            
            // Handle directory requests by appending index.html
            if (url.pathname.endsWith('/') && url.pathname !== '/') {
              url.pathname += 'index.html';
            } else if (url.pathname === '/') {
              url.pathname = '/index.html';
            }
            
            return new Request(url.toString(), req);
          },
        }
      );

      return response;
    } catch (e) {
      console.error('Worker error:', e.message);
      
      // For 404s or other errors, try to serve index.html for SPA routing
      const url = new URL(request.url);
      const isGet = request.method === 'GET';
      const accept = request.headers.get('Accept') || '';
      const wantsHTML = accept.includes('text/html');

      if (isGet && wantsHTML) {
        try {
          return await getAssetFromKV(
            {
              request: new Request(new URL('/index.html', request.url), request),
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
            }
          );
        } catch (fallbackError) {
          return new Response(`
            <html>
              <head><title>Badger Technologies</title></head>
              <body>
                <h1>Badger Technologies</h1>
                <p>Your Complete IT Department - Without the Full-Time Cost</p>
                <p>Starting at $799/month</p>
                <p><a href="https://www.badgertechnologies.us">Visit our main site</a></p>
              </body>
            </html>
          `, { 
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        }
      }

      return new Response('Not found', { status: 404 });
    }
  }
};
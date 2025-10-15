import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Use the standard mapRequestToAsset function with proper options
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          
          // Proper asset mapping for static sites
          mapRequestToAsset: mapRequestToAsset({
            // Handle directory requests
            cacheControl: {
              browserTTL: null, // Use default caching
              edgeTTL: 2 * 60 * 60 * 24, // 2 days
            },
          }),
          
          // Cache configuration
          cacheControl: {
            browserTTL: 60 * 60, // 1 hour
            edgeTTL: 60 * 60 * 24, // 1 day
            bypassCache: false,
          },
        }
      );
    } catch (e) {
      // If primary asset fetch fails, try some common fallbacks
      
      // For HTML requests to directories, try index.html
      if (url.pathname === '/' || url.pathname.endsWith('/')) {
        try {
          const indexPath = url.pathname === '/' ? '/index.html' : url.pathname + 'index.html';
          const indexRequest = new Request(new URL(indexPath, request.url), request);
          
          return await getAssetFromKV(
            {
              request: indexRequest,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
            }
          );
        } catch (indexError) {
          // Continue to SPA fallback
        }
      }
      
      // SPA fallback - serve index.html for navigation requests
      const accept = request.headers.get('Accept') || '';
      if (request.method === 'GET' && accept.includes('text/html')) {
        try {
          const indexRequest = new Request(new URL('/index.html', request.url), request);
          
          return await getAssetFromKV(
            {
              request: indexRequest,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
            }
          );
        } catch (spaError) {
          // Final fallback
          console.error('All asset serving failed:', spaError.message);
        }
      }
      
      // Return 404 for non-HTML requests or if everything fails
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
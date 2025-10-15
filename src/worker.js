import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Simple asset serving with proper error handling
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          
          // Simple mapping function
          mapRequestToAsset: (req) => {
            const url = new URL(req.url);
            
            // Handle root directory request
            if (url.pathname === '/') {
              url.pathname = '/index.html';
            }
            // Handle directory requests (ending with /)
            else if (url.pathname.endsWith('/')) {
              url.pathname += 'index.html';
            }
            
            return new Request(url.toString(), req);
          },
          
          // Cache configuration
          cacheControl: {
            browserTTL: 3600, // 1 hour
            edgeTTL: 86400,   // 1 day
            bypassCache: false,
          },
        }
      );
    } catch (e) {
      console.error('Asset serving error:', e.message, e.stack);
      
      // For HTML navigation requests, try to serve index.html directly
      const accept = request.headers.get('Accept') || '';
      const wantsHTML = accept.includes('text/html');
      
      if (request.method === 'GET' && wantsHTML) {
        try {
          const indexRequest = new Request(new URL('/index.html', request.url), {
            method: 'GET',
            headers: request.headers,
          });
          
          return await getAssetFromKV(
            {
              request: indexRequest,
              waitUntil: ctx.waitUntil.bind(ctx),
            }
          );
        } catch (fallbackError) {
          console.error('Index fallback failed:', fallbackError.message);
          
          // Return a basic HTML response with your site info
          return new Response(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Badger Technologies - Your Complete IT Department</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
              </head>
              <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1>Badger Technologies</h1>
                <h2>Your Complete IT Department - Without the Full-Time Cost</h2>
                <p><strong>Starting at $799/month</strong></p>
                <p>Professional managed IT services for Illinois businesses.</p>
                <p>Contact us at: <a href="mailto:info@badgertechnologies.us">info@badgertechnologies.us</a></p>
                <hr>
                <p><em>Site is loading assets... Please try refreshing the page.</em></p>
              </body>
            </html>
          `, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
      }
      
      // For non-HTML requests, return 404
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
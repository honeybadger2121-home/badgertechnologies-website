export default {
  async fetch(request, env, ctx) {
    // Check if ASSETS binding exists (Cloudflare Pages environment)
    if (!env || !env.ASSETS) {
      console.error('ASSETS binding not available. Make sure this is deployed to Cloudflare Pages.');
      return new Response('Configuration error: ASSETS binding not available', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    try {
      // Try to serve the exact asset first
      let response = await env.ASSETS.fetch(request);

      if (response.status !== 404) {
        return response;
      }

      const url = new URL(request.url);

      // Directory-style request: try to append index.html
      if (url.pathname.endsWith('/')) {
        const indexUrl = new URL(url);
        indexUrl.pathname += 'index.html';
        const idxResp = await env.ASSETS.fetch(indexUrl.toString(), request);
        if (idxResp.status !== 404) return idxResp;
      }

      // Only do SPA-style fallback for GET navigation requests that accept HTML
      const isGet = request.method === 'GET';
      const accept = request.headers.get('Accept') || '';
      const wantsHTML = accept.includes('text/html');

      if (isGet && wantsHTML) {
        return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
      }

      return response; // 404 for non-HTML/other requests
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(`Worker error: ${error.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
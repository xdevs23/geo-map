import * as http from 'http';
import * as express from 'express';

export interface Page {
  markup: string;
  scripts: string[];
  state: string;
  style: string;
}

export function renderPage(page: Page): string {
  return `<!DOCTYPE html>
    <html lang="en" class="noscript">
      <head>
        <script>
          (function(n,a){
            n[a] = (n[a]||'').split('noscript').join('');
          }(document.documentElement, 'className'));
        </script>


        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <noscript>
          <meta http-equiv="refresh" content="0;url=/assets/generated/static-client-error.html">
        </noscript>
        <script>
          (function checkCookies() {
            if (!navigator.cookieEnabled) {
              document.cookie = "cookietest=1";
              document.cookie.indexOf("cookietest=") == 0 ?
              document.cookie = "cookietest=1; expires=Tue, 19-May-1992 00:00:01 GMT" :
              location = "/assets/generated/static-client-error.html";
            };
          })();
        </script>

        ${page.style}
        <style>
          body, html {
            margin: 0;
          }
          [data-map] {
            flex-grow: 1;
            flex-basis: 50%;
          }
        </style>

        <link rel="icon" href="/assets/img/favicon/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <div id="root" style="display: flex; width: 100vw; height: 100vh"></div>
        <textarea id="APP_STATE" style="display:none">${encodeURIComponent(
          page.state
        )}</textarea>
        ${page.scripts.map((s) => `<script src="${s}"></script>`).join('\n')}
        </body>
    </html>
  `;
}

export function startServer(port: number): http.Server {
  const app = express();
  app.use('/assets', express.static('./dist/assets'));
  app.get('/test', (_, res: express.Response) => {
    res.send(
      renderPage({
        markup: '',
        scripts: ['/assets/TestEntry.js'],
        state: '',
        style: '',
      })
    );
  });
  const httpServer = http.createServer(app);
  httpServer.listen(port);
  return httpServer;
}

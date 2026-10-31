const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = path.resolve(__dirname);

// Permitted MIME types
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Files that must never be served directly over HTTP
const BLOCKED_FILES = new Set([
    'serve.js',
    'package.json',
    'package-lock.json',
    'vercel.json',
    'readme.md',
    '.env',
    '.env.local',
    '.gitignore',
    '.vercelignore'
]);

// Hardened Security Headers applied to every response
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
};

const server = http.createServer((req, res) => {
    // Only allow safe, read-only HTTP methods
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Allow': 'GET, HEAD',
            ...SECURITY_HEADERS
        });
        res.end('405 Method Not Allowed');
        return;
    }

    // Protect against excessively long URLs (Denial of Service mitigation)
    if (!req.url || req.url.length > 2048) {
        res.writeHead(414, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
        });
        res.end('414 URI Too Long');
        return;
    }

    let decodedPath;
    try {
        decodedPath = decodeURIComponent(req.url.split('?')[0]);
    } catch {
        res.writeHead(400, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
        });
        res.end('400 Bad Request');
        return;
    }

    // Prevent null-byte injection attacks
    if (decodedPath.includes('\0')) {
        res.writeHead(400, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
        });
        res.end('400 Bad Request');
        return;
    }

    if (decodedPath === '/' || decodedPath === '') {
        decodedPath = '/index.html';
    } else if (decodedPath === '/admin' || decodedPath === '/admin/') {
        decodedPath = '/admin.html';
    } else if (!path.extname(decodedPath)) {
        decodedPath = decodedPath.replace(/\/+$/, '') + '.html';
    }

    // Normalize path and eliminate traversal sequences
    const normalized = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
    const resolvedPath = path.resolve(ROOT, '.' + path.sep + normalized);

    // Enforce root directory confinement (Path Traversal defense)
    const relative = path.relative(ROOT, resolvedPath);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        res.writeHead(403, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
        });
        res.end('403 Forbidden');
        return;
    }

    // Block hidden files/directories (dotfiles) and sensitive configuration files
    const segments = relative.split(/[\\/]/);
    const hasHiddenSegment = segments.some(segment => segment.startsWith('.'));
    const fileName = segments[segments.length - 1].toLowerCase();

    if (hasHiddenSegment || BLOCKED_FILES.has(fileName)) {
        res.writeHead(403, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
        });
        res.end('403 Forbidden');
        return;
    }

    // Enforce strict file extension whitelist
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext];
    if (!contentType) {
        res.writeHead(403, {
            'Content-Type': 'text/plain; charset=utf-8',
            ...SECURITY_HEADERS
        });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(resolvedPath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, {
                'Content-Type': 'text/plain; charset=utf-8',
                ...SECURITY_HEADERS
            });
            res.end('404 Not Found');
            return;
        }

        const headers = {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            ...SECURITY_HEADERS
        };

        if (req.method === 'HEAD') {
            res.writeHead(200, headers);
            res.end();
            return;
        }

        res.writeHead(200, headers);
        const readStream = fs.createReadStream(resolvedPath);
        readStream.on('error', () => {
            if (!res.headersSent) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    ...SECURITY_HEADERS
                });
                res.end('500 Internal Server Error');
            } else {
                res.destroy();
            }
        });
        readStream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Server running securely at http://localhost:${PORT}/`);
});

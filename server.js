// Custom Next.js server with Socket.IO support
// Usage: node server.js (replaces `next dev` / `next start`)

require('dotenv').config({ path: '.env.local' });

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server: SocketIOServer } = require('socket.io');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// ── DB Pool (CommonJS, used only by Socket.IO) ────────────────────────
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portofolio',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

// ── Next.js app ───────────────────────────────────────────────────────
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Resolve uploads directory (default: public/uploads inside frontend)
  const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Serve uploaded files from /uploads/<filename>
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/uploads/')) {
      const filename = parsedUrl.pathname.replace('/uploads/', '');
      const filePath = path.join(uploadDir, path.basename(filename));
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
          '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
          '.pdf': 'application/pdf',
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
        return;
      }
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    handle(req, res, parsedUrl);
  });

  // ── Socket.IO ─────────────────────────────────────────────────────
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [process.env.NEXTAUTH_URL || 'http://localhost:3000'];

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: dev ? '*' : allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // polling only — WebSocket upgrades not supported behind Passenger/cPanel
    transports: ['polling'],
    allowEIO3: true,
  });

  // Expose io globally so Next.js API routes can emit events if needed
  global.io = io;
  const MAX_HISTORY = 100;

  io.on('connection', async (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Send chat history to newly connected client
    try {
      const [rows] = await db.query(
        'SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT ?',
        [MAX_HISTORY]
      );
      const history = rows.reverse().map((row) => ({
        id: row.client_id,
        text: row.text,
        user: { name: row.user_name, email: row.user_email, image: row.user_image || '' },
        timestamp: row.created_at instanceof Date
          ? row.created_at.toISOString()
          : new Date(row.created_at).toISOString(),
      }));
      socket.emit('chat:history', history);
    } catch (err) {
      console.error('[Socket.IO] Failed to load chat history:', err.message);
      socket.emit('chat:history', []);
    }

    // User joining
    socket.on('chat:join', (user) => {
      if (!user?.name || !user?.email) {
        socket.data.user = null;
        return;
      }

      socket.data.user = {
        name: String(user.name).trim().substring(0, 100),
        email: String(user.email).trim().toLowerCase().substring(0, 255),
        image: String(user.image || '').trim().substring(0, 500),
      };
      console.log(`[Socket.IO] ${socket.data.user.name} joined the chat`);
    });

    socket.on('chat:leave', () => {
      socket.data.user = null;
    });

    // Incoming message
    socket.on('chat:message', async (msg) => {
      if (!msg || !msg.text || !msg.text.trim()) return;

      const user = socket.data.user;
      if (!user?.name || !user?.email) {
        socket.emit('chat:error', { error: 'LOGIN_REQUIRED', message: 'Please sign in with Google to send messages.' });
        return;
      }

      const chatMsg = {
        id: msg.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text: msg.text.trim().substring(0, 500),
        user,
        timestamp: msg.timestamp || new Date().toISOString(),
      };

      // Persist to DB
      try {
        await db.query(
          'INSERT INTO chat_messages (client_id, text, user_name, user_email, user_image, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [
            chatMsg.id,
            chatMsg.text,
            chatMsg.user.name,
            chatMsg.user.email,
            chatMsg.user.image || '',
            new Date(chatMsg.timestamp),
          ]
        );
      } catch (err) {
        console.error('[Socket.IO] Failed to save chat message:', err.message);
      }

      // Broadcast to all clients
      io.emit('chat:message', chatMsg);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  // ── Start server ──────────────────────────────────────────────────
  httpServer.listen(port, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║   Portfolio Fullstack App Running                ║
║   URL: http://${hostname}:${port}                ║
║   Mode: ${dev ? 'development' : 'production'}               ║
║   Socket.IO: enabled                            ║
╚══════════════════════════════════════════════════╝
    `);
  });
});

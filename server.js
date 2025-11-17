import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

import orderRoutes from "./routes/orderroutes.js";
import menuRoutes from './routes/menu.routes.js';
import addonRoutes from './routes/addon.routes.js';
import cartRoutes from './routes/cart.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import webhookRoutes from './routes/webhook.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// For Razorpay webhook signature verification we need raw body.
// So set up two body parsers: one raw for /webhooks/razorpay, and json for others.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/razorpay') {
    express.raw({ type: '*/*' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// app.use(cors());
app.use(morgan('dev'));

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://franzoo-bowl.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/menu', menuRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use("/api", orderRoutes);

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on ${config.baseUrl}`);
  });
});

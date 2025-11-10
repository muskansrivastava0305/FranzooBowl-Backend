import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/food_ordering',
  taxRate: Number(process.env.TAX_RATE || 0.02),
  gstRate: Number(process.env.GST_RATE || 0.05),

  // ⚙️ Old WhatsApp Cloud API (optional, you can ignore)
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'verify_me_token'
  },

  // ✅ New WATI API config
  wati: {
    token: process.env.WATI_TOKEN || '', 
    baseUrl: process.env.WATI_BASE_URL || ''
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
  }
};

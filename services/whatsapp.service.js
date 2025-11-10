import axios from 'axios';
import { config } from '../config/env.js';

const WHATSAPP_BASE = `https://graph.facebook.com/v20.0/${config.whatsapp.phoneNumberId}/messages`;

export async function sendWhatsAppText(to, body) {
  if (!config.whatsapp.token || !config.whatsapp.phoneNumberId) {
    console.warn('⚠️ WhatsApp credentials missing, skipping send.');
    return { skipped: true };
  }
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body }
  };
  const headers = {
    'Authorization': `Bearer ${config.whatsapp.token}`,
    'Content-Type': 'application/json'
  };
  const { data } = await axios.post(WHATSAPP_BASE, payload, { headers });
  return data;
}

export function formatWelcomeMessage(name, total) {
  return `👋 Hi ${name}! Thanks for ordering with us.\nYour current cart total is ₹${total}.\n\nPlease reply with your *Address* in this format:\nFlat/House No, Floor, Landmark, City, Pincode`;
}

export function askPaymentMethod() {
  return `How would you like to pay?\nReply with *Online* or *COD*`;
}

export function orderConfirmedMessage(orderId) {
  return `✅ Order Confirmed!\nOrder ID: ${orderId}\nWe will update you with delivery status shortly.`;
}

export function codPlacedMessage(orderId, total) {
  return `🧾 COD order placed.\nOrder ID: ${orderId}\nAmount: ₹${total}\nStatus: Pending. Our team will contact you soon.`;
}

export function paymentLinkMessage(shortUrl) {
  return `💳 Please complete your payment using this secure link:\n${shortUrl}\nWe will confirm your order once the payment is successful.`;
}

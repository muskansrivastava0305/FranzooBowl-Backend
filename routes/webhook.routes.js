import { Router } from 'express';
import { config } from '../config/env.js';
import Order from '../models/Order.js';
import { sendWhatsAppText, askPaymentMethod, paymentLinkMessage, codPlacedMessage, orderConfirmedMessage } from '../services/whatsapp.service.js';
import { createPaymentLink, verifyRazorpayWebhookSignature } from '../services/payment.service.js';

const router = Router();

// WhatsApp Webhook Verification (GET)
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// WhatsApp Webhook Receiver (POST)
router.post('/whatsapp', async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    if (!messages || !messages.length) return res.sendStatus(200);

    const msg = messages[0];
    const from = msg.from; // phone in string without '+' (e.g., 91XXXXXXXXXX)
    const text = msg.text?.body?.trim()?.toLowerCase();

    // Find the most recent order awaiting information for this user
    const order = await Order.findOne({ 'customer.phone': from })
      .sort({ createdAt: -1 });
    if (!order) {
      await sendWhatsAppText(from, 'We could not find an active order. Please start checkout from the website again.');
      return res.sendStatus(200);
    }

    if (order.status === 'AWAITING_ADDRESS') {
      // Save raw address and ask for payment method
      order.address = { raw: msg.text?.body || '' };
      order.status = 'AWAITING_PAYMENT_METHOD';
      await order.save();

      await sendWhatsAppText(from, 'Thanks! Address received ✅');
      await sendWhatsAppText(from, askPaymentMethod());
      return res.sendStatus(200);
    }

    if (order.status === 'AWAITING_PAYMENT_METHOD') {
      if (text.includes('online')) {
        order.paymentMethod = 'ONLINE';
        await order.save();

        const link = await createPaymentLink({
          amountInRupees: order.grandTotal,
          customer: order.customer
        });
        order.razorpay.paymentLinkId = link.id;
        order.razorpay.paymentLinkShortUrl = link.short_url;
        order.status = 'AWAITING_PAYMENT';
        order.paymentStatus = 'PENDING';
        await order.save();

        await sendWhatsAppText(from, paymentLinkMessage(link.short_url));
        return res.sendStatus(200);
      } else if (text.includes('cod') || text.includes('cash')) {
        order.paymentMethod = 'COD';
        order.status = 'PENDING';
        order.paymentStatus = null;
        await order.save();

        await sendWhatsAppText(from, codPlacedMessage(order._id, order.grandTotal));
        return res.sendStatus(200);
      } else {
        await sendWhatsAppText(from, 'Please reply with *Online* or *COD*.');
        return res.sendStatus(200);
      }
    }

    // For any other messages while awaiting payment, just acknowledge
    if (order.status === 'AWAITING_PAYMENT') {
      await sendWhatsAppText(from, 'Payment link is already shared. Complete the payment to confirm your order.');
      return res.sendStatus(200);
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    return res.sendStatus(200);
  }
});

// Razorpay Webhook
router.post('/razorpay', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = JSON.stringify(req.body);

  if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const event = req.body?.event;
  try {
    if (event === 'payment_link.paid' || event === 'payment.captured') {
      const paymentLinkId = req.body?.payload?.payment_link?.entity?.id
        || req.body?.payload?.payment?.entity?.notes?.payment_link_id;

      if (!paymentLinkId) {
        return res.json({ ok: true, message: 'No payment link id found' });
      }

      const order = await Order.findOne({ 'razorpay.paymentLinkId': paymentLinkId });
      if (!order) return res.json({ ok: true, message: 'Order not found for payment link' });

      order.paymentStatus = 'PAID';
      order.status = 'CONFIRMED';
      await order.save();

      try {
        await sendWhatsAppText(order.customer.phone, orderConfirmedMessage(order._id));
      } catch (e) {
        console.error('WhatsApp send failed:', e?.response?.data || e.message);
      }
      return res.json({ ok: true });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('Razorpay webhook error:', err);
    return res.status(500).json({ message: 'error' });
  }
});

export default router;

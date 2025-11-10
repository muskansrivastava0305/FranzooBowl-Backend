import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env.js';
import { toPaise } from '../utils/calc.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export async function createPaymentLink({ amountInRupees, customer }) {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new Error('Razorpay credentials missing');
  }
  const amountPaise = toPaise(amountInRupees);
  const res = await razorpay.paymentLink.create({
    amount: amountPaise,
    currency: 'INR',
    accept_partial: false,
    description: 'Food Order Payment',
    customer: {
      name: customer.name,
      contact: customer.phone,
      email: customer.email || undefined,
    },
    notify: {
      sms: true,
      email: false
    },
    reminder_enable: true,
    notes: {
      purpose: 'Food Order',
    },
  });
  return res;
}

export function verifyRazorpayWebhookSignature(body, signature) {
  const digest = crypto
    .createHmac('sha256', config.razorpay.webhookSecret)
    .update(body, 'utf8')
    .digest('hex');
  return digest === signature;
}

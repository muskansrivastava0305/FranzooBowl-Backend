import { config } from '../config/env.js';

export function calculateTotals(items = [], addons = []) {
  const itemsTotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const addonsTotal = addons.reduce((sum, a) => sum + (a.price * a.qty), 0);
  const subtotal = round2(itemsTotal + addonsTotal);
  const taxAmount = round2(subtotal * config.taxRate);
  const gstAmount = round2(subtotal * config.gstRate);
  const grandTotal = round2(subtotal + taxAmount + gstAmount);
  return { subtotal, taxAmount, gstAmount, grandTotal };
}

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function toPaise(amountInRupees) {
  return Math.round((amountInRupees + Number.EPSILON) * 100);
}

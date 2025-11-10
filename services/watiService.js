import axios from 'axios';
import { config } from '../config/env.js';

// ✅ Send normal WhatsApp message through WATI
export async function sendWatiMessage(phoneNumber, messageText) {
  try {
    const response = await axios.post(
      `${config.wati.baseUrl}/api/v1/sendSessionMessage/${phoneNumber}`,
      { messageText },
      {
        headers: {
          Authorization: `Bearer ${config.wati.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ WATI Message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ WATI Message Error:', error.response?.data || error.message);
    throw error;
  }
}

import { User } from '../types';

// This is a mock service. In a real application, this would
// make an API call to a backend service that integrates with an SMS provider like Twilio.
export const notificationService = {
  sendSms: (phone: string, message: string): Promise<{ success: true }> => {
    // We use console.log to simulate the SMS being sent.
    // The styling helps distinguish this in the browser console.
    console.log(`%c[SMS Notification] Sending to ${phone}: "${message}"`, 'color: #8B5CF6; font-weight: bold;');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300); // Simulate network latency
    });
  },
};

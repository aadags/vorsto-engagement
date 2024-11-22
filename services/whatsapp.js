import axios from 'axios';

const AUTH_TOKEN = `Bearer ${process.env.NEXT_PUBLIC_WHATSAPP_TOKEN}`;

export const sendTextMessage = async (to, body, phoneId) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        preview_url: false,
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const sendImageMessage = async (to, imageUrl, phoneId) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'image',
        image: { link: imageUrl },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const sendTemplateMessage = async (
  to,
  template,//support_enquiry, support_check_in
  name,
  phoneId
) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: template,
        template: {
          name: 'support_enquiry',
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: name }
              ],
            },
          ],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

import axios from 'axios';

const AUTH_TOKEN = `Bearer ${process.env.WHATSAPP_TOKEN}`;
const SYS_TOKEN = `Bearer ${process.env.WHATSAPP_SYSTEM_USER_TOKEN}`;

export const sendTextMessage = async (to, body, phoneId, token) => {
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const sendImageMessage = async (to, imageUrl, phoneId, token) => {
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const sendEngagementTemplateMessage = async (
  to,
  name,
  phoneId,
  token
) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'template',
        template: {
          name: 'vorsto_support_enquiry',
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
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const sendCheckInTemplateMessage = async (
  to,
  content,
  phoneId,
  token
) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'template',
        template: {
          name: 'vorsto_support_check_in',
          language: { code: 'en' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: content }
              ],
            },
          ],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const createTemplate = async (name, text, params, wabaId, token) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${wabaId}/message_templates`,
      {
          "name": name,
          "category": "UTILITY",
          "allow_category_change": true,
          "language": "en",
          "components": [{
            "type": "BODY",
            "text": text,
            "example": {
              "body_text": [
                params
              ]
            }
          }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

export const createTemplateWithHeader = async (name, text, params, headerText, wabaId, token) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${wabaId}/message_templates`,
      {
          "name": name,
          "category": "UTILITY",
          "allow_category_change": true,
          "language": "en",
          "components": [
            {
              "type": "HEADER",
              "format": "TEXT",
              "text": headerText,
            },
            {
            "type": "BODY",
            "text": text,
            "example": {
              "body_text": [
                params
              ]
            }
          }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error(error);
    return { status: 'error' };
  }
};

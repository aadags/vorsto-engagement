import axios from 'axios';

interface MessageResponse {
  status: string;
  data?: Record<string, unknown>;
}

export const sendDirectMessage = async (ig_user_id: string, token: string, recv_id: string, body: string) => {
  try {

    const url = `https://graph.instagram.com/v21.0/${ig_user_id}/messages`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const data = {
      recipient: { id: recv_id },
      message: { text: body }
    };

    const response = await axios.post(url, data, { headers });
    console.log('Response:', response.data);
  } catch (error) {
    console.log(error);
  }
};

import twilio from 'twilio';

export function call(agentId, callbackUrl) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  return client.calls.create({
    from: process.env.TWILIO_NUMBER,
    to: `client:${agentId}`,
    url: callbackUrl,
  });
}

import twilio from 'twilio';

export function call(agentId, orgNumber, callbackUrl) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  return client.calls.create({
    from: orgNumber,
    to: `client:${agentId}`,
    url: callbackUrl,
  });
}

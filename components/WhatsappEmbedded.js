import { useEffect, useRef, useState } from 'react';

const EmbeddedSignup = () => {
  const sessionInfoResponseRef = useRef(null);
  const sdkResponseRef = useRef(null);
  const [fbReady, setFbReady] = useState(false);

  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1744131679686511',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v21.0'
      });
      setFbReady(true);
    };

    // Load Facebook SDK script
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handler for Facebook Login Callback
  const fbLoginCallback = (response) => {
    if (response.authResponse) {
      const { code } = response.authResponse;
      // Transmit the code to backend for server-to-server access token call
    }
    if (sdkResponseRef.current) {
      sdkResponseRef.current.textContent = JSON.stringify(response, null, 2);
    }
  };

  // Launch WhatsApp Signup
  const launchWhatsAppSignup = () => {
    if (fbReady) {
      window.FB.login(fbLoginCallback, {
        config_id: '1089993002724542',
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: '2'
        }
      });
    }
  };

  useEffect(() => {
    const messageListener = (event) => {
      if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') {
        return;
      }
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id } = data.data;
            console.log('Phone number ID ', phone_number_id, ' WhatsApp business account ID ', waba_id);
          } else if (data.event === 'CANCEL') {
            const { current_step } = data.data;
            console.warn('Cancel at ', current_step);
          } else if (data.event === 'ERROR') {
            const { error_message } = data.data;
            console.error('Error: ', error_message);
          }
        }
        if (sessionInfoResponseRef.current) {
          sessionInfoResponseRef.current.textContent = JSON.stringify(data, null, 2);
        }
      } catch {
        console.log('Non-JSON Responses', event.data);
      }
    };

    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    };
  }, []);

  return (
    <div>
      <div id="fb-root"></div>
      <button
        onClick={launchWhatsAppSignup}
        style={{
          backgroundColor: '#1877f2',
          border: 0,
          borderRadius: '4px',
          color: '#fff',
          cursor: 'pointer',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 'bold',
          height: '40px',
          padding: '0 24px',
        }}
      >
        Login with Facebook
      </button>
      <p>Session info response:</p>
      <pre ref={sessionInfoResponseRef}></pre>
      <br />
      <p>SDK response:</p>
      <pre ref={sdkResponseRef}></pre>
    </div>
  );
};

export default EmbeddedSignup;

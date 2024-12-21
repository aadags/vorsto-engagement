import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const EmbeddedSignup = () => {
  const sessionInfoResponseRef = useRef(null);
  const sdkResponseRef = useRef(null);
  const [fbReady, setFbReady] = useState(false);
  const [wabaReady, setWabaReady] = useState(false);
  const [codeToken, setCodeToken] = useState(false);

  const router = useRouter();

  const createToken = async (code) => {
    try {
      const response = await fetch('/api/link-whatsapp-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if(response.ok)
      {
      
      }

    } catch (error) {
      console.error('Error linking Business Token:', error);
    }
  };

  useEffect(() => {
    // Load Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '782135337385303',
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
  
  useEffect(() => {

    if(wabaReady)
    {
      router.refresh();
    }
    
  }, [wabaReady]);

  useEffect(() => {

    if(codeToken)
    {
      createToken(codeToken);
    }
    
  }, [codeToken]);

  // Handler for Facebook Login Callback
  const fbLoginCallback = (response) => {
    if (response.authResponse) {
      const { code } = response.authResponse;
      setCodeToken(code);
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
        config_id: '585207984190234',
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

  const linkOrg = async (waba_id, wa_phone_id) => {
    try {
      const response = await fetch('/api/link-whatsapp-org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waba_id, wa_phone_id }),
      });

      if(response.ok)
      {
        setWabaReady(true);
      }

    } catch (error) {
      console.error('Error linking Business:', error);
    }
  };

  useEffect(() => {
    const messageListener =  async (event) => {
      if (event.origin !== 'https://www.facebook.com' && event.origin !== 'https://web.facebook.com') {
        return;
      }
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            const { phone_number_id, waba_id } = data.data;
            await linkOrg(waba_id, phone_number_id);
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
      <button onClick={launchWhatsAppSignup} className="techwave_fn_button" ><span>Login with Facebook</span></button>
    </div>
  );
};

export default EmbeddedSignup;

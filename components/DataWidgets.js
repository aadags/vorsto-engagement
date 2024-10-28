'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getUser } from '@/services/userService';
import { useRouter } from 'next/navigation';

export default function DataWidgets() {
  const [user, setUser] = useState();

  const router = useRouter();

  const textAreaRef = useRef(null);

  const handleCopy = () => {
    if (textAreaRef.current) {
      navigator.clipboard.writeText(textAreaRef.current.value)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="techwave_fn_contact_page">
      {/* Page Title */}
      <div className="techwave_fn_pagetitle">
        <h2 className="title">Data Widgets</h2>
      </div>

      {user && <div className="contactpage">
        <div className="container small">
            <div className="fn_contact_form">
              <div className="input_list">
                <h4 className="title">Dashboard Insights Widget</h4>
                <textarea readOnly style={{ height: "40vh" }} ref={textAreaRef}>
                {`
<!---    copy this in your head element --->
<script src="https://www.vorsto.io/embed/widgets.js"></script>

<!---    copy this in your body element --->
<script>
  
  const config = {
    scope: "insights",
    axis: ${Number(72342823437349) + Number(user.id)}
  }
  initVorstoWidget(config);

</script>`}
                </textarea>
                <br/>
                <button
                  className="techwave_fn_button"
                  type="button"
                  onClick={handleCopy}
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          <br/><br/>
        </div>
      </div>}
    </div>
  );
}

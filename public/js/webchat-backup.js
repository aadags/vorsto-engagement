(function (window, document) {
    function importFonts() {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  
    function getConfigFromScript() {
      var scriptTag = document.getElementById("vorsto-webchat");
      const urlParams = new URLSearchParams(new URL(scriptTag.src).search);

      return {
        agentId: urlParams.get("id"),
        toggleColor: urlParams.get("toggleColor") || "#007ACC",
        headerBgColor: urlParams.get("headerBgColor") || "#000000",
        headerTextColor: urlParams.get("headerTextColor") || "#333333",
        btnBgColor: urlParams.get("btnBgColor") || "#2d2d2d"
      };
    }


    function createFloatingMessage() {
        setTimeout(() => {
            const message = document.createElement("div");
            message.className = "floating-message";
            message.innerText = "We are online! We can help";
            document.body.appendChild(message);
    
            setTimeout(() => {
                message.style.opacity = "0"; // Fade out effect
                setTimeout(() => document.body.removeChild(message), 500); // Remove after fade out
            }, 10000); // Display for 3 seconds
        }, 3000); // Initial delay of 1 second before showing the message
    }
  
    function createChatbot({ agentId, toggleColor, headerBgColor, headerTextColor, btnBgColor }) {
      const chatBotToggleBtn = document.createElement("button");
      chatBotToggleBtn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
        background: ${toggleColor}; border: none; color: white;
        padding: 10px 10px; border-radius: 50px; cursor: pointer;
        font-size: 16px; width: 50px;
      `;

        // SVG icon as innerHTML for the button, with color set to white
        chatBotToggleBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
            <g>
            <path d="M271,512c-10.3,0-20.7,0-31,0c-6.1-0.8-12.2-1.4-18.3-2.3c-31.6-4.5-61.5-14.2-89.5-29.6c-2.1-1.2-5.4-1.4-7.8-0.7
                c-12.3,3.6-24.4,7.7-36.6,11.6C66.6,498.1,45.3,505,24,512c-2.7,0-5.3,0-8,0c-8-2.7-13.3-8-16-16c0-2.7,0-5.3,0-8
                c0.2-0.2,0.6-0.4,0.7-0.7c10.5-32.9,21-65.9,31.7-98.8c1.2-3.6,1-6.4-0.8-9.8c-14-25.3-23.4-52.1-27.9-80.7
                C2.3,289.4,1.2,280.7,0,272c0-10.3,0-20.7,0-31c0.3-1.4,0.7-2.9,0.8-4.3C3.3,201,12.8,167.1,30,135.8C69.8,63.7,130.3,19.6,211.4,4
                c9.8-1.9,19.7-2.7,29.6-4c10,0,20,0,30,0c1.3,0.3,2.6,0.7,3.9,0.8c35.9,2.4,69.9,11.9,101.3,29.2C448.3,69.9,492.5,130.4,508,211.4
                c1.9,9.8,2.7,19.7,4,29.6c0,10,0,20,0,30c-0.3,1.4-0.7,2.9-0.8,4.3c-2.5,35.7-11.9,69.6-29.2,100.9
                C442.2,448.3,381.7,492.4,300.6,508C290.8,509.8,280.9,510.7,271,512z M51.1,461c21.7-7,42.5-12.8,62.7-20.4
                c13.8-5.2,24.8-3.2,37.6,4c46.5,26.2,96.4,33.7,148.7,22.9c54.3-11.3,98-40,130.5-84.8c37.4-51.4,49.4-108.9,36.6-171
                c-11-53.6-39.5-96.6-83.4-129.2c-47.5-35.3-101.1-48.4-159.4-39.9c-58.8,8.6-106.2,37.6-141.6,85.3
                c-38.3,51.5-50.2,109.3-38.1,172.1c4.7,24.2,13.8,46.9,26.7,67.9c4.5,7.4,5.4,14.7,2.4,22.8c-2.4,6.4-4.3,12.9-6.4,19.4
                C62,426.7,56.7,443.3,51.1,461z"/>
            <path d="M156.1,281c-13.7,0.1-25.2-11.4-25.1-25.1c0.1-13.5,11.3-24.8,24.8-24.9c13.7-0.1,25.2,11.4,25.1,25.1
                C180.9,269.6,169.7,280.9,156.1,281z"/>
            <path d="M281,256c0,13.7-11.5,25.1-25.2,25c-13.5-0.1-24.7-11.4-24.7-24.9c0-13.7,11.5-25.1,25.2-25
                C269.8,231.2,280.9,242.4,281,256z"/>
            <path d="M381,255.8c0.1,13.7-11.3,25.2-25.1,25.1c-13.5-0.1-24.8-11.3-24.9-24.8c-0.1-13.7,11.3-25.2,25.1-25.1
                C369.6,231.1,380.9,242.3,381,255.8z"/>
            </g>
        </svg>
        `;
        // Append the image to the button
        // chatBotToggleBtn.appendChild(chatBotIcon);
  
      let chatBotIframe;
      let isIframeOpen = false;
  
      chatBotToggleBtn.addEventListener("click", function (event) {
        event.stopPropagation();
  
        if (chatBotIframe) {
          chatBotIframe.style.display = chatBotIframe.style.display === "none" ? "block" : "none";
          isIframeOpen = !isIframeOpen;
        } else {
          chatBotIframe = document.createElement("div");
          chatBotIframe.innerHTML = `
            <div class="chatbot-header" style="background: ${headerBgColor}; color: ${headerTextColor}; padding: 10px; display: flex; align-items: center; border-radius: 10px 10px 0 0;">
                <span>Chat Support</span>
            </div>
            <iframe src="https://chat.vorsto.io?agentId=${agentId}&btnColor=${encodeURIComponent(btnBgColor)}" class="chatbot-iframe" style="display: block;"></iframe>
          `;
          chatBotIframe.className = "chatbot-container";
          document.body.appendChild(chatBotIframe);
          isIframeOpen = true;
        }
      });
  
      document.addEventListener("click", function () {
        if (chatBotIframe && isIframeOpen) {
          chatBotIframe.style.display = "none";
          isIframeOpen = false;
        }
      });
  
      document.body.appendChild(chatBotToggleBtn);
  
      const chatBotStyles = document.createElement("style");
      chatBotStyles.innerHTML = `
        .chatbot-container {
          position: fixed;
          bottom: 10%;
          right: 20px;
          z-index: 2147483647;
          width: 30%;
          height: 70%;
          border-radius: 10px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }
        .chatbot-iframe {
          width: 100%;
          height: calc(100% - 40px); /* Adjust for header height */
          border: none;
          border-radius: 0 0 10px 10px;
        }
        .floating-message {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background-color: ${toggleColor};
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 2147483647;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
            transition: opacity 0.5s;
        }
        @media (max-width: 768px) {
          .chatbot-container {
            width: 70%;
            right: 5%;
          }
        }
        @media (max-width: 480px) {
          .chatbot-container {
            width: 100%;
            right: 0;
            border-radius: 0;
          }
          .chatbot-iframe {
            height: calc(100% - 40px);
          }
        }
      `;
      document.head.appendChild(chatBotStyles);
    }
  
    function initVorstoChat() {
      const config = getConfigFromScript();
      createFloatingMessage();
      createChatbot(config);
    }
  
    window.initVorstoChat = initVorstoChat;
    importFonts();
    initVorstoChat();
  })(window, document);
  
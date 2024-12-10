'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { socket } from '@/app/socket'

export default function Conversation({ conversationId }) {
    const [chat, setChat] = useState();
    const [user, setUser] = useState();
    const [chatEnded, setChatEnded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const router = useRouter();

    const addMessage = (text) => {
        const newMessage = {
            id: nanoid(),
            role: user.name,
            content: text,
          };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        saveChat(newMessage);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = () => {
    if (inputText.trim() !== '') {
        const userMessage = inputText; // Save the user's message

        // Add user's message to the chat immediately
        addMessage(userMessage);
        setInputText(''); // Clear the input field
    }
};



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents a new line from being added in the textarea
            handleSubmit();
        }
    };

    const renderText = (input) => {
        // Parse the markdown input into raw HTML
        const rawHtml = marked.parse(input);
        // Modify the raw HTML to add styling and target to <a> tags
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        const styledHtml = sanitizedHtml.replace(
          /<a /g,
          '<a style="color: darkred;" target="_blank"'
        );
        return { __html: styledHtml };
      };

    const getChat = async () => {
    
        try {
          const response = await fetch('/api/get-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversationId }),
          });
    
          if (response.ok) {
              const { name, email, phone, channel, body, is_end, updated_at, user } = await response.json();
              setChat({ name, email, phone, channel, lastMessage: updated_at })
              setUser(user)
              const msgs = JSON.parse(body);
              setMessages(msgs.messages)
              setChatEnded(is_end)
          }
            
        } catch (error) {
          console.error('Error fetching agent:', error);
        }
    };


    const saveChat = async (newMessage) => {
    
        try {
          const response = await fetch('/api/save-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: conversationId, ...chat, messages: [ ...messages, newMessage ], newMessage }),
          });

          if(response.ok)
          {
            socket.emit('joinRoom', conversationId);
            socket.emit('message', { message: newMessage, chat_id: conversationId, roomName: conversationId });
            const newLead = localStorage.getItem("newL");
            localStorage.setItem("newL", newLead - 1);
            router.push(`/live/conversation/${conversationId}`);
          }

        } catch (error) {
          console.error('Error fetching agent:', error);
        }
    };

    useEffect(() => {
        getChat();
    }, [conversationId])

    useEffect(() => {

        socket.emit('joinRoom', conversationId);

        socket.on('agentMessage', ({message, chat_id}) => {
          if(conversationId===chat_id)
          {
            getChat();
          }
        });
    
        return () => {
          socket.off("agentMessage");
        };
      }, []);


    return (
        <>
            {chat && <div className="techwave_fn_aichatbot_page fn__chatbot">
                <div className="chat__page">
                    <div className="font__trigger">
                        <span />
                    </div>
                    <div className="fn__title_holder">
                        <div className="container">
                            {/* Active chat title */}
                            <h1 className="title">Chat with {chat.name} via {chat.channel}</h1>
                            {/* !Active chat title */}
                        </div>
                    </div>
                    <div className="container">
                        <div className="chat__list">
                            <div id="chat0" className="chat__item" />
                            <div className="chat__item active" id="chat1">
                                {messages?.map((message, index) => (
                                    <div className={`chat__box ${message.role == "assistant" ? "bot__chat" : "your__chat"}`} key={index}>
                                        <div className="author">
                                            <span>{message.role == "user" ? chat.name : message.role}</span>
                                        </div>
                                        <div className="chat">
                                            <p><span dangerouslySetInnerHTML={renderText(message.content)}></span></p>
                                            {message.mediaUrl && message.mediaType==="image" && <img src={"https://meta.vorsto.io"+message.mediaUrl} alt="" style={{ width: "50%" }} />}
                                            {message.mediaUrl && message.mediaType==="document" && <a className="techwave_fn_button" href={"https://meta.vorsto.io"+message.mediaUrl}>Download File</a>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat__item" id="chat2" />
                            <div className="chat__item" id="chat3" />
                            <div className="chat__item" id="chat4" />
                        </div>
                    </div>
                    {!chatEnded && <div id="chat5" className="chat__comment">
                        <div className="container">
                            <div id="chat60" className="fn__chat_comment">
                                <textarea
                                    rows={1}
                                    placeholder="Send a message..."
                                    value={inputText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={handleSubmit}>
                                    <img src="/svg/enter.svg" alt="" className="fn__svg" />
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="chat__sidebar">
                    {!chatEnded && <div className="sidebar_header">
                        <Link href="#chat60" className="fn__new_chat_link">
                            <span className="icon" />
                            <span className="text">Reply Chat</span>
                        </Link>
                    </div>}
                    <div className="sidebar_content">
                        <div className="chat__group new">
                            <h2 className="group__title">Last Activity - {new Date(chat.lastMessage).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</h2>
                            <ul className="group__list">
                                <li className="group__item">
                                    <div className="fn__chat_link">
                                        <span className="text">name: {chat.name}</span>
                                    </div>
                                </li>
                                <li className="group__item">
                                    <div className="fn__chat_link">
                                        <span className="text">channel: {chat.channel}</span>
                                    </div>
                                </li>
                                <li className="group__item">
                                    <div className="fn__chat_link">
                                        <span className="text">contact: {chat.channel==="webchat"? chat.email : chat.phone}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> }

        </>
    )
}

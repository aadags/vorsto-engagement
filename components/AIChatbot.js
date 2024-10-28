'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const allCommands = {
    welcome: {
        type: 'text',
        description: 'welcome message',
        text: 'Frenify was founded in 2017. The company began working with the first customers, giving them the opportunity to purchase high-quality HTML templates. The company’s products began to grow in terms of complexity and aesthetics. Frenify currently has a wide range of HTML templates, WordPress themes, WordPress plugins, Photoshop projects; paid and absolutely free products. Design projects are unique and aesthetically pleasing based on customer requirements. Visit our website to get acquainted with our products. Thank you so much for being with us.',
        append: true
    },
    about: {
        type: 'text',
        description: 'some information about the Frenify team',
        text: 'Frenify was founded in 2017. The company began working with the first customers, giving them the opportunity to purchase high-quality HTML templates. The company’s products began to grow in terms of complexity and aesthetics. Frenify currently has a wide range of HTML templates, WordPress themes, WordPress plugins, Photoshop projects; paid and absolutely free products. Design projects are unique and aesthetically pleasing based on customer requirements. Visit our website to get acquainted with our products. Thank you so much for being with us.',
        append: true
    },
    website: {
        type: 'url',
        description: 'go to our official website',
        append: false,
        url: 'https://frenify.com/'
    },
    free: {
        type: 'url',
        description: 'get PSD files of premium themes for free',
        append: false,
        url: 'https://frenify.com/freebies/'
    },
    doc: {
        type: 'url',
        description: 'visit online documentation for TechWave HTML template',
        append: false,
        url: 'https://frenify.com/work/envato/frenify/html/techwave/doc'
    },
    support: {
        type: 'url',
        description: 'if you have any questions regarding TechWave HTML template feel free and contact us by this command',
        append: false,
        url: 'https://themeforest.net/item/techwave-ai-html-dashboard-for-image-generation-chat-bot/46197058/support/contact'
    },
    purchase: {
        type: 'url',
        description: 'open the template description page on themeforest to purchase it',
        append: false,
        url: 'https://themeforest.net/item/techwave-ai-html-dashboard-for-image-generation-chat-bot/46197058'
    },
    youtube: {
        type: 'url',
        description: 'visit our youtube channel with video guides on our themes and templates',
        append: false,
        url: 'https://www.youtube.com/@frenifyteam/videos'
    },
    pass: {
        type: 'password',
        description: 'if you want to get strong password I can generate it for you, write <frenify_main>/pass 20</frenify_main> to get a 20 character password',
        append: true,
    },
    joke: {
        type: 'joke',
        description: 'I can cheer you up by telling a joke',
        append: true,
    },
    time: {
        type: 'time',
        description: 'display current time',
        append: true,
    },
    clear: {
        type: 'clear',
        description: 'to clear current chat',
        append: false,
    },
    commands: {
        type: 'commands',
        description: 'to list all available commands',
        append: true,
    },
};

export default function AIChatbot() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const addMessage = (author, text) => {
        const newMessage = { author, text };
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = () => {
    if (inputText.trim() !== '') {
        const userMessage = inputText; // Save the user's message

        // Add user's message to the chat immediately
        addMessage('You', userMessage);
        setInputText(''); // Clear the input field

        // Add "typing..." message after user's message
        addMessage('Bot', 'Typing...');

        // Simulate typing delay (you can adjust the delay duration as needed)
        setTimeout(() => {
            const response = handleMessage(userMessage); // Process the user's message

            // Remove the "typing..." message and add the bot's response
            setMessages(prevMessages =>
                prevMessages.filter(msg => msg.text !== 'Typing...').concat({ author: 'Bot', text: response })
            );
        }, 1000); // Delay in milliseconds (adjust as needed)
    }
};



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents a new line from being added in the textarea
            handleSubmit();
        }
    };



    const handleMessage = (inputText) => {
        const command = inputText.trim().toLowerCase(); // Normalize the input

        if (allCommands.hasOwnProperty(command)) {
            const commandData = allCommands[command];

            if (commandData.type === 'text') {
                // Reply with the text message
                return commandData.text;
            } else if (commandData.type === 'url') {
                // Redirect to the URL
                window.location.href = commandData.url;
                return ''; // Return an empty string since the page will be redirected
            } else {
                // Append message to the chat if append is true, otherwise provide a default response
                if (commandData.append) {
                    return commandData.description;
                } else {
                    return "I'm sorry, I couldn't process your request.";
                }
            }
        } else {
            return <><p>Hello.</p><p>I am Frenify Bot. After purchasing the template, you can delete me easily. I understand some commands. You just select one of the commands and write here.</p><p>Here is the list of commands:</p><ul><li><frenify_main>/welcome</frenify_main> - welcome message</li><li><frenify_main>/about</frenify_main> - some information about the Frenify team</li><li><frenify_main>/website</frenify_main> - go to our official website</li><li><frenify_main>/free</frenify_main> - get PSD files of premium themes for free</li><li><frenify_main>/doc</frenify_main> - visit online documentation for TechWave HTML template</li><li><frenify_main>/support</frenify_main> - if you have any questions regarding TechWave HTML template feel free and contact us by this command</li><li><frenify_main>/purchase</frenify_main> - open the template description page on themeforest to purchase it</li><li><frenify_main>/youtube</frenify_main> - visit our youtube channel with video guides on our themes and templates</li><li><frenify_main>/pass</frenify_main> - if you want to get strong password I can generate it for you, write <frenify_main>/pass 20</frenify_main> to get a 20 character password</li><li><frenify_main>/joke</frenify_main> - I can cheer you up by telling a joke</li><li><frenify_main>/time</frenify_main> - display current time</li><li><frenify_main>/clear</frenify_main> - to clear current chat</li><li><frenify_main>/commands</frenify_main> - to list all available commands</li></ul><p>We are trying for you. We try to make unique themes and templates with excellent functionality and excellent design.</p></>
        }
    };


    return (
        <>
            <div className="techwave_fn_aichatbot_page fn__chatbot">
                <div className="chat__page">
                    <div className="font__trigger">
                        <span />
                    </div>
                    <div className="fn__title_holder">
                        <div className="container">
                            {/* Active chat title */}
                            <h1 className="title">Chat Bot Definition</h1>
                            {/* !Active chat title */}
                        </div>
                    </div>
                    <div className="container">
                        <div className="chat__list">
                            <div id="chat0" className="chat__item" />
                            <div className="chat__item active" id="chat1">
                                <div className="chat__box your__chat">
                                    <div className="author"><span>You</span></div>
                                    <div className="chat">
                                        <p>What is a chat bot?</p>
                                    </div>
                                </div>
                                <div className="chat__box bot__chat">
                                    <div className="author"><span>Bot</span></div>
                                    <div className="chat">
                                        <p>At the most basic level, a chatbot is a computer program that simulates and processes human conversation (either written or spoken), allowing humans to interact with digital devices as if they were communicating with a real person. Chatbots can be as simple as rudimentary programs that answer a simple query with a single-line response, or as sophisticated as digital assistants that learn and evolve to deliver increasing levels of personalization as they gather and process information.</p>
                                    </div>
                                </div>
                                <div className="chat__box your__chat">
                                    <div className="author"><span>You</span></div>
                                    <div className="chat">
                                        <p>How do chatbots work?</p>
                                    </div>
                                </div>
                                <div className="chat__box bot__chat">
                                    <div className="author"><span>Bot</span></div>
                                    <div className="chat">
                                        <p>Chatbots boost operational efficiency and bring cost savings to businesses while offering convenience and added services to internal employees and external customers. They allow companies to easily resolve many types of customer queries and issues while reducing the need for human interaction.</p>
                                    </div>
                                </div>
                                {messages.map((message, index) => (
                                    <div className={`chat__box ${message.author == "Bot" ? "bot__chat" : "your__chat"}`} key={index}>
                                        <div className="author">
                                            <span>{message.author} {console.log(message.author)}</span>
                                        </div>
                                        <div className="chat">
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat__item" id="chat2" />
                            <div className="chat__item" id="chat3" />
                            <div className="chat__item" id="chat4" />
                        </div>
                    </div>
                    <div className="chat__comment">
                        <div className="container">
                            <div className="fn__chat_comment">
                                <textarea
                                    rows={1}
                                    placeholder="Send a message..."
                                    value={inputText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <button onClick={handleSubmit}>
                                    <img src="svg/enter.svg" alt="" className="fn__svg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat__sidebar">
                    <div className="sidebar_header">
                        <Link href="#chat0" className="fn__new_chat_link">
                            <span className="icon" />
                            <span className="text">New Chat</span>
                        </Link>
                    </div>
                    <div className="sidebar_content">
                        <div className="chat__group new">
                            <h2 className="group__title">Today</h2>
                            <ul className="group__list">
                                <li className="group__item">
                                    <div className="fn__chat_link active" href="#chat1">
                                        <span className="text">Chat Bot Definition</span>
                                        <input type="text" defaultValue="Chat Bot Definition" />
                                        <span className="options">
                                            <button className="trigger"><span /></button>
                                            <span className="options__popup">
                                                <span className="options__list">
                                                    <button className="edit">Edit</button>
                                                    <button className="delete">Delete</button>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="save_options">
                                            <button className="save">
                                                <img src="svg/check.svg" alt="" className="fn__svg" />
                                            </button>
                                            <button className="cancel">
                                                <img src="svg/close.svg" alt="" className="fn__svg" />
                                            </button>
                                        </span>
                                    </div>
                                </li>
                                <li className="group__item">
                                    <div className="fn__chat_link" href="#chat2">
                                        <span className="text">Essay: Marketing</span>
                                        <input type="text" defaultValue="Essay: Marketing" />
                                        <span className="options">
                                            <button className="trigger"><span /></button>
                                            <span className="options__popup">
                                                <span className="options__list">
                                                    <button className="edit">Edit</button>
                                                    <button className="delete">Delete</button>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="save_options">
                                            <button className="save">
                                                <img src="svg/check.svg" alt="" className="fn__svg" />
                                            </button>
                                            <button className="cancel">
                                                <img src="svg/close.svg" alt="" className="fn__svg" />
                                            </button>
                                        </span>
                                    </div>
                                </li>
                                <li className="group__item">
                                    <div className="fn__chat_link" href="#chat3">
                                        <span className="text">Future of Social Media</span>
                                        <input type="text" defaultValue="Future of Social Media" />
                                        <span className="options">
                                            <button className="trigger"><span /></button>
                                            <span className="options__popup">
                                                <span className="options__list">
                                                    <button className="edit">Edit</button>
                                                    <button className="delete">Delete</button>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="save_options">
                                            <button className="save">
                                                <img src="svg/check.svg" alt="" className="fn__svg" />
                                            </button>
                                            <button className="cancel">
                                                <img src="svg/close.svg" alt="" className="fn__svg" />
                                            </button>
                                        </span>
                                    </div>
                                </li>
                                <li className="group__item">
                                    <div className="fn__chat_link" href="#chat4">
                                        <span className="text">Business Ideas</span>
                                        <input type="text" defaultValue="Business Ideas" />
                                        <span className="options">
                                            <button className="trigger"><span /></button>
                                            <span className="options__popup">
                                                <span className="options__list">
                                                    <button className="edit">Edit</button>
                                                    <button className="delete">Delete</button>
                                                </span>
                                            </span>
                                        </span>
                                        <span className="save_options">
                                            <button className="save">
                                                <img src="svg/check.svg" alt="" className="fn__svg" />
                                            </button>
                                            <button className="cancel">
                                                <img src="svg/close.svg" alt="" className="fn__svg" />
                                            </button>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

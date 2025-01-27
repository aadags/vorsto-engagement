"use client"
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { socket } from '@/app/socket'
import axios from 'axios';

export default function Left({ activeTrueFalse, activeMobileMenu, user }) {

    const [newLead, setNewLead] = useState(0);
    const [chats, setChats] = useState([]);
    const [perms, setPerms] = useState([]);
    const [notify, setNotify] = useState(null);

    const getChats = async () => {
    
        try {
          const response = await fetch('/api/get-live-chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 0 }),
          });
    
          if (response.ok) {
              const liveChats = await response.json();
              setChats(liveChats);
          }
            
        } catch (error) {
          console.error('Error fetching agent:', error);
        }
    };

    const fetchLeads = async () => {
		const response = await axios.get(`/api/get-convos?page=1&per_page=1`);
		setNewLead(response.data.total);
	};

    useEffect(() => {

        const prms = JSON.parse(user.role?.permissions||"[]");
        const result = Object.entries(prms)
            .filter(([key, value]) => value === true)
            .map(([key]) => key);
        setPerms(["allow", ...result])

        getChats();

        fetchLeads();

        if (socket.connected) {
            onConnect();
        }

        socket.on('notifyLead', (data) => {
            setNewLead(newLead + 1);
        });


        function onConnect() {
          socket.emit('user-join', user);
        }

        function onDisconnect() {
            console.warn("Socket disconnected, reloading the page.");
            window.location.reload();
        }

        socket.on("connect", onConnect);

        socket.on("disconnect", onDisconnect);

        
        return () => {
          socket.off("connect");
          socket.off("notifyLead");
          socket.off("disconnect", onDisconnect);
        };
      }, []);

    const data = [
        {
            title: "Overview",
            pathname: "/",
            img: "/svg/home.svg",
            key: "allow"
        },
        {
            title: "Conversation Queue",
            pathname: "/escalated",
            img: "/svg/chat.svg",
            key: "allow",
            counter: newLead
        },
        {
            title: "Ongoing Conversations",
            pathname: "/conversations",
            img: "/svg/chat.svg",
            key: "allow"
    
        },
        {
            title: "Archived Conversations",
            pathname: "/archived",
            img: "/svg/envelope.svg",
            key: user.role_id > 0 ? "archivedChats" : "allow"
    
        },
        {
            title: "Call Queue",
            pathname: "/voice-queue",
            img: "/svg/phone-volume.svg",
            key: user.role_id > 0 ? "callQueue" : "allow",
        },
        {
            title: "Call Log",
            pathname: "/voice-log",
            img: "/svg/phonebook.svg",
            key: user.role_id > 0 ? "callLog" : "allow",
        },
        {
            title: "Contacts",
            pathname: "/contacts",
            img: "/svg/bookmarked.svg",
            key: user.role_id > 0 ? "contacts" : "allow"
    
        },
        {
            title: "Open Tickets",
            pathname: "/tickets",
            img: "/svg/tickets-on.svg",
            key: user.role_id > 0 ? "openTickets" : "allow"
    
        },
        {
            title: "Archived Tickets",
            pathname: "/archived-tickets",
            img: "/svg/tickets.svg",
            key: user.role_id > 0 ? "archivedTickets" : "allow"
    
        },
        {
            title: "AI Agent",
            pathname: "/agent",
            img: "/svg/robot.svg",
            key: user.role_id > 0 ? "manageAiAgent": "allow"
    
        },
        {
            title: "Workflow",
            pathname: "/workflow",
            img: "/svg/option.svg",
            key: user.role_id > 0 ? "manageWorkflow": "allow"
    
        },
        {
            title: "Users",
            pathname: "/users",
            img: "/svg/community.svg",
            key: user.role_id > 0 ? "viewUsers" : "allow"
    
        },
        {
            title: "Roles",
            pathname: "/roles",
            img: "/svg/hat.svg",
            key: user.role_id > 0 ? "viewRoles" : "allow"
    
        },
        {
            title: "Billing",
            pathname: user.organizations.plan === "free"? "/plan" : `/billing/${user.organizations.stripe_id}`,
            img: "/svg/dollar.svg",
            key: user.role_id > 0 ? "manageBilling" : "allow"
    
        },
        {
            title: "Web",
            pathname: "/channel/webchat",
            img: "/svg/webchat.svg",
            key: user.role_id > 0 ? "configureWebChat" : "allow"
        },
        {
            title: "Whatsapp",
            pathname: "/channel/whatsapp",
            img: "/svg/whatsapp.svg",
            key: user.role_id > 0 ? "configureWhatsapp": "allow"
        },
        {
            title: "Instagram",
            pathname: "/channel/instagram",
            img: "/svg/instagram.svg",
            key: user.role_id > 0 ? "configureInstagram": "allow"
        },
        {
            title: "Email",
            pathname: "/channel/email",
            img: "/svg/email.svg",
            key: user.role_id > 0 ? "configureEmail": "allow"
        },
        {
            title: "Voice",
            pathname: "/channel/voice",
            img: "/svg/tty.svg",
            key: user.role_id > 0 ? "configureVoice": "allow"
        },
        {
            title: "Voice Metrics",
            pathname: "/metrics/call",
            img: "/svg/chart.svg",
            key: user.role_id > 0 ? "callMetrics": "allow"
        },
        {
            title: "Chat Metrics",
            pathname: "/metrics/chat",
            img: "/svg/chart.svg",
            key: user.role_id > 0 ? "chatMetrics": "allow"
        },
        {
            title: "Agent Performance",
            pathname: "/metrics/agent",
            img: "/svg/chart.svg",
            key: user.role_id > 0 ? "agentMetrics": "allow"
        }
    
    ];

    const pathname = usePathname()

    const [isToggle, setToggle] = useState(false)
    const toggleHandle = () => setToggle(!isToggle);

    useEffect(() => {
        if (notify && typeof Audio !== "undefined") { 
            const notificationSound = new Audio('/note.mp3');
            notificationSound.play();
        }
    }, [notify])

    return (
        <>
            <div className="techwave_fn_leftpanel">
                <div className="mobile_extra_closer" />
                {/* logo (left panel) */}
                <div className="leftpanel_logo">
                    <Link href="/" className="fn_logo">
                        <span className="full_logo">
                            <img src="/logo_black.png" alt="" className="desktop_logo" />
                            <img src="/logo_black.png" alt="" className="retina_logo" />
                        </span>
                        <span className="short_logo">
                            <img src="/logo_only_black.png" alt="" className="desktop_logo" />
                            <img src="/logo_only_black.png" alt="" className="retina_logo" />
                        </span>
                    </Link>
                    <a className="fn__closer fn__icon_button desktop_closer" onClick={activeTrueFalse}>
                        <img src="/svg/arrow.svg" alt="" className="fn__svg" />
                    </a>
                    <a className="fn__closer fn__icon_button mobile_closer" onClick={activeMobileMenu}>
                        <img src="/svg/arrow.svg" alt="" className="fn__svg" />
                    </a>
                </div>
                {/* !logo (left panel) */}
                {/* content (left panel) */}
                <div className="leftpanel_content">
                    {/* #1 navigation group */}
                    <div className="nav_group">
                        <ul className="group__list">
                            {data.slice(0, 7).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter > 0 && <span className="count">new</span>}</span>
                                    </Link>
                                </li>
                            ))}
                            {data.slice(7, 9).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* !#1 navigation group */}
                    {/* #3 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">MY CONVERSATIONS</h2>
                        <ul className="group__list">
                            {/* {data.slice(5, 6).map((item, i) => (
                                <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">new</span>}</span>
                                    </Link>
                                </li>
                            ))} */}
                            {chats && chats.map((chat, i) => (
                                <li key={i}>
                                    <Link href={`/live/conversation/${chat.id}`} className={`fn__tooltip menu__item ${pathname.includes(chat.id) ? "active" : ""}`} title={chat.name} >
                                        <span className="icon">
                                            <img src={"/svg/chat.svg"} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{chat.name}{chat.counter && <span className="count">{chat.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                    {/* #3 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">MY CALL CENTER</h2>
                        <ul className="group__list">
                                <li>
                                    <Link href="/sip-phone" className={`fn__tooltip menu__item ${pathname.includes("sip") ? "active" : ""}`} title="sip phone" >
                                        <span className="icon">
                                            <img src={"/svg/headset.svg"} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">Call Phone</span>
                                    </Link>
                                </li>
                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                    {/* #3 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">Wallboard</h2>
                        <ul className="group__list">
                            {data.slice(19, 22).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                    {/* #3 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">ADMIN SETTINGS</h2>
                        <ul className="group__list">
                            {data.slice(9, 14).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                    {/* #3 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">CHANNEL SETTINGS</h2>
                        <ul className="group__list">
                            {data.slice(14, 19).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                    
        
                </div>
                {/* !content (left panel) */}
            </div>
        </>
    )
}

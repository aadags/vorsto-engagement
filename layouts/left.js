"use client"
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { socket } from '@/app/socket'
import axios from 'axios';

export default function Left({ activeTrueFalse, activeMobileMenu, user, hide=false }) {

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

    const main = [
        {
            title: "Overview",
            pathname: "/",
            img: "/svg/home.svg",
            key: "allow"
        },
        {
            title: "Contacts",
            pathname: "/contacts",
            img: "/svg/bookmarked.svg",
            key: user.role_id > 0 ? "contacts" : "allow"
    
        },
        {
            title: "Loyalty",
            pathname: "/payments",
            img: "/svg/phone-volume.svg",
            key: user.role_id > 0 ? "callQueue" : "allow",
        },
        {
            title: "Coupons",
            pathname: "/payments",
            img: "/svg/phone-volume.svg",
            key: user.role_id > 0 ? "callQueue" : "allow",
        },
    ];

    const chat = [
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
    ];

    const call = [
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
    ];

    const ticket = [
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
    ];

    const report = [
        {
            title: "Call Metrics",
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
    ];

    const admin = [
        {
            title: "AI Agents",
            pathname: "/agent",
            img: "/svg/robot.svg",
            key: user.role_id > 0 ? "manageAiAgent": "allow"
        },
        {
            title: "Billing",
            pathname: user.organizations.plan === "free"? "/plan" : `/billing/${user.organizations.stripe_id}`,
            img: "/svg/dollar.svg",
            key: user.role_id > 0 ? "manageBilling" : "allow"
    
        },
    ];

    const access = [
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
        }
    ];

    const channel = [
        {
            title: "Web Chat",
            pathname: "/channel/webchat",
            img: "/svg/webchat.svg",
            key: user.role_id > 0 ? "configureWebChat" : "allow"
        },
        {
            title: "Web Forms",
            pathname: "/channel/webform",
            img: "/svg/form.svg",
            key: user.role_id > 0 ? "configureWebForm" : "allow"
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
            title: "Voice & SMS",
            pathname: "/channel/voice",
            img: "/svg/tty.svg",
            key: user.role_id > 0 ? "configureVoice": "allow"
        },
    ];

    const data = [
        {
            title: "Agent Performance",
            pathname: "/metrics/agent",
            img: "/svg/chart.svg",
            key: ""
        }
    ];

    const sales = [
        {
            title: "Orders",
            pathname: "/sales/orders",
            img: "/svg/phone-volume.svg",
            key: user.role_id > 0 ? "orders" : "allow",
        },
        {
            title: "Catalog",
            pathname: "/sales/catalog",
            img: "/svg/phone-volume.svg",
            key: user.role_id > 0 ? "payments" : "allow",
        }
    ];

    const integration = [
        {
            title: "Payment Providers",
            pathname: "/integration/payments",
            img: "/svg/phone-volume.svg",
            key: user.role_id > 0 ? "paymentProviders" : "allow",
        }
    ];

    const pathname = usePathname()

    const isChannelActive = channel.some((item) => item.pathname === pathname);
    const [isChannelToggle, setChannelToggle] = useState(isChannelActive)
    const toggleChannelHandle = () => setChannelToggle(!isChannelToggle);

    const isAccActive = access.some((item) => item.pathname === pathname);
    const [isAccToggle, setAccToggle] = useState(isAccActive)
    const toggleAccHandle = () => setAccToggle(!isAccToggle);

    const isReportActive = report.some((item) => item.pathname === pathname);
    const [isReportToggle, setReportToggle] = useState(isReportActive)
    const toggleReportHandle = () => setReportToggle(!isReportToggle);

    const isChatActive =
    chat.some((item) => item.pathname === pathname) ||
    (chats && chats.some((chat) => pathname.includes(chat.id)));
    const [isChatToggle, setChatToggle] = useState(isChatActive);
    const toggleChatHandle = () => setChatToggle((prev) => !prev);

    const isCallActive =
    call.some((item) => item.pathname === pathname) ||
    pathname.includes("sip");
    const [isCallToggle, setCallToggle] = useState(isCallActive)
    const toggleCallHandle = () => setCallToggle((prev) => !prev);

    const isTicketActive = ticket.some((item) => item.pathname === pathname);
    const [isTicketToggle, setTicketToggle] = useState(isTicketActive);
    const toggleTicketHandle = () => setTicketToggle((prev) => !prev);

    const isSalesActive = sales.some((item) => item.pathname === pathname);
    const [isSalesToggle, setSalesToggle] = useState(isSalesActive);
    const toggleSalesHandle = () => setSalesToggle((prev) => !prev);

    const isItgActive = integration.some((item) => item.pathname === pathname);
    const [isItgToggle, setItgToggle] = useState(isItgActive);
    const toggleItgHandle = () => setItgToggle((prev) => !prev);

    useEffect(() => {
        setChatToggle(isChatActive);
        setCallToggle(isCallActive);
        setTicketToggle(isTicketActive);
        setReportToggle(isReportActive);
        setAccToggle(isAccActive);
        setChannelToggle(isChannelActive);
        setSalesToggle(isSalesActive);
        setItgToggle(isItgActive);
    }, [pathname]);

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
                            <img src="/vorsto-dark.png" alt="" className="desktop_logo" />
                            <img src="/vorsto-dark.png" alt="" className="retina_logo" />
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
                {!hide && <div className="leftpanel_content">
                    {/* #1 navigation group */}
                    <div className="nav_group">
                        <ul className="group__list">
                            {main.slice(0, 1).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter > 0 && <span className="count">new</span>}</span>
                                    </Link>
                                </li>
                            ))}
                            <li className={`menu-item-has-children ${isSalesToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Sales" onClick={toggleSalesHandle} >
                                    <span className="icon"><img src="/svg/sales.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Sales</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isSalesToggle ? "block" : "none"}` }}>
                                    {sales.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className={`menu-item-has-children ${isChatToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Chat" onClick={toggleChatHandle} >
                                    <span className="icon"><img src="/svg/chat.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Chat</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isChatToggle ? "block" : "none"}` }}>
                                    {chat.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                    {chats.length > 0 && <li>------------------------------------</li>}
                                    {chats && chats.map((chat, i) => (
                                        <li key={i}>
                                            <Link href={`/live/conversation/${chat.id}`} className={`fn__tooltip menu__item ${pathname.includes(chat.id) ? "active" : ""}`} title={chat.name} >
                                                <span className="text">{chat.name}{chat.counter && <span className="count">{chat.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className={`menu-item-has-children ${isCallToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Calls" onClick={toggleCallHandle} >
                                    <span className="icon"><img src="/svg/phone-volume.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Call</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isCallToggle ? "block" : "none"}` }}>
                                {call.map((item, i) => (
                                    item.key && perms.includes(item.key) && <li key={i}>
                                        <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                            <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                        <Link href="/sip-phone" target="_blank" className={`fn__tooltip menu__item ${pathname.includes("sip") ? "active" : ""}`} title="sip phone" >
                                            <span className="text">Call Phone</span>
                                        </Link>
                                    </li>
                                    </ul>
                            </li>
                            <li className={`menu-item-has-children ${isTicketToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Tickets" onClick={toggleTicketHandle} >
                                    <span className="icon"><img src="/svg/tickets.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Tickets</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isTicketToggle ? "block" : "none"}` }}>
                                    {ticket.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            
                            {main.slice(1, 2).map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                            <li className={`menu-item-has-children ${isReportToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Reports" onClick={toggleReportHandle} >
                                    <span className="icon"><img src="/svg/chart.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Reports</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isReportToggle ? "block" : "none"}` }}>
                                    {report.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* !#1 navigation group */}
                    <div className="nav_group">
                        <h2 className="group__title">ADMIN SETTINGS</h2>
                        <ul className="group__list">
                            {admin.map((item, i) => (
                                item.key && perms.includes(item.key) && <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                    </Link>
                                </li>
                            ))}
                            <li className={`menu-item-has-children ${isItgToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Integration" onClick={toggleItgHandle} >
                                    <span className="icon"><img src="/svg/plug.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Integration</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isItgToggle ? "block" : "none"}` }}>
                                    {integration.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className={`menu-item-has-children ${isAccToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Channels" onClick={toggleAccHandle} >
                                    <span className="icon"><img src="/svg/community.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Access Management</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isAccToggle ? "block" : "none"}` }}>
                                    {access.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className={`menu-item-has-children ${isChannelToggle ? "closed" : ""}`} >
                                <a className="fn__tooltip menu__item" title="Channels" onClick={toggleChannelHandle} >
                                    <span className="icon"><img src="/svg/setting.svg" alt="" className="fn__svg" /></span>
                                    <span className="text">Channels</span>
                                    <span className="trigger"><img src="/svg/arrow.svg" alt="" className="fn__svg" /></span>
                                </a>
                                <ul className="sub-menu" style={{ display: `${isChannelToggle ? "block" : "none"}` }}>
                                    {channel.map((item, i) => (
                                        item.key && perms.includes(item.key) && <li key={i}>
                                            <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                                <span className="text">{item.title}{item.counter && <span className="count">{item.counter}</span>}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                    {/* !#3 navigation group */}
                    
        
                </div>}
                {/* !content (left panel) */}
            </div>
        </>
    )
}

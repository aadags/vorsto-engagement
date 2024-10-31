"use client"
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { socket } from '@/app/socket'

export default function Left({ activeTrueFalse, activeMobileMenu, user }) {

    const [newLead, setNewLead] = useState(false);

    useEffect(() => {

        setNewLead(localStorage.getItem('newL') || newLead)

        if (socket.connected) {
            onConnect();
        }

        socket.on('notifyLead', (data) => {
            if (typeof Audio !== "undefined") { 
                const notificationSound = new Audio('/note.mp3');
                notificationSound.play();
                newLead(true);
                localStorage.setItem("newL", true);
            }
        });


        function onConnect() {
          socket.emit('user-join', user);
        }

        socket.on("connect", onConnect);
        
        return () => {
          socket.off("connect");
          socket.off("notifyLead");
        };
      }, []);

    const data = [
        {
            title: "Overview",
            pathname: "/",
            img: "/svg/home.svg"
    
        },
        {
            title: "Tickets",
            pathname: "/leads",
            img: "/svg/bookmark.svg",
            counter: newLead
        },
        {
            title: "AI Conversations",
            pathname: "/bot/ongoing",
            img: "/svg/chat.svg"
    
        },
        {
            title: "Start Conversation",
            pathname: "/bot/ongoing",
            img: "/svg/new.svg"
    
        },
        {
            title: "AI Agent",
            pathname: "/agent",
            img: "/svg/setting.svg"
    
        }
    
    ];

    const pathname = usePathname()

    const [isToggle, setToggle] = useState(false)
    const toggleHandle = () => setToggle(!isToggle);

    return (
        <>
            <div className="techwave_fn_leftpanel">
                <div className="mobile_extra_closer" />
                {/* logo (left panel) */}
                <div className="leftpanel_logo">
                    <Link href="/" className="fn_logo">
                        <span className="full_logo">
                            <img src="/img/vorsto-logo.png" alt="" className="desktop_logo" />
                            <img src="/img/vorsto-logo.png" alt="" className="retina_logo" />
                            <span style={{ fontWeight: "bold", fontSize: "20px", color: "#FFF", paddingLeft: "30px" }}>ENGAGEMENT</span>
                        </span>
                        <span className="short_logo">
                            <img src="/img/2-0.png" alt="" className="desktop_logo" />
                            <img src="/img/2-0.png" alt="" className="retina_logo" />
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
                            {data.slice(0, 3).map((item, i) => (
                                <li key={i}>
                                    <Link href={`${item.pathname}`} className={`fn__tooltip menu__item ${item.pathname === pathname ? "active" : ""}`} title={item.title} >
                                        <span className="icon">
                                            <img src={item.img} alt="" className="fn__svg" />
                                        </span>
                                        <span className="text">{item.title}{newLead && item.counter && <span className="count">new</span>}</span>
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
                            {data.slice(3, 4).map((item, i) => (
                                <li key={i}>
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
                        <h2 className="group__title">SETTINGS</h2>
                        <ul className="group__list">
                            {data.slice(4, 5).map((item, i) => (
                                <li key={i}>
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

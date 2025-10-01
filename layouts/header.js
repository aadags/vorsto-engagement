'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import screenfull from 'screenfull';
import { auth } from "../firebaseConfig/FirebaseClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function Header({ searchToggle, user }) {
    // Light/Dark switcher
    const [skin, setSkin] = useState('light');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZuppr, setIsZuppr] = useState(false);

    const router = useRouter();


    useEffect(() => {
        setIsZuppr(window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API));
        // Check if running in the browser (client side)
        if (typeof window !== 'undefined') {
            const storedSkin = localStorage.getItem('frenify_skin');
            if (storedSkin) {
                setSkin(storedSkin);
            }
        }
    }, []);

    const toggleSkin = () => {
        const newSkin = skin === 'light' ? 'dark' : 'light';
        setSkin(newSkin);
    };


    useEffect(() => {
        // Check if running in the browser (client side)
        if (typeof window !== 'undefined') {
            // Update local storage and document attribute
            localStorage.setItem('frenify_skin', skin);
            document.documentElement.setAttribute('data-techwave-skin', skin);
        }
    }, [skin]);


    // Full Screen Handler
    const toggleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    };

    const handleFullscreenChange = () => {
        setIsFullscreen(screenfull.isFullscreen);
    };

    const handleLogout = async (e) => {
      e.preventDefault();
      try {
        await auth.signOut(); // Wait for signOut to complete
        router.push('/logout'); // Redirect after signOut
        
      } catch (error) {
        console.error('Sign Out Error:', error);
      }
    };

    useEffect(() => {
        // Fullscreen handlers
        if (screenfull.isEnabled) {
            screenfull.on('change', handleFullscreenChange);
        }

        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, []);

    return (
        <>
            <header className="techwave_fn_header">
                {/* Header left: token information */}
                <div className="header__left">
                    <div className="fn__token_info">
                       <span className="token_summary">
                            <span className="count">{user?.organizations.name}</span>
                            <span className="text">{user?.organizations.address}</span>
                        </span>
                        {isZuppr &&<Link href="/sales/ordertracker" className="token_upgrade techwave_fn_button"><span>Order Tracker</span></Link>}
    
                    </div>
                </div>
                {/* /Header left: token information */}
                {/* Header right: navigation bar */}
                <div className="header__right">
                    <div className="fn__nav_bar">                   
                      
                        {/* User (bar item) */}
                        <Menu as="div" className="bar__item bar__item_user opened">
                            <Menu.Button as="nav" id="Button3" className="user_opener fn__tooltip" title="User Profile">
                                <img src="/svg/person.svg" />
                            </Menu.Button>
                            <Menu.Items as="div" className="item_popup" data-position="right">
                                <div className="user_profile">
                                    <div className="user_info">
                                        <h2 className="user_name">{user.name}</h2>
                                        <p>{user.role?.title || "Administrator"}</p>
                                        <p><Link href={"mailto:"+user.email} className="user_email">{user.email}</Link></p>
                                    </div>
                                </div>
                                <div className="user_nav">
                                    <ul>
                                        <li>
                                            <Link href="/logout" onClick={handleLogout}>
                                                <span className="icon"><img src="/svg/logout.svg" alt="" className="fn__svg" /></span>
                                                <span className="text">Log Out</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </Menu.Items>
                        </Menu>
                        {/* !User (bar item) */}
                    </div>
                </div>
                {/* !Header right: navigation bar */}
            </header>
        </>
    )
}

"use client"
import { useEffect, useState } from 'react'
import { imageToSvg } from '../components/Utilities'
import '../app/globals.css'
import '../public/css/plugins.css'
import '../public/css/style.css'
import '../public/css/fontawesome-all.min.css';
import Footer from './footer'
import Header from './header'
import Left from './left'
import { auth } from "@/firebaseConfig/FirebaseClient";
import { useRouter } from 'next/navigation';
import { socket } from '@/app/socket'


export default function Layout({ children, leftMenu }) {

    const router = useRouter();
    const [user, setUser] = useState();

    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      socket.emit('user-join', { name: "egbeda" });
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    console.log({isConnected})
    
}, [isConnected])
    

    useEffect(() => {

        setTimeout(() => {
            imageToSvg()

        }, 2000);

        if (leftMenu) {
            document.querySelector('.techwave_fn_wrapper').classList.add("fn__has_sidebar")
        }
    }, [])
      
  useEffect(() => {
    auth.onAuthStateChanged(async (currentUser) => {
      console.log({currentUser})
      if (!currentUser) {
        router.push('/login'); 
      } else {
        try {

            const response = await fetch('/api/get-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: currentUser.email })
            });
      
            if (response.ok) {
              const res = await response.json();
              setUser(res.data);
            } 
          } catch (error) {
            console.log(error)
          }
      }
    });

  }, [router])


    const [leftmenu, setLeftmenu] = useState(false)
    const [mobileMenu, setMobiletmenu] = useState(false)
    const activeTrueFalse = () => {
        setLeftmenu(!leftmenu)
        document.querySelector('.toggleMenu').classList.toggle("panel-opened")
    }
    const activeMobileMenu = () => {
        setMobiletmenu(mobileMenu)
        document.querySelector('.toggleMenu').classList.toggle("mobile-panel-opened")
    }

    const [OpenSearch, setOpenSearch] = useState(false)
    const searchToggle = () => {
        setOpenSearch(!OpenSearch)
    }
    return (
        <>
            {/* Moving Submenu */}
            <div className="techwave_fn_fixedsub">
                <ul />
            </div>
            {/* !Moving Submenu */}
            {/* Preloader */}
            {/* <Loading/> */}
            {/* !Preloader */}
            {/* MAIN WRAPPER */}
            {user && <div className="techwave_fn_wrapper">
                <div className="techwave_fn_wrap">
                    {/* Searchbar */}
                    {/* <Search OpenSearch={OpenSearch} searchToggle={searchToggle} /> */}
                    {/* !Searchbar */}
                    {/* HEADER */}
                    <Header searchToggle={searchToggle} user={user} />
                    {/* !HEADER */}
                    {/* LEFT PANEL */}
                    <Left activeTrueFalse={activeTrueFalse} activeMobileMenu={activeMobileMenu} user={user}  />
                    {/* !LEFT PANEL */}
                    {/* CONTENT */}
                    <div className="techwave_fn_content">
                        {/* PAGE (all pages go inside this div) */}
                        <div className="techwave_fn_page" >
                            {children}
                        </div>
                        {/* !PAGE (all pages go inside this div) */}
                        {/* FOOTER (inside the content) */}
                        <Footer />
                        {/* !FOOTER (inside the content) */}
                    </div>
                    {/* !CONTENT */}
                </div>
            </div>}
            {/* !MAIN WRAPPER */}
        </>
    )
}


import { Heebo, Work_Sans } from 'next/font/google'
import { Viewport } from 'next'
import Script from "next/script";

const heebo = Heebo({
  weight:['100', '200', '300', '400', '500', '600', '700', '800', '900',],
  style:['normal'],
  subsets: ['latin'],
  display: 'swap',
})
const worksans = Work_Sans({
  weight:['100', '200', '300', '400', '500', '600', '700', '800', '900',],
  style:['normal'],
  subsets:['latin'],
  display:'swap',
})


export const viewport = {
  title: {
    template:'Vorsto AI | %s',
    // content:'text/html',
    default:'Vorsto | Build AI agents, Integrate With no code', // a default is required when creating a template
  },
  name: "description",
  content:"Vorsto Console",
  openGraph: {
    title: 'Vorsto Console',
    description: 'Vorsto Console'
  },
  viewport:'width=device-width, initial-scale=1, maximum-scale=1',
  httpEquiv:'Content-Type',
  charset:'utf-8'
}

export default function RootLayout({ children }) {


  return (
    <html lang='en' className='toggleMenu'>
      <head>
      <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XWDTZ052ZT"
          strategy="afterInteractive" // Ensures it loads after initial page content
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XWDTZ052ZT');
          `}
        </Script>
              <script
            async
            src="https://js.stripe.com/v3/pricing-table.js"
          ></script>
          <link rel="icon" href="/img/v-icon.png" type="image/x-icon" />
      </head>
      <body>
        {children}
      </body>
    </html>

  )
}

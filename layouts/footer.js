import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <>
            <footer className="techwave_fn_footer">
                <div className="techwave_fn_footer_content">
                    <div className="copyright">
                        <p>2024© Vorsto.io</p>
                    </div>
                    <div className="menu_items">
                        <ul>
                            <li><Link href="https://www.vorsto.io/terms-policy" target="_blank">Terms of Service</Link></li>
                            <li><Link href="https://www.vorsto.io/privacy-policy" target="_blank">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}

import React from 'react'
import Link from 'next/link'

export default function Footer() {
    const isZuppr = window.location.hostname.includes(process.env.NEXT_PUBLIC_ZUPPR_API);

    return (
        <>
            <footer className="techwave_fn_footer">
                <div className="techwave_fn_footer_content">
                    <div className="copyright">
                        <p>2025© Vorsto Technologies</p>
                    </div>
                    <div className="menu_items">
                        {isZuppr? <ul>
                            <li><a onClick={() => {
                                const signupUrl = "https://merchants.zuppr.ca/terms.html";
                                if (window.ReactNativeWebView?.postMessage) {
                                // when inside your React Native WebView
                                window.ReactNativeWebView.postMessage(
                                    JSON.stringify({ action: "openExternal", url: signupUrl })
                                );
                                } else {
                                // normal web browser
                                window.open(signupUrl, "_blank");
                                }
                            }}>Terms of Service</a></li>
                            <li><a onClick={() => {
                                const signupUrl = "https://merchants.zuppr.ca/privacy.html";
                                if (window.ReactNativeWebView?.postMessage) {
                                // when inside your React Native WebView
                                window.ReactNativeWebView.postMessage(
                                    JSON.stringify({ action: "openExternal", url: signupUrl })
                                );
                                } else {
                                // normal web browser
                                window.open(signupUrl, "_blank");
                                }
                            }}>Privacy Policy</a></li>
                        </ul>: <ul>
                            <li><Link href="https://dev.vorsto.io/terms-policy" target="_blank">Terms of Service</Link></li>
                            <li><Link href="https://dev.vorsto.io/privacy-policy" target="_blank">Privacy Policy</Link></li>
                        </ul>}
                    </div>
                </div>
            </footer>
        </>
    )
}

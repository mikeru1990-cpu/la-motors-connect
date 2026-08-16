import './globals.css';
import './dashboard.css';
import Link from 'next/link';

export const metadata={title:'L.A Motors Stroud Ltd',description:'Workshop services, vehicle sales and online booking in Stroud.'};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>
 <header className="siteHeader"><div className="shell navWrap"><Link href="/" className="brand"><span className="logo">L.A</span><span><b>L.A MOTORS</b><small>STROUD LTD · AUTOMOTIVE SPECIALISTS</small></span></Link><nav><Link href="/services">Workshop</Link><Link href="/cars">Cars for Sale</Link><Link href="/booking">Book Online</Link><Link href="/dashboard">Liam Dashboard</Link><a className="navCta" href="tel:07484770941">Call 07484 770941</a></nav></div></header>
 {children}
 <footer><div className="shell footerGrid"><div><div className="brand"><span className="logo">L.A</span><span><b>L.A MOTORS</b><small>STROUD LTD</small></span></div><p>Workshop services, specialist car keys and quality used vehicles from a local Stroud business.</p></div><div><h4>Visit & Contact</h4><p>Unit 2 Butterrow Hill<br/>Bowbridge, Stroud<br/>GL5 2EE</p><a href="tel:07484770941">07484 770941</a></div><div><h4>Quick Links</h4><Link href="/booking">Book Online</Link><Link href="/cars">Cars for Sale</Link><Link href="/services">Workshop Services</Link><Link href="/dashboard">Liam Dashboard</Link></div></div></footer>
 <nav className="mobileNav"><Link href="/"><span>⌂</span>Home</Link><Link href="/cars"><span>◇</span>Cars</Link><Link href="/booking"><span>＋</span>Book</Link><a href="tel:07484770941"><span>☎</span>Call</a></nav>
 </body></html>
}
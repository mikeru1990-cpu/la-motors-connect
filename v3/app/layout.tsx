import './globals.css';
import './dashboard.css';
import './photo.css';
import Link from 'next/link';

export const metadata={title:'L.A Motors Stroud Ltd',description:'Automotive specialists, workshop services and quality used vehicles in Stroud.'};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>
 <header className="siteHeader"><div className="shell navWrap"><Link href="/" className="brandImageLink"><img src="/la-motors-brand.svg" alt="L.A Motors Stroud Ltd" className="brandImage"/></Link><nav><Link href="/">Home</Link><Link href="/services">Services</Link><Link href="/cars">Showroom</Link><Link href="/booking">Book a Service</Link><Link href="/dashboard">Garage Dashboard</Link><a className="navPhone" href="tel:07484770941">07484 770941</a><Link className="navCta" href="/booking">Book a Service</Link></nav></div></header>
 {children}
 <footer><div className="shell footerGrid"><div><img src="/la-motors-brand.svg" alt="L.A Motors Stroud Ltd" className="footerLogo"/><p>Automotive specialists for car keys, air conditioning, diagnostics, repairs, servicing and quality used vehicles.</p></div><div><h4>Visit & Contact</h4><p>Unit 2 Butterrow Hill<br/>Bowbridge, Stroud<br/>GL5 2EE</p><a href="tel:07484770941">07484 770941</a></div><div><h4>Quick Links</h4><Link href="/cars">Vehicle Showroom</Link><Link href="/booking">Book a Service</Link><Link href="/services">Workshop Services</Link><Link href="/dashboard">Liam's Dashboard</Link></div></div></footer>
 <nav className="mobileNav"><Link href="/"><span>⌂</span>Home</Link><Link href="/cars"><span>▱</span>Showroom</Link><Link href="/booking" className="mobilePrimary"><span>＋</span>Book</Link><Link href="/services"><span>⌕</span>Services</Link><a href="tel:07484770941"><span>☎</span>Call</a></nav>
 </body></html>
}

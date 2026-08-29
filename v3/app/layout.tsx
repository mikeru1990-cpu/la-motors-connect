import './globals.css';
import './dashboard.css';
import './photo.css';
import './showroom.css';
import './premium.css';
import './unified.css';
import './operations.css';
import './customer-portal.css';
import './services/services.css';
import './mobile-refinement.css';
import './quality-pass.css';
import './premium-v2.css';
import Link from 'next/link';
import {BRAND_IMAGE} from './brand-image';

export const metadata={title:'L.A Motors Stroud Ltd',description:'Automotive specialists, workshop services and quality used vehicles in Stroud.'};

function BrandMark(){return <div className="brandSystem"><img className="brandImageOfficial" src={BRAND_IMAGE} alt="L.A Motors Stroud Ltd — Automotive Specialists"/></div>}

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>
 <div className="utilityBar"><div className="shell utilityInner"><span>Car Keys · Air Conditioning · Diagnostics · Repairs · Servicing</span><div><span>Unit 2 Butterrow Hill, Bowbridge, Stroud, GL5 2EE</span><a href="tel:07484770941">07484 770941</a></div></div></div>
 <header className="siteHeader"><div className="shell navWrap"><Link href="/" className="brandLockup" aria-label="L.A Motors Stroud Ltd home"><BrandMark/></Link><nav><Link href="/">Home</Link><Link href="/cars">Used Cars</Link><Link href="/services">Services</Link><Link href="/booking">Book Online</Link><Link className="customerLoginLink" href="/my-garage">My Garage</Link><a className="navPhone" href="tel:07484770941">07484 770941</a><Link className="navCta" href="/booking">Book a Service</Link></nav></div></header>
 {children}
 <footer><div className="shell footerGrid"><div><div className="footerBrand"><BrandMark/></div><p>Car keys, air conditioning, diagnostics, repairs, servicing and quality used vehicles in Stroud.</p></div><div><h4>Visit & Contact</h4><p>Unit 2 Butterrow Hill<br/>Bowbridge, Stroud<br/>GL5 2EE</p><a href="tel:07484770941">07484 770941</a></div><div><h4>Quick Links</h4><Link href="/cars">Vehicle Showroom</Link><Link href="/booking">Book a Service</Link><Link href="/services">Workshop Services</Link><Link href="/my-garage">My Garage / Customer Login</Link><Link href="/dashboard" className="staffLoginLink">Staff Login</Link></div></div></footer>
 <nav className="mobileNav"><Link href="/"><span>⌂</span>Home</Link><Link href="/cars"><span>▱</span>Cars</Link><Link href="/booking" className="mobilePrimary"><span>＋</span>Book</Link><Link href="/services"><span>⌕</span>Services</Link><Link href="/my-garage"><span>♙</span>My Garage</Link></nav>
 </body></html>
}

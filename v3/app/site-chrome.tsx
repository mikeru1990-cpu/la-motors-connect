'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BRAND_IMAGE} from './brand-image';

const nav=[
 {href:'/',label:'Home',short:'Home',icon:'⌂'},
 {href:'/services',label:'Services',short:'Services',icon:'⚙'},
 {href:'/booking',label:'Book Online',short:'Book',icon:'＋'},
 {href:'/cars',label:'Used Cars',short:'Cars',icon:'◇'},
 {href:'/my-garage',label:'My Garage',short:'Garage',icon:'○'}
];
function active(path:string,href:string){return href==='/'?path==='/':path===href||path.startsWith(href+'/')}
function Brand(){return <div className="brandSystem"><img className="brandImageOfficial" src={BRAND_IMAGE} alt="L.A Motors Stroud Ltd — Automotive Specialists"/></div>}

export default function SiteChrome({children}:{children:React.ReactNode}){
 const path=usePathname();
 const staff=path.startsWith('/dashboard');
 if(staff)return <>{children}</>;
 return <>
  <div className="utilityBar"><div className="shell utilityInner"><span>Automotive Specialists · Stroud</span><div><span className="utilityAddress">Unit 2 Butterrow Hill, Bowbridge, GL5 2EE</span><a href="tel:07484770941">07484 770941</a></div></div></div>
  <header className="siteHeader"><div className="shell navWrap"><Link href="/" className="brandLockup" aria-label="L.A Motors home"><Brand/></Link><nav className="desktopNav" aria-label="Main navigation">{nav.map(n=><Link key={n.href} href={n.href} className={`${active(path,n.href)?'navActive ':''}${n.href==='/booking'?'navBook':''}`}>{n.label}</Link>)}<a className="navCall" href="tel:07484770941">07484 770941</a></nav></div></header>
  {children}
  <footer><div className="shell footerGrid"><div className="footerIntro"><div className="footerBrand"><Brand/></div><p>Car keys, air conditioning, diagnostics, repairs, servicing and quality used vehicles in Stroud.</p><div className="footerTrust"><span>Fully insured</span><span>Professional equipment</span><span>Local independent garage</span></div></div><div><h4>Explore</h4><Link href="/services">Services</Link><Link href="/booking">Book online</Link><Link href="/cars">Used cars</Link><Link href="/my-garage">My Garage</Link></div><div><h4>Contact</h4><p>Unit 2 Butterrow Hill<br/>Bowbridge, Stroud<br/>GL5 2EE</p><a href="tel:07484770941">07484 770941</a><Link href="/dashboard" className="staffLoginLink">Staff login</Link></div></div></footer>
  <nav className="mobileNav" aria-label="Mobile navigation">{nav.map(n=><Link key={n.href} href={n.href} className={`${active(path,n.href)?'mobileActive ':''}${n.href==='/booking'?'mobileBook':''}`} aria-current={active(path,n.href)?'page':undefined}><span className="mobileNavIcon">{n.icon}</span><b>{n.short}</b></Link>)}</nav>
 </>
}

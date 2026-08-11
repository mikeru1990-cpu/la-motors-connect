import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'L.A Motors Stroud Ltd',
  description: 'Workshop services, online booking and cars for sale in Stroud.'
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><header className="siteHeader"><div className="shell navWrap"><Link href="/" className="brand"><span className="logo">L.A</span><span><b>L.A MOTORS</b><small>STROUD LTD · AUTOMOTIVE SPECIALISTS</small></span></Link><nav><Link href="/services">Services</Link><Link href="/cars">Cars for Sale</Link><Link href="/booking">Book Online</Link><Link href="/dashboard">Liam Dashboard</Link></nav></div></header>{children}<footer><div className="shell"><b>L.A Motors Stroud Ltd</b><p>Unit 2 Butterrow Hill, Bowbridge, Stroud, GL5 2EE · 07484 770941</p></div></footer></body></html>
}
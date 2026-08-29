import Link from 'next/link';
import './services.css';

const services=[
 {code:'KEY',name:'Car Keys',price:'From £69',sub:'Blade £69 · Remote £99',text:'Replacement, spare and lost keys with cutting, coding and immobiliser programming.',book:'Car Keys',cta:'Book Car Keys'},
 {code:'A/C',name:'Air-Con Re-Gas',price:'From £50',sub:'R134a £50 · R1234yf £80',text:'Professional air-conditioning re-gas for older and newer refrigerant systems.',book:'Air-Con',cta:'Book Air-Con'},
 {code:'DIA',name:'Diagnostics',price:'Quote',sub:'Warning lights · electrical faults',text:'Fault finding for warning lights, electrical problems and issues that are hard to diagnose.',book:'Diagnostics',cta:'Book Diagnostics'},
 {code:'SRV',name:'Servicing',price:'Quote',sub:'Interim · full · maintenance',text:'Routine maintenance and servicing matched to the vehicle and its actual requirements.',book:'Servicing & Repairs',cta:'Book a Service'},
 {code:'REP',name:'Repairs',price:'Quote',sub:'Brakes · suspension · batteries',text:'Mechanical repairs with clear advice before work begins and pricing based on the job.',book:'Servicing & Repairs',cta:'Book a Repair'},
 {code:'MOT',name:'MOT',price:'Coming soon',sub:'Register interest now',text:'MOT testing is planned. Leave your details and L.A Motors can contact you when bookings open.',book:'MOT Interest',cta:'Register Interest'}
];

export default function Services(){return <main className="servicesPage">
<section className="servicesHero"><div className="shell servicesHeroInner"><div className="servicesHeroCopy"><span className="servicesKicker">WORKSHOP SERVICES</span><h1>Choose the job.<br/><span>We’ll handle the rest.</span></h1><p>Clear service choices, guide pricing where available and a direct route into booking.</p><div className="servicesHeroActions"><Link href="/booking" className="servicesPrimary">BOOK WORK</Link><a href="tel:07484770941" className="servicesSecondary">CALL LIAM</a></div></div><aside className="servicesHeroPanel"><span>NOT SURE WHAT TO BOOK?</span><h2>Describe the problem.</h2><p>Noise, warning light, starting issue or something that just does not feel right?</p><Link href="/booking?service=Diagnostics">Start with Diagnostics <b>→</b></Link></aside></div></section>

<section className="shell servicesFeatured"><article><div><span>CAR KEYS</span><h2>Cut & programmed.</h2><p>Fast local key replacement and coding.</p></div><div className="featuredPrices"><div><small>Blade keys</small><b>£69</b></div><div><small>Remote keys</small><b>£99</b></div></div><Link href="/booking?service=Car%20Keys">Book Car Keys →</Link></article><article><div><span>AIR-CON RE-GAS</span><h2>Keep your cool.</h2><p>Professional re-gas with both common refrigerant types.</p></div><div className="featuredPrices"><div><small>R134a</small><b>£50</b></div><div><small>R1234yf</small><b>£80</b></div></div><Link href="/booking?service=Air-Con">Book Air-Con →</Link></article></section>

<section className="shell servicesCatalogue"><div className="servicesSectionHead"><span>FULL WORKSHOP MENU</span><div><h2>What does your car need?</h2><p>Tap a service to go straight into the booking form with that job already selected.</p></div></div><div className="serviceRows">{services.map((s,i)=><article className="serviceRowPremium" key={s.name}><div className="serviceNumber">{String(i+1).padStart(2,'0')}</div><div className="serviceCodePremium">{s.code}</div><div className="serviceRowCopy"><h3>{s.name}</h3><p>{s.text}</p><small>{s.sub}</small></div><div className="serviceRowPrice">{s.price}</div><Link href={`/booking?service=${encodeURIComponent(s.book)}`} className="serviceRowCta">{s.cta}<span>→</span></Link></article>)}</div></section>

<section className="servicesConfidence"><div className="shell servicesConfidenceInner"><span>FULLY INSURED</span><span>PROFESSIONAL EQUIPMENT</span><span>EXPERIENCED TECHNICIANS</span><span>LOCAL STROUD GARAGE</span></div></section>
<section className="shell servicesFinal"><div><span>NEED ADVICE FIRST?</span><h2>Speak to Liam before you book.</h2><p>If you are unsure what the vehicle needs, call and explain the symptoms.</p></div><a href="tel:07484770941" className="servicesPrimary">07484 770941</a></section>
</main>}

import Link from 'next/link';
import {getSupabase} from '../../lib/supabase';
import {DEMO_STOCK} from '../../lib/demo-stock';

export default async function Cars(){
 const supabase=getSupabase();let managedCars:any[]=[];
 if(supabase){const {data}=await supabase.from('stock_vehicles').select('slug,make,model,derivative,year,price,mileage,fuel,gearbox,featured,status,image_urls').order('created_at',{ascending:false});managedCars=data||[]}
 const managedKeys=new Set(managedCars.map(c=>`${String(c.make).toLowerCase()}|${String(c.model).toLowerCase()}|${c.year||''}`));
 const liveCars=managedCars.filter(c=>['available','reserved'].includes(c.status));
 const demoCars=DEMO_STOCK.filter(c=>!managedKeys.has(`${c.make.toLowerCase()}|${c.model.toLowerCase()}|${c.year||''}`)).map(c=>({...c,externalOnly:true}));
 const cars=[...liveCars,...demoCars];
 return <main className="showroomPage">
  <section className="showroomHero"><div className="shell showroomHeroCompact"><span className="premiumEyebrow">L.A Motors Vehicle Sales</span><h1>Cars for sale</h1><p>Current advertised stock with clear pricing and a direct route to arrange a viewing.</p><div className="showroomHeroActions"><a href="tel:07484770941" className="premiumBtn">Call 07484 770941</a><Link href="/booking?service=Vehicle%20Viewing" className="premiumBtn primary">Book a viewing</Link></div></div></section>
  <section className="shell showroomContent">
   <div className="showroomCount"><span>{cars.length} vehicle{cars.length===1?'':'s'} advertised</span><span>Live website stock + demo adverts</span></div>
   <div className="showroomGrid">{cars.map((c:any)=><article className={`showroomCard ${c.externalOnly?'advertCard':''}`} key={c.slug}>
    <Link href={`/cars/${c.slug}`} className="showroomImage">{c.image_urls?.[0]?<><img src={c.image_urls[0]} alt={`${c.make} ${c.model}`}/>{c.demoPhoto&&<span className="demoPhotoFlag">Demo image</span>}</>:<div className="advertNoPhoto"><span>L.A MOTORS</span><strong>{c.make}</strong><small>Tap for full advert</small></div>}<span className={`showroomBadge ${c.status}`}>{c.status==='reserved'?'Reserved':'Available'}</span></Link>
    <div className="showroomBody"><div className="advertMeta"><span>{c.source||'L.A Motors stock'}</span>{c.registration&&<b>{c.registration}</b>}</div><span className="premiumEyebrow">{c.year||'Year not shown'} · {c.fuel||'Fuel TBC'}</span><h2>{c.make} {c.model}</h2><p>{c.derivative||'Vehicle details available on request'}</p><div className="showroomSpecs"><span>{c.mileage?`${Number(c.mileage).toLocaleString()} miles`:'Mileage on request'}</span>{c.gearbox&&<span>{c.gearbox}</span>}</div><div className="showroomPrice">{c.price?`£${Number(c.price).toLocaleString()}`:'POA'}</div><div className="showroomActions"><Link href={`/cars/${c.slug}`} className="premiumBtn primary">View Advert</Link><a href="tel:07484770941" className="premiumBtn">Call Liam</a></div></div>
   </article>)}</div>
   <div className="showroomRequest"><div><span className="premiumEyebrow">Looking for something specific?</span><h2>Tell Liam what you need.</h2><p>Call with your budget, preferred make/model and any must-have requirements.</p></div><a className="premiumBtn primary" href="tel:07484770941">Call 07484 770941</a></div>
  </section>
 </main>
}

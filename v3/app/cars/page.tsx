import Link from 'next/link';
import {getSupabase} from '../../lib/supabase';

const advertisedStock=[
 {slug:'seat-arona-2021-10-petrol',make:'SEAT',model:'Arona',derivative:'1.0 petrol',year:2021,price:11995,mileage:21346,fuel:'Petrol',gearbox:null,featured:true,status:'available',image_urls:[],source:'Facebook advert',registration:'YJ21 AKA'},
 {slug:'kia-sportage-2017-17-diesel',make:'Kia',model:'Sportage',derivative:'1.7 diesel',year:2017,price:7495,mileage:92487,fuel:'Diesel',gearbox:null,featured:false,status:'available',image_urls:[],source:'Facebook advert',registration:null},
 {slug:'mini-paceman-2014-20-diesel',make:'MINI',model:'Paceman',derivative:'2.0 diesel',year:2014,price:4795,mileage:94786,fuel:'Diesel',gearbox:null,featured:false,status:'available',image_urls:[],source:'Facebook advert',registration:null},
 {slug:'mercedes-c220-21-diesel',make:'Mercedes-Benz',model:'C220',derivative:'2.1 diesel',year:null,price:4295,mileage:102789,fuel:'Diesel',gearbox:null,featured:false,status:'available',image_urls:[],source:'Facebook advert',registration:null},
 {slug:'peugeot-3008-16-diesel',make:'Peugeot',model:'3008',derivative:'1.6 diesel',year:null,price:2795,mileage:95103,fuel:'Diesel',gearbox:null,featured:false,status:'available',image_urls:[],source:'Facebook advert',registration:null},
 {slug:'renault-megane-hy14xkk',make:'Renault',model:'Megane',derivative:'1.5 dCi ENERGY Knight Edition Euro 5 (s/s) 5dr',year:2014,price:2795,mileage:null,fuel:'Diesel',gearbox:null,featured:false,status:'available',image_urls:[],source:'Auto Trader advert',registration:'HY14 XKK'}
];

export default async function Cars(){
 const supabase=getSupabase();let liveCars:any[]=[];
 if(supabase){const {data}=await supabase.from('stock_vehicles').select('slug,make,model,derivative,year,price,mileage,fuel,gearbox,featured,status,image_urls').in('status',['available','reserved']).order('featured',{ascending:false}).order('created_at',{ascending:false});liveCars=data||[]}
 const liveKeys=new Set(liveCars.map(c=>`${String(c.make).toLowerCase()}|${String(c.model).toLowerCase()}|${c.year||''}`));
 const externalCars=advertisedStock.filter(c=>!liveKeys.has(`${c.make.toLowerCase()}|${c.model.toLowerCase()}|${c.year||''}`)).map(c=>({...c,externalOnly:true}));
 const cars=[...liveCars,...externalCars];
 return <main className="showroomPage">
  <section className="showroomHero"><div className="shell showroomHeroCompact"><span className="premiumEyebrow">L.A Motors Vehicle Sales</span><h1>Cars for sale</h1><p>Current advertised stock with clear pricing and a direct route to arrange a viewing.</p><div className="showroomHeroActions"><a href="tel:07484770941" className="premiumBtn">Call 07484 770941</a><Link href="/booking?service=Vehicle%20Viewing" className="premiumBtn primary">Book a viewing</Link></div></div></section>
  <section className="shell showroomContent">
   <div className="showroomCount"><span>{cars.length} vehicle{cars.length===1?'':'s'} advertised</span><span>Live website stock + verified adverts</span></div>
   <div className="showroomGrid">{cars.map((c:any)=><article className={`showroomCard ${c.externalOnly?'advertCard':''}`} key={c.slug}>
    <div className="showroomImage">{c.image_urls?.[0]?<img src={c.image_urls[0]} alt={`${c.make} ${c.model}`}/>:<div className="advertNoPhoto"><span>L.A MOTORS</span><strong>{c.make}</strong><small>Vehicle photos available on request</small></div>}<span className={`showroomBadge ${c.status}`}>{c.status==='reserved'?'Reserved':'Available'}</span></div>
    <div className="showroomBody"><div className="advertMeta"><span>{c.source||'L.A Motors stock'}</span>{c.registration&&<b>{c.registration}</b>}</div><span className="premiumEyebrow">{c.year||'Year not shown'} · {c.fuel||'Fuel TBC'}</span><h2>{c.make} {c.model}</h2><p>{c.derivative||'Vehicle details available on request'}</p><div className="showroomSpecs"><span>{c.mileage?`${Number(c.mileage).toLocaleString()} miles`:'Mileage on request'}</span>{c.gearbox&&<span>{c.gearbox}</span>}</div><div className="showroomPrice">{c.price?`£${Number(c.price).toLocaleString()}`:'POA'}</div><div className="showroomActions">{c.externalOnly?<Link href="/booking?service=Vehicle%20Viewing" className="premiumBtn primary">Arrange Viewing</Link>:<Link href={`/cars/${c.slug}`} className="premiumBtn primary">View Vehicle</Link>}<a href="tel:07484770941" className="premiumBtn">Call Liam</a></div></div>
   </article>)}</div>
   <div className="showroomRequest"><div><span className="premiumEyebrow">Looking for something specific?</span><h2>Tell Liam what you need.</h2><p>Call with your budget, preferred make/model and any must-have requirements.</p></div><a className="premiumBtn primary" href="tel:07484770941">Call 07484 770941</a></div>
  </section>
 </main>
}

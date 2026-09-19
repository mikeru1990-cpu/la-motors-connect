'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {getBrowserSupabase} from '../../../lib/supabase-browser';

type Booking={
 id:string;user_id:string|null;service:string;registration:string;vehicle:string;preferred_date:string;
 customer_name:string;phone:string;notes:string;status:string;created_at:string
};

function niceDate(v:string){const d=new Date(`${v}T12:00:00`);return Number.isNaN(d.getTime())?v:d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
function phoneLink(v:string){return (v||'').replace(/[^0-9+]/g,'')}
function whatsappPhone(v:string){const p=phoneLink(v);return p.startsWith('0')?`44${p.slice(1)}`:p.replace(/^\+/,'')}

export default function BookingInbox(){
 const supabase=useMemo(()=>getBrowserSupabase(),[]);
 const[ready,setReady]=useState(false),[staff,setStaff]=useState(false),[bookings,setBookings]=useState<Booking[]>([]);
 const[filter,setFilter]=useState('pending'),[working,setWorking]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{(async()=>{if(!supabase){setReady(true);return}const{data:s}=await supabase.auth.getSession();if(!s.session){setReady(true);return}const{data:isStaff}=await supabase.rpc('is_staff');setStaff(!!isStaff);if(isStaff)await load();setReady(true)})()},[supabase]);

 async function load(){if(!supabase)return;setMessage('');const{data,error}=await supabase.from('bookings').select('*').order('created_at',{ascending:false}).limit(200);if(error)setMessage(error.message);else setBookings((data||[]) as Booking[])}

 async function updateBooking(id:string,changes:Partial<Booking>,note:string){if(!supabase)return;setWorking(id);const{error}=await supabase.from('bookings').update(changes).eq('id',id);setWorking('');if(error)return setMessage(error.message);setBookings(v=>v.map(b=>b.id===id?{...b,...changes}:b));setMessage(note)}

 async function createJob(b:Booking){
  if(!supabase)return;setWorking(b.id);setMessage('');
  try{
   const existing=await supabase.from('job_cards').select('id').eq('booking_id',b.id).maybeSingle();
   if(existing.data){await supabase.from('bookings').update({status:'confirmed'}).eq('id',b.id);setMessage('This request already has a job card. Booking marked confirmed.');await load();return}
   let customerId:string|null=null;
   const ec=await supabase.from('customers').select('id').eq('phone',b.phone).limit(1).maybeSingle();
   if(ec.data?.id)customerId=ec.data.id;
   else{const c=await supabase.from('customers').insert({name:b.customer_name,phone:b.phone}).select('id').single();if(c.error)throw c.error;customerId=c.data.id}
   const reg=b.registration.trim().toUpperCase();
   let vehicleId:string|null=null;
   const ev=await supabase.from('vehicles').select('id').eq('registration',reg).limit(1).maybeSingle();
   if(ev.data?.id)vehicleId=ev.data.id;
   else{const parts=b.vehicle.trim().split(/\s+/);const v=await supabase.from('vehicles').insert({customer_id:customerId,registration:reg,make:parts[0]||null,model:parts.slice(1).join(' ')||null}).select('id').single();if(v.error)throw v.error;vehicleId=v.data.id}
   const j=await supabase.from('job_cards').insert({customer_id:customerId,vehicle_id:vehicleId,booking_id:b.id,customer_name:b.customer_name,phone:b.phone,registration:reg,vehicle:b.vehicle||'',job_type:b.service,description:b.notes||'',scheduled_date:b.preferred_date,status:'booked'});
   if(j.error)throw j.error;
   const u=await supabase.from('bookings').update({status:'confirmed'}).eq('id',b.id);if(u.error)throw u.error;
   setMessage('Booking confirmed and workshop job created.');
   await load();
  }catch(e:any){setMessage(e?.message||'Could not confirm this booking.')}finally{setWorking('')}
 }

 const counts={pending:bookings.filter(b=>b.status==='pending').length,confirmed:bookings.filter(b=>b.status==='confirmed').length,cancelled:bookings.filter(b=>b.status==='cancelled').length};
 const shown=bookings.filter(b=>filter==='all'||b.status===filter);

 if(!ready)return <main className="dashLoading">Loading booking inbox…</main>;
 if(!staff)return <main className="dashLogin"><div className="customerCard"><h1>Staff sign-in required</h1><p>Customer booking requests are private.</p><Link className="customerPrimary" href="/dashboard">Staff Login</Link></div></main>;

 return <main className="bookingInbox">
  <header className="workshopJobsTop">
   <div><Link href="/dashboard">← Today</Link><span className="premiumEyebrow">Customer Requests</span><h1>Booking Inbox</h1><p>Review new requests, contact the customer and turn approved work into a job card.</p></div>
   <div><Link href="/dashboard/schedule">Diary</Link><Link href="/dashboard/jobs">Jobs</Link><button onClick={load}>↻ Refresh</button></div>
  </header>
  {message&&<div className="workshopNotice">{message}</div>}
  <section className="bookingInboxTabs">
   <button className={filter==='pending'?'active':''} onClick={()=>setFilter('pending')}><b>{counts.pending}</b><span>New</span></button>
   <button className={filter==='confirmed'?'active':''} onClick={()=>setFilter('confirmed')}><b>{counts.confirmed}</b><span>Confirmed</span></button>
   <button className={filter==='cancelled'?'active':''} onClick={()=>setFilter('cancelled')}><b>{counts.cancelled}</b><span>Cancelled</span></button>
   <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}><b>{bookings.length}</b><span>All</span></button>
  </section>
  <section className="bookingInboxList">
   {shown.length===0?<div className="workshopEmpty">No booking requests in this view.</div>:shown.map(b=>{
    const tel=phoneLink(b.phone),wp=whatsappPhone(b.phone);
    const msg=`Hi ${b.customer_name}, it's Liam from L.A Motors regarding your ${b.service} request for ${b.registration}. Your preferred date is ${niceDate(b.preferred_date)}.`;
    return <article className={`bookingInboxCard booking-${b.status}`} key={b.id}>
     <div className="bookingInboxMain">
      <div className="bookingInboxVehicle"><span className="workshopPlate">{b.registration||'NO REG'}</span><div><span className={`statusTag ${b.status}`}>{b.status.replaceAll('_',' ')}</span><h2>{b.service}</h2><p>{b.vehicle||'Vehicle details not supplied'}</p></div></div>
      <div className="bookingInboxCustomer"><small>CUSTOMER</small><b>{b.customer_name}</b><span>{b.phone}</span><div>{tel&&<a href={`tel:${tel}`}>Call</a>}{wp&&<a target="_blank" rel="noreferrer" href={`https://wa.me/${wp}?text=${encodeURIComponent(msg)}`}>WhatsApp</a>}</div></div>
      <div className="bookingInboxDate"><small>PREFERRED DATE</small><b>{niceDate(b.preferred_date)}</b>{b.status==='pending'?<input type="date" defaultValue={b.preferred_date} onBlur={e=>{if(e.target.value&&e.target.value!==b.preferred_date)updateBooking(b.id,{preferred_date:e.target.value},'Preferred date updated.')}}/>:<span>{b.preferred_date}</span>}</div>
     </div>
     {b.notes&&<div className="bookingInboxNotes"><small>CUSTOMER NOTES</small><p>{b.notes}</p></div>}
     <div className="bookingInboxActions">
      {b.status==='pending'&&<button className="bookingConfirm" disabled={working===b.id} onClick={()=>createJob(b)}>{working===b.id?'Creating…':'Confirm + Create Job'}</button>}
      {b.status==='pending'&&<button className="bookingCancel" disabled={working===b.id} onClick={()=>updateBooking(b.id,{status:'cancelled'},'Booking request cancelled.')}>Decline / Cancel</button>}
      {b.status==='cancelled'&&<button disabled={working===b.id} onClick={()=>updateBooking(b.id,{status:'pending'},'Booking moved back to new requests.')}>Reopen Request</button>}
      {b.status==='confirmed'&&<Link href="/dashboard/jobs">Open Job Cards →</Link>}
     </div>
    </article>
   })}
  </section>
  <nav className="ownerMobileNav"><Link href="/dashboard"><b>⌂</b><span>Today</span></Link><Link href="/dashboard/bookings"><b>✉</b><span>Requests</span></Link><Link href="/dashboard/jobs"><b>🔧</b><span>Jobs</span></Link><Link href="/dashboard/stock"><b>🚗</b><span>Stock</span></Link><Link href="/dashboard/finance"><b>£</b><span>Money</span></Link></nav>
 </main>
}

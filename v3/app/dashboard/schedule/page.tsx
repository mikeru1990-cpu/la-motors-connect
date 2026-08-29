'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {getBrowserSupabase} from '../../../lib/supabase-browser';

type Job={id:string;customer_name:string;registration:string;vehicle:string;job_type:string;scheduled_date:string;status:string;description:string};

type Booking={id:string;customer_name:string;registration:string;vehicle:string;service:string;preferred_date:string;status:string;notes:string};

function dayKey(v?:string){if(!v)return 'Unscheduled';const d=new Date(v);return Number.isNaN(d.getTime())?v:d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'});}

export default function SchedulePage(){
 const supabase=useMemo(()=>getBrowserSupabase(),[]);
 const[ready,setReady]=useState(false),[jobs,setJobs]=useState<Job[]>([]),[bookings,setBookings]=useState<Booking[]>([]),[error,setError]=useState('');
 useEffect(()=>{(async()=>{if(!supabase){setReady(true);return}const[{data:j,error:je},{data:b,error:be}]=await Promise.all([supabase.from('job_cards').select('id,customer_name,registration,vehicle,job_type,scheduled_date,status,description').order('scheduled_date',{ascending:true}),supabase.from('bookings').select('id,customer_name,registration,vehicle,service,preferred_date,status,notes').in('status',['pending','confirmed']).order('preferred_date',{ascending:true})]);if(je||be)setError((je||be)?.message||'Could not load schedule');setJobs((j||[]) as Job[]);setBookings((b||[]) as Booking[]);setReady(true)})()},[supabase]);
 if(!ready)return <main className="dashLoading">Loading Liam's schedule…</main>;
 const items=[...jobs.map(j=>({id:'j'+j.id,date:j.scheduled_date,title:j.job_type,customer:j.customer_name,reg:j.registration,vehicle:j.vehicle,status:j.status,kind:'Job'})),...bookings.map(b=>({id:'b'+b.id,date:b.preferred_date,title:b.service,customer:b.customer_name,reg:b.registration,vehicle:b.vehicle,status:b.status,kind:'Booking'}))].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
 const groups=items.reduce((m,item)=>{const k=dayKey(item.date);(m[k]??=[]).push(item);return m},{} as Record<string,typeof items>);
 return <main className="schedulePage"><div className="scheduleShell"><header className="scheduleTop"><div><span className="premiumEyebrow">Liam's working diary</span><h1>Schedule</h1><p>Bookings and live job cards in one view.</p></div><div className="scheduleActions"><Link href="/dashboard" className="premiumBtn">← Dashboard</Link><Link href="/booking" className="premiumBtn primary">Add Booking</Link></div></header>{error&&<p className="formError">{error}</p>}<div className="scheduleGrid">{Object.keys(groups).length===0?<section className="scheduleDay"><h2>No work scheduled</h2><p className="emptyState">New bookings and job cards will appear here.</p></section>:Object.entries(groups).map(([day,rows])=><section className="scheduleDay" key={day}><div className="scheduleDayHead"><h2>{day}</h2><span>{rows.length} {rows.length===1?'item':'items'}</span></div>{rows.map(r=><article className="scheduleItem" key={r.id}><div className="scheduleMarker"/><div><small>{r.kind}</small><h3>{r.title}</h3><p>{r.customer} · {r.reg||'No reg'}{r.vehicle?` · ${r.vehicle}`:''}</p></div><em className={`statusTag ${r.status}`}>{r.status.replace('_',' ')}</em></article>)}</section>)}</div></div></main>;
}

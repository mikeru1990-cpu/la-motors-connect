import {NextResponse} from 'next/server';
import {getSupabase} from '../../../lib/supabase';

const allowedServices=new Set(['Car Keys','Air-Con','Diagnostics','Servicing & Repairs','MOT Interest','Vehicle Viewing']);
function londonToday(){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=(type:string)=>parts.find(p=>p.type===type)?.value||'';return `${get('year')}-${get('month')}-${get('day')}`}
function text(value:unknown,max:number){return String(value??'').trim().slice(0,max)}

export async function POST(request:Request){
  try{
    const body=await request.json();
    const service=text(body.service,80),registration=text(body.registration,24).toUpperCase(),preferredDate=text(body.preferred_date,10),customerName=text(body.customer_name,120),phone=text(body.phone,40),vehicle=text(body.vehicle,160),notes=text(body.notes,2000);
    if(!service||!registration||!preferredDate||!customerName||!phone)return NextResponse.json({ok:false,error:'Please complete all required booking details.'},{status:400});
    if(!allowedServices.has(service))return NextResponse.json({ok:false,error:'Please choose a valid L.A Motors service.'},{status:400});
    if(!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate))return NextResponse.json({ok:false,error:'Please choose a valid preferred date.'},{status:400});
    if(preferredDate<londonToday())return NextResponse.json({ok:false,error:'Please choose today or a future date.'},{status:400});
    if(customerName.length<2)return NextResponse.json({ok:false,error:'Please enter your name.'},{status:400});
    if(phone.replace(/\D/g,'').length<7)return NextResponse.json({ok:false,error:'Please enter a valid contact number.'},{status:400});
    if(service!=='Vehicle Viewing'&&registration.length<5)return NextResponse.json({ok:false,error:'Please enter a valid vehicle registration.'},{status:400});
    if(service==='Vehicle Viewing'&&!vehicle)return NextResponse.json({ok:false,error:'Please select or enter the vehicle you want to view.'},{status:400});

    const supabase=getSupabase();
    if(!supabase)return NextResponse.json({ok:false,error:'Booking service is temporarily unavailable. Please call Liam on 07484 770941.'},{status:503});
    const payload={service,registration,vehicle,preferred_date:preferredDate,customer_name:customerName,phone,notes,status:'pending'};
    const {error}=await supabase.from('bookings').insert(payload);
    if(error){
      console.error('Booking insert failed',{code:error.code,message:error.message,details:error.details,hint:error.hint});
      const policy=error.code==='42501';
      return NextResponse.json({ok:false,error:policy?'Online booking permission needs refreshing. Please call Liam on 07484 770941.':'We could not save the booking just now. Please try again or call Liam on 07484 770941.',code:error.code},{status:500});
    }
    return NextResponse.json({ok:true,message:'Booking request received.'});
  }catch(error){
    console.error('Booking request failed',error);
    return NextResponse.json({ok:false,error:'We could not send that request. Please try again or call Liam on 07484 770941.'},{status:400});
  }
}

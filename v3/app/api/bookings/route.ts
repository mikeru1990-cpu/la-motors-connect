import {NextResponse} from 'next/server';
import {getSupabase} from '../../../lib/supabase';

export async function POST(request:Request){
  try{
    const body=await request.json();
    const required=['service','registration','preferred_date','customer_name','phone'];
    for(const field of required){
      if(!String(body[field]??'').trim())return NextResponse.json({ok:false,error:`Please complete ${field.replace('_',' ')}.`},{status:400});
    }
    const supabase=getSupabase();
    if(!supabase)return NextResponse.json({ok:false,error:'Booking service is temporarily unavailable. Please call Liam on 07484 770941.'},{status:503});
    const payload={service:String(body.service).trim(),registration:String(body.registration).trim().toUpperCase(),vehicle:String(body.vehicle??'').trim(),preferred_date:String(body.preferred_date),customer_name:String(body.customer_name).trim(),phone:String(body.phone).trim(),notes:String(body.notes??'').trim(),status:'pending'};
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

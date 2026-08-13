import {NextResponse} from 'next/server';
import {getSupabase} from '../../../lib/supabase';

export async function POST(request:Request){
  try{
    const body=await request.json();
    const required=['service','registration','preferred_date','customer_name','phone'];
    for(const field of required){
      if(!String(body[field]??'').trim())return NextResponse.json({ok:false,error:`Missing ${field}`},{status:400});
    }
    const supabase=getSupabase();
    if(!supabase)return NextResponse.json({ok:false,error:'Supabase is not configured yet.'},{status:503});
    const payload={
      service:String(body.service),
      registration:String(body.registration).toUpperCase(),
      vehicle:String(body.vehicle??''),
      preferred_date:String(body.preferred_date),
      customer_name:String(body.customer_name),
      phone:String(body.phone),
      notes:String(body.notes??''),
      status:'pending'
    };
    const {data,error}=await supabase.from('bookings').insert(payload).select('id,status,created_at').single();
    if(error)return NextResponse.json({ok:false,error:'Could not save booking.'},{status:500});
    return NextResponse.json({ok:true,booking:data});
  }catch{
    return NextResponse.json({ok:false,error:'Invalid booking request.'},{status:400});
  }
}

'use client';
import {useState} from 'react';

export default function VehicleGallery({images}:{images:string[]}){
 const safe=images.filter(Boolean);const [active,setActive]=useState(0);
 if(safe.length===0)return <><div className="vehicleStage"><div className="carSilhouette largeCar"/><div className="photoBadge">Photos coming soon</div></div></>;
 return <><div className="vehicleStage vehiclePhotoStage"><img src={safe[active]} alt="Vehicle" className="vehicleMainPhoto"/></div><div className="thumbGrid">{safe.map((src,i)=><button key={src} className={`thumb photoThumb ${i===active?'active':''}`} onClick={()=>setActive(i)}><img src={src} alt={`Vehicle photo ${i+1}`}/></button>)}</div></>
}

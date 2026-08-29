import './globals.css';
import './dashboard.css';
import './photo.css';
import './showroom.css';
import './premium.css';
import './unified.css';
import './operations.css';
import './customer-portal.css';
import './services/services.css';
import './mobile-refinement.css';
import './quality-pass.css';
import './premium-v2.css';
import './navigation-system.css';
import SiteChrome from './site-chrome';

export const metadata={title:'L.A Motors Stroud Ltd',description:'Automotive specialists, workshop services and quality used vehicles in Stroud.'};

export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>
}

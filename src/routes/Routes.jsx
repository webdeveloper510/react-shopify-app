import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../components/home/Home';
import SideBar from '../components/sidebar/Sidebar';
import CampaignOver from '../components/pages/CampaignOver';
import CampaignNew from '../components/pages/CampaignNew';
import CampaignManage from '../components/pages/CampaignManage';
import CampaignMarket from '../components/pages/CampaignMarket.jsx';
import CouponList from '../components/pages/CouponList';
import Analytics from '../components/pages/Analytics';
import Sales from '../components/pages/Sales';
import Profile from '../components/pages/Profile';
import CreateCampaign from '../components/pages/CreateCampaign';
import CreateInfluencer from '../components/pages/CreateInfluencer';
import InfluencerSales from '../components/pages/InfluencerSales';
import StripeDetails from '../components/pages/StripeDetails';
import AdminTransfer from '../components/pages/AdminTransfer';
import Subscription from '../components/subscription/Subscription';
import Thankyou from '../components/pages/Thankyou';
import PaymentFailed from '../components/pages/PaymentFailed';

const Routing = () => {
  const location = useLocation();
  const shouldShowSideBar = location.pathname !== '/' && location.pathname !== '/dashboard' && location.pathname !== '/thankyou' && location.pathname !== '/payment-failed';
  return (
      
    <div className="routes">
      <Routes>
        <Route path='/' element={<Subscription />} />
        <Route exact path='/dashboard' element={<Subscription />} />
        <Route exact path='/thankyou' element={<Thankyou />} />
        <Route path='/payment-failed' element={<PaymentFailed />} />
      </Routes>
      {shouldShowSideBar && <SideBar />}
      <Routes>
        <Route path='/overview' element={<CampaignOver />} />
        <Route path='/create' element={<CampaignNew />} />
        <Route path='/manage' element={<CampaignManage />} />
        <Route path='/market' element={<CampaignMarket />} />
        <Route path='/create-coupon' element={<CouponList />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/sales' element={<Sales />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-campaign' element={<CreateCampaign />} />
        <Route path='/create-campaign/:id' element={<CreateCampaign />} />
        <Route path='/create-influencer' element={<CreateInfluencer />} />
        <Route path='/create-influencer/:id' element={<CreateInfluencer />} />
        <Route path='/influencer-sales' element={<InfluencerSales />} />
        <Route path='/stripe-details' element={<StripeDetails />} />
        <Route path='/transfer' element={<AdminTransfer />} />
      </Routes>
    </div>
  );
}

export default Routing;
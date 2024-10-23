import { useContext } from "react";

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Favour from "./pages/Favour/Favour";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { StoreContext } from "./context/StoreContext";
import PopupMessage from "./components/PopupMessage/PopupMessage";
import PopupConfirm from "./components/PopupConfirm/PopupConfirm";
import TrackingOrders from "./pages/TrackingOrders/TrackingOrders";
import FoodDetail from "./pages/FoodDetail/FoodDetail";
import VouchersPopup from "./components/VouchersPopup/VouchersPopup";
import AddressPopup from "./components/AddressPopup/AddressPopup";
import Page404 from "./pages/Page404/Page404";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import OrderDetail from "./pages/TrackingOrders/OrderDetail/OrderDetail";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import FeedBack from "./pages/FeedBack/FeedBack";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

const App = () => {
  const {
    showLogin,
    showPopupMessage,
    showPopupConfirm,
    showVouchersPopup,
    showAddressPopup,
    showLoadingPage,
  } = useContext(StoreContext);

  return (
    <>
      {showLoadingPage.show ? (
        <LoadingPage content={showLoadingPage.content} />
      ) : null}
      {showAddressPopup ? <AddressPopup /> : null}
      {showLogin ? <LoginPopup /> : null}
      {showPopupMessage.show ? (
        <PopupMessage
          message={showPopupMessage.message}
          iconImage={showPopupMessage.iconImage}
        />
      ) : null}
      {showPopupConfirm.show ? (
        <PopupConfirm
          message={showPopupConfirm.message}
          question={showPopupConfirm.question}
          onConfirm={showPopupConfirm.onConfirm}
          onCancel={showPopupConfirm.onCancel}
        />
      ) : null}

      {showVouchersPopup ? <VouchersPopup /> : null}
      <div className="app">
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment/:order_id" element={<PlaceOrder />} />
            <Route path="/favour" element={<Favour />} />
            <Route
              path="/tracking-orders/:order_id"
              element={<OrderDetail />}
            />
            <Route path="/forgot-pass" element={<ForgotPass />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/tracking-orders" element={<TrackingOrders />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/feedback/:order_id/:item_id" element={<FeedBack />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;

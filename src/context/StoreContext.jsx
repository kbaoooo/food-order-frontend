import { createContext } from "react";
import { useState } from "react";

export const StoreContext = createContext(null);

const StoreProvider = (props) => {
  const apiUrl = "http://localhost:4000/api";
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [totalSelectedFood, setTotalSelectedFood] = useState(0);
  const [selectedFood, setSelectedFood] = useState([]);
  const [showVouchersPopup, setShowVouchersPopup] = useState(false);
  const [updateTotalCart, setUpdateTotalCart] = useState(
    Math.random() + Date.now()
  );
  const [showLoadingPage, setShowLoadingPage] = useState({show: false, content: null});
  const [showPopupMessage, setShowPopupMessage] = useState({
    show: false,
    message: "",
    iconImage: null,
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showPopupConfirm, setShowPopupConfirm] = useState({
    show: false,
    message: "",
    question: "",
    onConfirm: null,
    onCancel: null,
  });
  const token = () => localStorage.getItem("token") || "";

  const handleShowPopupMessage = (info, duration, cb) => {
    setShowPopupMessage(info);
    const timeout = setTimeout(() => {
      setShowPopupMessage({ show: false, message: "", iconImage: null });

      if (cb && typeof cb === "function") {
        cb();
      }
    }, duration || 3000);

    return () => {
      clearTimeout(timeout);
    };
  };

  const calculateTotalChooseItem = (selectedItem) => {
    const total = selectedItem.reduce((acc, item) => {
      if (isNaN(item.quantity)) {
        return acc + item.price * 1;
      }
      return acc + item.price * item.quantity;
    }, 0);

    return total;
  };

  const contextValue = {
    apiUrl,
    token,
    showLogin,
    setShowLogin,
    showPopupMessage,
    handleShowPopupMessage,
    showPopupConfirm,
    setShowPopupConfirm,
    updateTotalCart,
    setUpdateTotalCart,
    showVouchersPopup,
    setShowVouchersPopup,
    selectedFood,
    setSelectedFood,
    totalSelectedFood,
    setTotalSelectedFood,
    calculateTotalChooseItem,
    appliedVoucher,
    setAppliedVoucher,
    showAddressPopup,
    setShowAddressPopup,
    phone,
    setPhone,
    address,
    setAddress,
    showLoadingPage,
    setShowLoadingPage,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

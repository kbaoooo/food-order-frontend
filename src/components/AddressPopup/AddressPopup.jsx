import "./AddressPopup.css";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function AddressPopup() {
  const {
    apiUrl,
    setShowAddressPopup,
    token,
    setShowPopupMessage,
    phone,
    setPhone,
    address,
    setAddress,
  } = useContext(StoreContext);
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [showError, setShowError] = useState({
    phone: false,
    address: false,
  });

  const TOKEN = token();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const result = response.data;

        if (result && result.success && result.data) {
          const { phone_number, address: addressFetch } = result.data;

          if (phone_number || addressFetch) {
            setShowCloseBtn(true);
          }

          setPhone(phone_number || "");
          setAddress(addressFetch || "");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChangePhone = (e) => {
    const regex = /^\d+$/;
    let phone = e.target.value;

    if (regex.test(phone) || phone === "") {
      setShowError({ ...showError, phone: false });
      setPhone(phone);
    }
  };

  const handleChangeAddress = (e) => {
    setShowError({ ...showError, address: false });
    setAddress(e.target.value);
  };

  const handleSubmitUserInfo = (e) => {
    e.preventDefault();

    if (phone.trim() === "") {
      setShowError({ ...showError, phone: true });
      return;
    }

    if (address.trim() === "") {
      setShowError({ ...showError, address: true });
      return;
    }

    const updateUserInfo = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/auth/update-user-info`,
          {
            phone,
            address,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        const result = response.data;

        if (result && result.success && result.data) {
          setShowAddressPopup(false);
          setShowPopupMessage({
            show: true,
            message: "Cập nhật thông tin thành công",
            iconImage: assets.tomatoImage,
          });
        }
      } catch (error) {
        console.log(error);
        setShowPopupMessage({
          show: true,
          message: "Cập nhật thông tin không thành công",
          iconImage: assets.sadEmoji64,
        });
      }
    };

    updateUserInfo();
  };

  return (
    <div className="address-popup-container">
      <div className="address-popup-wrapper">
        {showCloseBtn && (
          <button
            className="address-popup-close-btn"
            onClick={() => setShowAddressPopup(false)}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        )}
        <h3>Hãy cho chúng tôi biết thêm thông tin về bạn</h3>
        <form className="address-popup-form" onSubmit={handleSubmitUserInfo}>
          <label htmlFor="phone">Số điện thoại (* Bắt buộc)</label>
          {showError.phone && (
            <span
              style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}
            >
              Vui lòng nhập SĐT
            </span>
          )}
          <input
            onChange={handleChangePhone}
            value={phone}
            type="text"
            placeholder="Số điện thoại"
            id="phone"
          />
          <label htmlFor="address">Địa chỉ (* Bắt buộc)</label>
          {showError.address && (
            <span
              style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}
            >
              Vui lòng nhập địa chỉ
            </span>
          )}
          <textarea
            value={address}
            name="address-popup-input"
            id="address"
            placeholder="Địa chỉ của bạn"
            onChange={handleChangeAddress}
          ></textarea>
          <button type="submit">Xác nhận</button>
        </form>
      </div>
    </div>
  );
}

export default AddressPopup;

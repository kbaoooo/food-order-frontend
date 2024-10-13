import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Tippy from "@tippyjs/react";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [totalCart, setTotalCart] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const { token, setShowLogin, apiUrl, updateTotalCart } =
    useContext(StoreContext);
  const TOKEN = token();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/cart/get-cart`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        const result = response.data;
        
        if (result.success && result.data && result.data.length > 0) {
          setTotalCart(result.data.length);
        } else {
          setTotalCart(null);
        }
      } catch (error) {
        setTotalCart(null);
      }
    };

    if (TOKEN) {
      fetchData();
    } else {
      setTotalCart(null);
    }
  }, [TOKEN, updateTotalCart]);

  useEffect(() => {
    const fecthUserInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const result = response.data;

        if (result && result.success && result.data) {
          setUserInfo(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (TOKEN) {
      fecthUserInfo();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Trang chủ
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Thực đơn
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Ứng dụng di động
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Liên hệ chúng tôi
        </a>
      </ul>

      <div className="navbar-right">
        <div className="navbar-cart-icon">
          <Tippy content="Giỏ hàng">
            <Link to="/cart">
              <img src={assets.basket_icon} style={{ width: "32px" }} alt="" />
            </Link>
          </Tippy>
          {totalCart && totalCart > 0 && (
            <div className="cart-total-icon">
              <p>{totalCart}</p>
            </div>
          )}
        </div>
        {!TOKEN ? (
          <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
        ) : (
          <div className="navbar-profile">
            <div className="navbar-info">
              <img src={assets.profile_icon} alt="" style={{ width: "30px" }} />
              <p>{userInfo.username}</p>
            </div>
            <ul className="navbar-profile-dropdown">
              <Link to="/tracking-orders">
                <img src={assets.bag_icon} alt="" />
                <p>Đơn hàng</p>
              </Link>
              <Link to="/favour">
                <FontAwesomeIcon
                  style={{ fontSize: "18px", color: "tomato" }}
                  icon={faHeart}
                />
                <p>Yêu thích</p>
              </Link>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" />
                <p>Đăng xuất</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

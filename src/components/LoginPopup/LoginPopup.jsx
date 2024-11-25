import { assets } from "../../assets/assets";
import "./LoginPopup.css";
import axios from "axios";
import { useState, useContext, useTransition } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const createInstance = (url) => {
  const instance = axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return instance;
};

const LoginPopup = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState({
    name: false,
    email: false,
    password: false,
    invalid: false,
  });
  const { apiUrl, setShowLogin, setShowAddressPopup } =
    useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Đăng nhập");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    if (e.target.name === "email") {
      setShowError({ ...showError, email: false });
      setShowError({ ...showError, invalid: false });
    }

    if (e.target.name === "password") {
      setShowError({ ...showError, password: false });
      setShowError({ ...showError, invalid: false });
    }

    if (e.target.name === "name") {
      setShowError({ ...showError, name: false });
    }

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onLogin = (e) => {
    e.preventDefault();
    let currentApiUrl = apiUrl;

    if (currentState === "Đăng nhập") {
      // login
      if (!data.email) {
        setShowError({ ...showError, email: true });
        return;
      }

      if (!data.password) {
        setShowError({ ...showError, password: true });
        return;
      }

      currentApiUrl += "/auth/login";
      const instance = createInstance(currentApiUrl);

      startTransition(async () => {
        try {
          const response = await instance.post(currentApiUrl, data);

          if (
            response.status === 200 &&
            response.data &&
            response.data.success
          ) {
            const result = response.data;
            const data = result.data;

            const { user, token } = data;
            localStorage.setItem("token", token);

            setShowLogin(false);
            if ((user && !user.phone_number) || !user.address) {
              setShowAddressPopup(true);
            }
            window.location.reload();
          } else {
            setShowError({ ...showError, invalid: true });
          }
        } catch (error) {
          setShowError({ ...showError, invalid: true });
        }
      });
    } else {
      // register

      if (!data.name) {
        setShowError({ ...showError, name: true });
        return;
      }

      if (!data.email) {
        setShowError({ ...showError, email: true });
        return;
      }

      if (!data.password) {
        setShowError({ ...showError, password: true });
        return;
      }

      currentApiUrl += "/auth/register";

      startTransition(async () => {
        try {
          const response = await axios.post(currentApiUrl, data);

          if (
            response.status === 201 &&
            response.data &&
            response.data.success
          ) {
            const result = response.data;

            if (result.success && result.data) {
              setCurrentState("Đăng nhập");
              setShowLogin(false);
              navigate("/verify-email");
            }
          } else {
            alert("Đã có lỗi xảy ra");
          }
        } catch (error) {
          alert("Đã có lỗi xảy ra");
        }
      });
    }
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>

          <img onClick={handleCloseLogin} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Đăng nhập" ? null : (
            <>
              {showError.name && (
                <span
                  style={{
                    color: "red",
                    fontSize: "13px",
                    marginBottom: "5px",
                  }}
                >
                  Vui lòng nhập tên đăng nhập
                </span>
              )}
              <input
                name="name"
                value={data.name}
                onChange={handleOnChange}
                type="text"
                placeholder="Tên đăng nhập"
                required
              />
            </>
          )}
          <>
            {showError.email && (
              <span
                style={{ color: "red", fontSize: "13px", marginBottom: "5px" }}
              >
                Vui lòng nhập email
              </span>
            )}
            <input
              name="email"
              onChange={handleOnChange}
              value={data.email}
              type="email"
              placeholder="Email của bạn"
              required
            />
          </>
          <div className="passw-field">
            {showError.password && (
              <span
                style={{ color: "red", fontSize: "13px", marginBottom: "5px" }}
              >
                {showError.password && "Vui lòng nhập mật khẩu"}
              </span>
            )}
            <input
              name="password"
              value={data.password}
              onChange={handleOnChange}
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              required
            />

            {showPassword ? (
              <FontAwesomeIcon
                icon={faEye}
                onClick={() => setShowPassword(false)}
                className="show-password-icon"
              />
            ) : (
              <FontAwesomeIcon
                icon={faEyeSlash}
                onClick={() => setShowPassword(true)}
                className="show-password-icon"
              />
            )}
          </div>
          {showError.invalid && (
            <span
              style={{
                color: "red",
                fontSize: "13px",
                marginTop: "5px",
              }}
            >
              Tài khoản hoặc mật khẩu không đúng
            </span>
          )}
          {currentState === "Đăng nhập" && (
            <div className="forgot-pass">
              <Link
                to={"/forgot-pass"}
                onClick={() => setShowLogin(false)}
              >
                Quên mật khẩu?
              </Link>
            </div>
          )}
        </div>
        <button type="submit">
          {isPending && (
            <FontAwesomeIcon icon={faSpinner} className="spinner" />
          )}
          {currentState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}
        </button>
        {currentState === "Đăng ký" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>
              Để tiếp tục, hãy đồng ý với các điều khoản sử dụng và chính sách
              bảo mật.
            </p>
          </div>
        )}
        {currentState === "Đăng nhập" ? (
          <p>
            Tạo tài khoản mới?{" "}
            <span onClick={() => setCurrentState("Đăng ký")}>Bấm vào đây</span>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrentState("Đăng nhập")}>
              Đăng nhập tại đây
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

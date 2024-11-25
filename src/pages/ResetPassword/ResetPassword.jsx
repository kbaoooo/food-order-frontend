import "./ResetPassword.css";
import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

function ResetPassword() {
  const { apiUrl, setShowLogin, handleShowPopupMessage } =
    useContext(StoreContext);
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  });

  const handleOnChange = (e) => {
    setShowError(false);

    setPassword(e.target.value);
  };

  const handleSubmitChangePass = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/reset-password`, {
        email,
        password: password.trim(),
      });

      if (response && response.data) {
        const result = response.data;

        if (result.success) {
          handleShowPopupMessage(
            {
              show: true,
              message: "Mật khẩu đã được thay đổi",
              iconImage: assets.tomatoImage,
            },
            1500,
            () => {
              navigate("/");
              setShowLogin(true);
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response.data.message;
      switch (errorMessage) {
        case 'Email is required':
          handleShowPopupMessage(
            {
              show: true,
              message: "Email không được để trống",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case 'Missing password':
          handleShowPopupMessage(
            {
              show: true,
              message: "Để thay đổi, vui lòng nhập mật khẩu",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;
        default:
          handleShowPopupMessage(
            {
              show: true,
              message: "Có lỗi xảy ra, vui lòng thử lại",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;
      }
    }
  };

  return (
    <div className="resetpass-container">
      <div className="resetpass-wrapper">
        <div className="resetpass-input">
          <h3>Đặt lại mật khẩu</h3>
          <div className="pass-field passw-field">
            {showError.password && (
              <span
                style={{ color: "red", fontSize: "13px", marginBottom: "5px" }}
              >
                {showError.password && "Vui lòng nhập mật khẩu"}
              </span>
            )}
            <input
              name="password"
              value={password}
              onChange={handleOnChange}
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
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

          <button onClick={handleSubmitChangePass}>Thay đổi</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

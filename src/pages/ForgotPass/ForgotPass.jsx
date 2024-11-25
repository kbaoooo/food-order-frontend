import "./ForgotPass.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

function ForgotPass() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [counter, setCounter] = useState(60); // State cho bộ đếm 60 giây
  const navigate = useNavigate();
  const { apiUrl, token, handleShowPopupMessage } = useContext(StoreContext);

  const TOKEN = token();

  useEffect(() => {
    if (TOKEN) {
      navigate("/");
    }

    let timer;

    // Nếu OTP đã được gửi và chưa hết hạn, bắt đầu đếm ngược
    if (otpSent && counter > 0 && !otpExpired) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      // Khi hết thời gian (counter = 0), đặt OTP hết hạn
      setOtpExpired(true);
      setOtpSent(false);
    }

    return () => clearInterval(timer); // Dọn dẹp timer
  }, [otpSent, counter, otpExpired]);

  const handleSendOTP = async () => {
    try {
      await axios.post(`${apiUrl}/auth/send-otp`, { email });
      setOtpSent(true);
      setOtpExpired(false);
      setCounter(60); // Reset bộ đếm về 60 giây
    } catch (err) {
      console.error(err);
      setEmail("");

      const errorMessage = err.response.data.error;

      switch (errorMessage) {
        case "Email is required":
          handleShowPopupMessage(
            {
              show: true,
              message: "Email không được để trống",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "Failed to send OTP":
          handleShowPopupMessage(
            {
              show: true,
              message: "Lỗi khi gửi OTP",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "Failed to insert OTP":
          handleShowPopupMessage(
            {
              show: true,
              message: "Lỗi khi thêm OTP",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "User not found":
          handleShowPopupMessage(
            {
              show: true,
              message: "Không tìm thấy người dùng",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        default:
          handleShowPopupMessage(
            {
              show: true,
              message: "Đã có lỗi xảy ra",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/verify-otp`, {
        email,
        otp,
      });

      if (response && response.data) {
        handleShowPopupMessage(
          {
            show: true,
            message: "OTP xác thực thành công",
            iconImage: assets.tomatoImage,
          },
          1500,
          () => navigate("/reset-password", { state: { email } })
        );
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response.data.error;

      switch (errorMessage) {
        case "OTP is expired":
          handleShowPopupMessage(
            {
              show: true,
              message: "OTP đã hết hạn",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "Email and OTP are required":
          handleShowPopupMessage(
            {
              show: true,
              message: "Email và OTP không được để trống",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "User not found":
          handleShowPopupMessage(
            {
              show: true,
              message: "Không tìm thấy người dùng",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "Failed to update OTP":
          handleShowPopupMessage(
            {
              show: true,
              message: "Lỗi khi cập nhật OTP",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        case "OTP is invalid":
          handleShowPopupMessage(
            {
              show: true,
              message: "OTP không hợp lệ",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;

        default:
          handleShowPopupMessage(
            {
              show: true,
              message: "Đã có lỗi xảy ra",
              iconImage: assets.sadEmoji64,
            },
            1500
          );
          break;
      }
    }
  };

  return (
    <div className="forgotpass-container">
      <div className="forgotpass-wrapper">
        {!otpSent && (
          <div className="forgotpass-input box">
            <h3>Nhập email của bạn</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />

            {!otpExpired ? (
              <button onClick={handleSendOTP} disabled={otpSent && !otpExpired}>
                Gửi OTP
              </button>
            ) : (
              <div className="otp-expired">
                <p>Mã OTP đã hết hạn.</p>
                <button
                  onClick={handleSendOTP}
                  disabled={otpSent && otpExpired}
                >
                  Gửi lại.
                </button>
              </div>
            )}
          </div>
        )}

        {otpSent && !otpExpired && (
          <div className="forgotpass-input box">
            <h3>Nhập mã OTP</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập OTP"
            />
            <button onClick={handleVerifyOTP}>Xác nhận OTP</button>
            <p className="expired-in">OTP sẽ hết hạn trong: {counter}s</p>{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPass;

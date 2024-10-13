import "./PlaceOrder.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { StoreContext } from "../../context/StoreContext";
import { useContext, useEffect, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { formatCurrency, formatPhoneNumber } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import moment from "moment";
import cn from "classnames";
import axios from "axios";
import FoodTable from "../../components/FoodTable/FoodTable";

function PlaceOrder() {
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("money");
  const [order, setOrder] = useState({});
  const [isPending, startTransition] = useTransition();
  const {
    setShowAddressPopup,
    apiUrl,
    token,
    setShowLogin,
    phone,
    address,
    handleShowPopupMessage,
    setShowLoadingPage,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const { order_id } = useParams();

  const TOKEN = token();

  if (!TOKEN) {
    navigate("/");
    setShowLogin(true);
  }

  const checkTransactionStatus = async (transaction_id) => {
    console.log('checking transaction status...');
    
    try {
      const response = await axios.post(
        `${apiUrl}/payment/order-status/${transaction_id}`
      );

      const { return_code } = response.data;

      setTransactionStatus(return_code);
    } catch (error) {
      console.log(error);
      handleShowPopupMessage({
        show: true,
        message:
          "Đã có lỗi xảy ra khi kiểm tra trạng thái giao dịch, vui lòng thử lại sau",
        iconImage: assets.sadEmoji64,
      });
    }
  };

  useEffect(() => {
    console.log(transactionStatus);
    
    if (transactionStatus === 1 || transactionStatus === 2) {
      const intervalId = localStorage.getItem("intervalId");
      if (intervalId) {
        clearInterval(intervalId);
        localStorage.removeItem("intervalId");
      }
    }

    if (transactionStatus === 1) {
      setShowLoadingPage({ show: false, content: null });
      handleShowPopupMessage(
        {
          show: true,
          message: "Đã thanh toán thành công",
          iconImage: assets.tomatoImage,
        },
        1500,
        async () => {
          try {
            const response = await axios.post(
              `${apiUrl}/payment/update-payment-status`,
              {
                transaction_id: transactionId,
                status: "completed",
                username: userInfo?.username,
              }
            );

            if (response && response.data) {
              const result = response.data;

              if (result.success && result.data) {
                navigate("/tracking-orders");
              }
            }
          } catch (error) {
            console.log(error);
            handleShowPopupMessage({
              show: true,
              message: "Cập nhật trạng thái thanh toán thất bại",
              iconImage: assets.sadEmoji64,
            });
          }
        }
      );
    } else if (transactionStatus === 2) {
      setShowLoadingPage({ show: false, content: null });
      handleShowPopupMessage(
        {
          show: true,
          message: "Đã có lỗi xảy ra khi thanh toán, vui lòng giao dịch lại",
          iconImage: assets.sadEmoji64,
        },
        1500,
        async () => {
          try {
            const response = await axios.post(
              `${apiUrl}/payment/update-payment-status`,
              {
                transaction_id: transactionId,
                status: "failed",
                username: userInfo?.username,
              }
            );

            if (response && response.data) {
              const result = response.data;

              if (result.success && result.data) {
                navigate("/tracking-orders");
              }
            }
          } catch (error) {
            console.log(error);
            handleShowPopupMessage({
              show: true,
              message: "Cập nhật trạng thái thanh toán thất bại",
              iconImage: assets.sadEmoji64,
            });
          }
        }
      );
    } else if (transactionStatus === 3) {
      setShowLoadingPage({ show: true, content: "Đang xử lý giao dịch" });
    }
  }, [transactionStatus]);

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
        navigate("/");
        setShowLogin(true);
      }
    };

    fecthUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/order/get-prev-order-info/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        const result = response.data;

        if (result && result.success && result.data) {
          const isOrdered = result.data.payment_id;

          if (isOrdered) {
            return navigate("/");
          }

          setOrder(result.data);
        } else {
          handleShowPopupMessage({
            show: true,
            message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
            iconImage: assets.sadEmoji64,
          });
        }
      } catch (error) {
        navigate("/page-not-found");
      }
    };

    fetchOrder();
  }, []);

  const handleRadioChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleChangeAddress = () => {
    setShowAddressPopup(true);
  };

  if (!order.products) {
    return null;
  }

  const handlePayment = async () => {
    if (note.trim()) {
      try {
        const respnse = await axios.post(
          `${apiUrl}/order/send-note`,
          {
            order_id,
            note,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (respnse && respnse.data) {
          const result = respnse.data;

          if (!result.success) {
            handleShowPopupMessage(
              {
                show: true,
                message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
                iconImage: assets.sadEmoji64,
              },
              1500
            );
          }
        }
      } catch (error) {
        console.log(error);
        handleShowPopupMessage({
          show: true,
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          iconImage: assets.sadEmoji64,
        });
      }
    }

    // call api payment

    if (paymentMethod === "money") {
      try {
        const transID = Math.floor(Math.random() * 1000000);

        const response = await axios.post(
          `${apiUrl}/payment/insert-payment`,
          {
            order_id,
            amount: order.total_amount,
            payment_method: paymentMethod,
            payment_status: "pending",
            transaction_id: `${moment().format("YYMMDD")}_${transID}`,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            handleShowPopupMessage(
              {
                show: true,
                message: "Đã đặt hàng thành công",
                iconImage: assets.tomatoImage,
              },
              1500,
              () => {
                navigate("/tracking-orders");
              }
            );
          } else {
            handleShowPopupMessage(
              {
                show: true,
                message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
                iconImage: assets.sadEmoji64,
              },
              1500
            );
          }
        }
      } catch (error) {
        console.log(error);
        handleShowPopupMessage({
          show: true,
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          iconImage: assets.sadEmoji64,
        });
      }
    } else {
      // call api zalopay
      try {
        const transID = Math.floor(Math.random() * 1000000);
        const response = await axios.post(
          `${apiUrl}/payment/insert-payment`,
          {
            order_id,
            amount: order?.total_amount,
            payment_method: paymentMethod,
            payment_status: "pending",
            transaction_id: `${moment().format("YYMMDD")}_${transID}`,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;

          if (result && result.success && result.data) {
            const { transaction_id, amount } = result.data;

            setTransactionId(transaction_id);

            const responseZaloPay = await axios.post(
              `${apiUrl}/payment/create-payment`,
              {
                amount,
                transaction_id,
                order_id,
                items: order?.products,
                username: userInfo?.username,
                phone: phone || userInfo?.phone_number,
                address: address || userInfo?.address,
                email: userInfo?.email,
              }
            );

            checkTransactionStatus(transaction_id);

            // moi 10s kiem tra 1 lan
            const intervalId = setInterval(() => {
              console.log('start check transaction status.');

              checkTransactionStatus(transaction_id);
            }, 10000);

            localStorage.setItem("intervalId", intervalId);

            // dung kiem tra sau 15p
            setTimeout(() => {              
              const intervalId = localStorage.getItem("intervalId");
              if (intervalId) {
                clearInterval(intervalId);
                localStorage.removeItem("intervalId");
              }
            }, 900000);

            if (responseZaloPay && responseZaloPay.data) {
              const resultZaloPay = responseZaloPay.data;

              if (resultZaloPay.return_code === 1) {
                const { order_url } = resultZaloPay;

                window.open(order_url, "_blank");
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
        handleShowPopupMessage({
          show: true,
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          iconImage: assets.sadEmoji64,
        });
      }
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="color-line"></div>
        <div className="payment-address box padding">
          <h2 className="payment-address-title">
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ marginRight: "10px" }}
            />
            Địa chỉ nhận hàng
          </h2>

          <div className="payment-address-content">
            <p className="payment-address-info">
              <b className="payment-address-name">
                {userInfo?.username}{" "}
                {formatPhoneNumber(phone) ||
                  formatPhoneNumber(userInfo?.phone_number)}
              </b>
            </p>

            <p className="payment-address-detail">
              {address || userInfo?.address}
            </p>

            <button
              className="payment-address-change"
              onClick={handleChangeAddress}
            >
              Thay đổi
            </button>
          </div>
        </div>

        <div className="payment-products box">
          <FoodTable data={order?.products} />

          <div className="payment-products-footer">
            <form className="payment-note">
              <label>Lời nhắn: </label>
              <input
                className="note-input"
                onChange={(e) => setNote(e.target.value)}
                value={note}
                placeholder="Lưu ý cho người bán..."
              />
            </form>
            <div className="payment-products-total">
              <div className="flex payment-products-total-header">
                <p>
                  Voucher: <span>{order?.voucher_code || "Không áp dụng"}</span>
                </p>
                <p>
                  Giảm giá: <span>{formatCurrency(order?.total_discount)}</span>
                </p>
              </div>
              <p className="payment-products-total-amount">
                Tổng số tiền ({order?.products?.length} sản phẩm):
                <span style={{ marginLeft: "5px" }}>
                  {formatCurrency(order?.total_amount)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="payment-products-method box">
          <div className="payment-products-method-title">
            <h3>Phương thức thanh toán</h3>
          </div>
          <div className="payment-products-method-content">
            <h3
              style={{ color: "#333", fontSize: "18px", marginRight: "40px" }}
            >
              Chọn phương thức thanh toán:
            </h3>
            <div className="payment-method">
              <label
                className={cn("payment-label", {
                  active: paymentMethod === "money",
                })}
                htmlFor="money"
              >
                Thanh toán khi nhận hàng
              </label>
              <input
                type="radio"
                value="money"
                id="money"
                checked={paymentMethod === "money"}
                className="select-method-radio"
                onChange={handleRadioChange}
              />
            </div>
            <div className="payment-method">
              <label
                className={cn("payment-label", {
                  active: paymentMethod === "zalopay",
                })}
                htmlFor="zalopay"
              >
                ZaloPay
              </label>
              <input
                type="radio"
                value="zalopay"
                id="zalopay"
                checked={paymentMethod === "zalopay"}
                className="select-method-radio"
                onChange={handleRadioChange}
              />
            </div>
          </div>
          <div className="payment-confirm">
            <p>
              Nhấn &quot;Thanh toán&quot; để{" "}
              <span style={{ color: "tomato" }}>Tomato</span> có thể giao món ăn
              đến bạn nhanh nhất có thể.
            </p>
            <button
              className="pay-btn"
              onClick={() => {
                startTransition(() => {
                  handlePayment();
                });
              }}
            >
              {isPending ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Thanh toán"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;

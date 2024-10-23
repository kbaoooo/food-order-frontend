import "./TrackingItem.css";
import { assets } from "../../assets/assets";
import { formatCurrency, formatDateTime } from "../../helpers";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

function TrackingItem({ tracking_item, className, onCanceled, user }) {
  const {
    token,
    apiUrl,
    setShowPopupConfirm,
    setShowLoginPopup,
    handleShowPopupMessage,
    setShowLoadingPage,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const TOKEN = token();

  if (!TOKEN) {
    navigate("/");
    setShowLoginPopup(true);
  }

  const handleCancelOrder = () => {
    setShowPopupConfirm({
      show: true,
      message: "Bạn có chắc muốn hủy đơn hàng này không?",
      question: "Hủy đơn hàng",
      onConfirm: async () => {
        setShowPopupConfirm({
          show: false,
          message: "",
          question: "",
          onConfirm: null,
          onCancel: null,
        });
        if (tracking_item?.payment_method === "money") {
          try {
            const response = await axios.post(
              `${apiUrl}/order/update-order-status`,
              {
                order_id: tracking_item?.order_id,
                status: "canceled",
                user,
                order_customer_id: user?.user_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${TOKEN}`,
                },
              }
            );

            if (response && response.data) {
              const result = response.data;
              if (result.success) {
                handleShowPopupMessage(
                  {
                    show: true,
                    message: "Đã hủy đơn hàng",
                    iconImage: assets.tomatoImage,
                  },
                  1500,
                  () => {
                    onCanceled(tracking_item?.order_id);
                  }
                );
              }
            }
          } catch (error) {
            setShowPopupConfirm({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
            handleShowPopupMessage(
              {
                show: true,
                message: "Có lỗi xảy ra, vui lòng thử lại sau",
                type: "error",
              },
              1500
            );
          }
        }

        if (tracking_item?.payment_method === "zalopay") {
          setShowLoadingPage({
            show: true,
            content: "Đang thực hiện hoàn tiền...",
          });

          try {
            const response = await axios.post(
              `${apiUrl}/order/update-order-status`,
              {
                order_id: tracking_item?.order_id,
                status: "canceled",
                user,
                order_customer_id: user?.user_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${TOKEN}`,
                },
              }
            );

            if (response && response.data) {
              const result = response.data;
              if (result.success) {
                const timeout = setTimeout(() => {
                  setShowLoadingPage({ show: false, content: "" });
                  handleShowPopupMessage(
                    {
                      show: true,
                      message: "Đã hủy đơn hàng",
                      iconImage: assets.tomatoImage,
                    },
                    1500,
                    () => {
                      onCanceled(tracking_item?.order_id);
                    }
                  );
                }, 3000);

                return () => {
                  clearTimeout(timeout);
                };
              }
            }
          } catch (error) {
            setShowLoadingPage({ show: false, content: "" });
            handleShowPopupMessage(
              {
                show: true,
                message: "Có lỗi xảy ra, vui lòng thử lại sau",
                type: "error",
              },
              1500
            );
          }
        }
      },
      onCancel: () => {
        setShowPopupConfirm({
          show: false,
          message: "",
          question: "",
          onConfirm: null,
          onCancel: null,
        });
      },
    });
  };

  return (
    <div className={classNames("tracking-item-container", className)}>
      <div className="tracking-item-content">
        {tracking_item?.status === "pending" && (
          <button className="cancel-order-btn" onClick={handleCancelOrder}>
            Hủy đơn
          </button>
        )}
        <div className="tracking-item-image">
          <img src={assets.tomatoImage} alt="" />
        </div>

        <div className="tracking-item-info">
          <div className="tracking-item-info__title">
            <h3>Đơn hàng: {tracking_item?.order_id}</h3>
            <p>Ngày đặt hàng: {formatDateTime(tracking_item?.created_at)}</p>
          </div>
          <div className="tracking-item-info-content">
            <p className="tracking-item-info">
              Trạng thái:{" "}
              <span
                className={classNames({
                  cancelled: tracking_item?.status === "canceled",
                })}
              >
                {tracking_item?.status === "pending"
                  ? "Đang chờ xác nhận"
                  : tracking_item?.status === "confirmed"
                  ? "Đã được xác nhận"
                  : tracking_item?.status === "preparing"
                  ? "Đang chuẩn bị món ăn"
                  : tracking_item?.status === "delivering"
                  ? "Đang giao hàng"
                  : tracking_item?.status === "completed"
                  ? "Đã giao hàng"
                  : "Đã hủy"}
              </span>
            </p>
            <p className="tracking-item-info">
              Thanh toán:{" "}
              <span>
                {tracking_item?.payment_method === "money"
                  ? "Thanh toán khi nhận hàng"
                  : "Zalopay"}
              </span>
            </p>
            <p className="tracking-item-info-voucher">
              Mã giảm giá:{" "}
              {tracking_item?.voucher_id
                ? tracking_item?.code
                : "Không áp dụng"}
            </p>
            <p className="tracking-item-info-total-price">
              Tổng tiền: {formatCurrency(tracking_item?.total_amount)}
            </p>
          </div>
        </div>
      </div>
      <button
        className="tracking-view-detail-btn"
        onClick={() => navigate(`/tracking-orders/${tracking_item?.order_id}`)}
      >
        Xem chi tiết đơn hàng
      </button>
    </div>
  );
}

export default TrackingItem;

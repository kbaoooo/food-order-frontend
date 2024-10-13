import "./OrderDetail.css";
import Tabs from "../../../components/Tabs/Tabs";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../../context/StoreContext";
import axios from "axios";
import { formatCurrency, formatDateTime } from "../../../helpers";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { assets } from "../../../assets/assets";

function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const { order_id } = useParams();
  const navigate = useNavigate();
  const { token, apiUrl, setShowLoginpopup, handleShowPopupMessage } =
    useContext(StoreContext);
  const TOKEN = token();

  if (!TOKEN) {
    navigate("/");
    setShowLoginpopup(true);
  }

  const haveTimeLeft = (created_at) => {
    const createdAt = new Date(created_at);
    const after24Hours = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    if (after24Hours.getTime() > new Date().getTime()) {
      return true;
    }

    return false;
  };

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
        handleShowPopupMessage({
          show: true,
          message: "Đã có lỗi xảy ra, vui lòng thử lại sau",
          iconImage: assets.sadEmoji64,
        });
      }
    };

    fecthUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/order/get-order-info/${order_id}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;

          if (result.success && result.data) {
            const orderInfo = result.data;
            console.log(orderInfo);

            if (orderInfo && orderInfo.order_id && orderInfo.products)
              setOrder(orderInfo);
            else return navigate("/page-note-found");
          }
        }
      } catch (error) {
        navigate("/page-note-found");
      }
    };

    if (TOKEN) {
      const interval = setInterval(() => {
        fetchOrderData();
      }, 5000);

      fetchOrderData();

      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <div className="order-detail-container">
      <div className="order-detail-wrapper">
        <h2>Thông tin chi tiết về đơn hàng</h2>

        <div className="order-detail-content">
          <Tabs curent_status={order?.order_status} />

          <div className="order-products box">
            <div className="color-line"></div>
            <div className="order-list-table">
              <div className="order-list-table-format title">
                <b>Món ăn</b>
                <b>Phân loại</b>
                <b>Số lượng</b>
                <b>Tổng cộng</b>
                <b>Hành động</b>
              </div>
              {order &&
                order?.products.map((item) => (
                  <div key={item?.item_id} className="order-list-table-format">
                    <div className="flex order-list-table-format-product">
                      <img
                        src={`http://localhost:4000/images/${item.image_url}`}
                        alt={item.name}
                      />
                      <p>{item.name}</p>
                    </div>
                    <p>{item.category_name}</p>
                    <p>{item.quantity}</p>
                    <p>{formatCurrency(item.price * item.quantity)}</p>
                    {haveTimeLeft(order?.created_at) ? (
                      <Tippy content="Hãy đánh giá cho chúng tôi trong vòng 24h">
                        <button
                          className="feedback-btn"
                          onClick={() => {
                            navigate(
                              `/feedback/${order?.order_id}/${item?.item_id}`
                            );
                          }}
                        >
                          Đánh giá
                        </button>
                      </Tippy>
                    ) : (
                      <p>Đã hết thời gian đánh giá</p>
                    )}
                  </div>
                ))}
            </div>

            <div className="order-info">
              <div className="order-detail-info">
                <div className="order-detail-info-title">
                  <h3>Thông tin người nhận</h3>
                </div>
                <div className="order-detail-info-content">
                  <div className="order-detail-text">
                    <p>
                      Họ tên: <span>{userInfo?.username}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Số điện thoại: <span>{userInfo?.phone_number}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Địa chỉ:{" "}
                      <span>
                        {userInfo?.address
                          ? userInfo?.address
                          : "Chưa cập nhật địa chỉ"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-detail-info">
                <div className="order-detail-info-title">
                  <h3>Thông tin đơn hàng</h3>
                </div>
                <div className="order-detail-info-content">
                  <div className="order-detail-text">
                    <p>
                      Mã đơn hàng: <span>{order?.order_id}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Ngày tạo: <span>{formatDateTime(order?.created_at)}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Phương thức thanh toán:{" "}
                      <span>
                        {order?.payment_method === "money"
                          ? "Thanh toán khi nhận hàng"
                          : "Zalopay"}
                      </span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Thanh toán:{" "}
                      <span>
                        {order?.payment_status === "pending"
                          ? "Đang chờ thanh toán"
                          : order?.payment_status === "completed"
                          ? "Đã thanh toán"
                          : "Thanh toán thất bại"}
                      </span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Mã voucher:{" "}
                      <span>
                        {order?.voucher_id
                          ? `${order?.voucher_code} - Giảm ${formatCurrency(
                              order?.total_discount
                            )}`
                          : "Không áp dụng"}
                      </span>
                    </p>
                  </div>

                  <div className="order-detail-text">
                    <p>
                      Ghi chú:{" "}
                      <span>{order?.note ? order?.note : "Không có"}</span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Số lượng:{" "}
                      <span>
                        {order?.products.reduce((acc, product) => {
                          return acc + product.quantity;
                        }, 0)}
                      </span>
                    </p>
                  </div>
                  <div className="order-detail-text">
                    <p>
                      Tổng tiền:{" "}
                      <span>{formatCurrency(order?.total_amount)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="color-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;

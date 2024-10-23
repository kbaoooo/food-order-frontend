import "./TrackingOrders.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import TrackingItem from "../../components/TrackingItem/TrackingItem";

function TrackingOrders() {
  const navigate = useNavigate();
  const { token, apiUrl, setShowLoginPopup } = useContext(StoreContext);
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);

  const TOKEN = token();

  if (!TOKEN) {
    navigate("/");
    setShowLoginPopup(true);
  }
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

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(`${apiUrl}/order/get-orders-by-user`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (response && response.data) {
        const result = response.data;

        if (result.success && result.data) {
          setOrders(result.data);
        }
      }
    };

    if (TOKEN) {
      const interval = setInterval(() => {
        fetchOrders();
      }, 180000);

      fetchOrders();

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="tracking-container">
      <div className="tracking-content">
        <h2>Theo dõi đơn hàng</h2>
        <div className="tracking-list">
          {orders.length > 0 ? (
            orders?.map((item) => {
              return (
                <TrackingItem
                  key={item.order_id}
                  tracking_item={item}
                  user={userInfo}
                  onCanceled={(order_id) => {
                    setOrders(
                      orders.filter((order) => order.order_id !== order_id)
                    );
                  }}
                  className="tracking-list-item"
                />
              );
            })
          ) : (
            <p className="no-orders">Bạn chưa có đơn hàng nào</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackingOrders;

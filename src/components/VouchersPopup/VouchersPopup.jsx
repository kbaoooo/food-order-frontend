import "./VouchersPopup.css";
import { assets } from "../../assets/assets";
import { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { formatCurrency, formatDate, formatPercent } from "../../helpers";

function VouchersPopup() {
  const {
    apiUrl,
    handleShowPopupMessage,
    setShowVouchersPopup,
    setAppliedVoucher,
    selectedFood,
    totalSelectedFood,
  } = useContext(StoreContext);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const response = await axios.get(`${apiUrl}/voucher/vouchers`);

        const result = response.data;
        
        if (result.success && result.data) {
          const validVouchers = result.data.filter(
            (voucher) => new Date(voucher.valid_to) >= new Date()
          );

          setVouchers(validVouchers);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchVouchers();
  }, []);

  const handleApplyVoucher = (voucher) => {
    setShowVouchersPopup(false);

    if (selectedFood.length === 0 || !selectedFood) {
      handleShowPopupMessage(
        {
          show: true,
          message: "Vui lòng chọn món ăn trước khi áp dụng voucher",
          iconImage: assets.starFace,
        },
        2000
      );
      return;
    }

    if (voucher.usage_count > voucher.usage_limit) {
      handleShowPopupMessage(
        {
          show: true,
          message: "Voucher đã hết lượt sử dụng. Vui lòng chọn voucher khác",
          iconImage: assets.sadEmoji64,
        },
        1500
      );
    }

    if (voucher.min_order_amount > totalSelectedFood) {
      handleShowPopupMessage(
        {
          show: true,
          message: `Ưu đãi chỉ áp dụng cho đơn hàng từ ${formatCurrency(
            voucher.min_order_amount
          )} trở lên`,
          iconImage: assets.sadEmoji64,
        },
        1500
      );
      return;
    }

    if (voucher.valid_to < new Date()) {
      handleShowPopupMessage(
        {
          show: true,
          message: `Voucher đã hết hạn sử dụng`,
          iconImage: assets.sadEmoji64,
        },
        1500
      );
      return;
    }

    setAppliedVoucher(voucher);

    handleShowPopupMessage(
      {
        show: true,
        message: "Áp dụng voucher thành công",
        iconImage: assets.tomatoImage,
      },
      1500
    );
  };
  console.log(vouchers);
  
  return (
    <div className="vouchers-popup-container">
      <div className="vouchers-popup-wrapper">
        <button
          className="close-voucher-popup"
          onClick={() => setShowVouchersPopup(false)}
        >
          x
        </button>
        <div className="vouchers-popup">
          {vouchers.length ? (
            vouchers?.map((voucher) => (
              <div key={voucher.voucher_id} className="voucher-popup-item">
                <div className="voucher-popup-image">
                  <img src={assets.tomatoImage} alt="" />
                </div>
                <div className="voucher-popup-content">
                  <button
                    className="apply-voucher-btn"
                    onClick={() => handleApplyVoucher(voucher)}
                  >
                    Áp dụng
                  </button>
                  <p style={{ color: "tomato", marginBottom: "5px" }}>
                    {voucher.code}
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    {voucher.discount_type === "percentage"
                      ? `Giảm ${formatPercent(
                          voucher.discount_value
                        )} tối đa ${formatCurrency(
                          voucher.max_discount_amount
                        )}`
                      : `Giảm ${formatCurrency(voucher.discount_value)}`}
                  </p>
                  <p style={{ fontSize: "15px" }}>
                    Đơn tối thiểu {formatCurrency(voucher.min_order_amount)}
                  </p>
                  <p
                    style={{
                      fontSize: "12.5px",
                      textAlign: "end",
                      color: "tomato",
                    }}
                  >
                    {formatDate(voucher.valid_from)} -{" "}
                    {formatDate(voucher.valid_to)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-voucher-valid">Không có voucher nào khả dụng</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VouchersPopup;

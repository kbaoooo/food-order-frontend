import { useContext, useEffect, useState, useTransition } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatPercent } from "../../helpers";
import sadEmoji64 from "../../assets/sad-emoji64.png";
import axios from "axios";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const {
    token,
    setShowLogin,
    setShowPopupConfirm,
    handleShowPopupMessage,
    apiUrl,
    setUpdateTotalCart,
    setShowVouchersPopup,
    selectedFood,
    setSelectedFood,
    totalSelectedFood,
    setTotalSelectedFood,
    calculateTotalChooseItem,
    appliedVoucher,
    setAppliedVoucher,
  } = useContext(StoreContext);
  const TOKEN = token();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isPending, startTransition] = useTransition();

  const calculateDiscount = () => {
    let discount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discount_type === "percentage") {
        let totalOrderTmp =
          (totalSelectedFood * appliedVoucher.discount_value) / 100;

        if (totalOrderTmp > appliedVoucher.max_discount_amount) {
          discount = appliedVoucher.max_discount_amount;
        } else {
          discount = totalOrderTmp;
        }
      } else {
        discount = appliedVoucher.discount_value;
      }
    }
    return discount;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiUrl}/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const result = response.data;
      if (result.success && result.data && result.data.length > 0) {
        setCart(result.data);
      }
    };

    if (TOKEN) {
      fetchData();
    } else {
      setCart([]);
      setShowLogin(true);
      navigate("/");
    }
  }, [TOKEN]);

  useEffect(() => {
    const totalPrice = calculateTotalChooseItem(selectedFood);
    setTotalSelectedFood(totalPrice);
  }, [selectedFood]);

  const handleDecreaseQuantity = async (cartIndex) => {
    if (cart[cartIndex].quantity <= 1) {
      const popupConfirmInfo = {
        show: true,
        message: cart[cartIndex].name,
        question: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
        onConfirm: async () => {
          try {
            const response = await axios.post(
              `${apiUrl}/cart/remove-from-cart`,
              {
                cart_id: cart[cartIndex].cart_id,
              },
              {
                headers: {
                  Authorization: `Bearer ${TOKEN}`,
                },
              }
            );

            if (response.data.success) {
              setCart((prev) => {
                const newCart = [...prev];
                newCart.splice(cartIndex, 1);
                return newCart;
              });
              setSelectedFood((prev) => {
                const newSelectedFood = [...prev];
                const index = newSelectedFood.findIndex(
                  (food) => food.item_id === cart[cartIndex].item_id
                );
                if (index === -1) return newSelectedFood;
                newSelectedFood.splice(index, 1);
                return newSelectedFood;
              });
              setShowPopupConfirm({
                show: false,
                message: "",
                question: "",
                onConfirm: null,
                onCancel: null,
              });
            } else {
              const popupMessageInfo = {
                show: true,
                message: "Something went wrong, please try again",
                iconImage: sadEmoji64,
              };
              handleShowPopupMessage(popupMessageInfo);
            }
          } catch (error) {
            console.log(error);
            const popupMessageInfo = {
              show: true,
              message: "Something went wrong, please try again",
              iconImage: sadEmoji64,
            };
            handleShowPopupMessage(popupMessageInfo);
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
      };

      setShowPopupConfirm(popupConfirmInfo);
    } else {
      if (cart[cartIndex].quantity > 30) {
        const popupMessageInfo = {
          show: true,
          message: "Bạn chỉ được đặt tối đa 30 suất cho mỗi món",
          iconImage: sadEmoji64,
        };

        handleShowPopupMessage(popupMessageInfo);
      } else {
        try {
          const response = await axios.post(
            `${apiUrl}/cart/update-cart`,
            {
              item_id: cart[cartIndex].item_id,
              quantity: cart[cartIndex].quantity - 1,
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          if (response.data.success && response.data.data) {
            setCart((prev) => {
              const newCart = [...prev];
              newCart[cartIndex] = {
                ...newCart[cartIndex],
                quantity: newCart[cartIndex].quantity - 1,
              };
              return newCart;
            });
            setSelectedFood((prev) => {
              const newSelectedFood = [...prev];
              const index = newSelectedFood.findIndex(
                (food) => food.item_id === cart[cartIndex].item_id
              );
              if (index === -1) return newSelectedFood;
              newSelectedFood[index] = {
                ...newSelectedFood[index],
                quantity: newSelectedFood[index].quantity - 1,
              };
              return newSelectedFood;
            });
          } else {
            const popupMessageInfo = {
              show: true,
              message: "Something went wrong, please try again",
              iconImage: sadEmoji64,
            };
            handleShowPopupMessage(popupMessageInfo);
          }
        } catch (error) {
          console.log(error);
          const popupMessageInfo = {
            show: true,
            message: "Something went wrong, please try again",
            iconImage: sadEmoji64,
          };
          handleShowPopupMessage(popupMessageInfo);
        }
      }
    }
  };

  const handleIncreaseQuantity = async (cartIndex) => {
    try {
      if (cart[cartIndex].quantity >= 30) {
        const popupMessageInfo = {
          show: true,
          message: "Bạn chỉ được đặt tối đa 30 suất cho mỗi món",
          iconImage: sadEmoji64,
        };

        handleShowPopupMessage(popupMessageInfo);
      } else {
        const response = await axios.post(
          `${apiUrl}/cart/update-cart`,
          {
            item_id: cart[cartIndex].item_id,
            quantity: cart[cartIndex].quantity + 1,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (response.data.success && response.data.data) {
          setCart((prev) => {
            const newCart = [...prev];
            newCart[cartIndex] = {
              ...newCart[cartIndex],
              quantity: newCart[cartIndex].quantity + 1,
            };
            return newCart;
          });
          setSelectedFood((prev) => {
            const newSelectedFood = [...prev];
            const index = newSelectedFood.findIndex(
              (food) => food.item_id === cart[cartIndex].item_id
            );
            if (index === -1) return newSelectedFood;
            newSelectedFood[index] = {
              ...newSelectedFood[index],
              quantity: newSelectedFood[index].quantity + 1,
            };
            return newSelectedFood;
          });
        } else {
          const popupMessageInfo = {
            show: true,
            message: "Something went wrong, please try again",
            iconImage: sadEmoji64,
          };
          handleShowPopupMessage(popupMessageInfo);
        }
      }
    } catch (error) {
      console.log(error);
      const popupMessageInfo = {
        show: true,
        message: "Something went wrong, please try again",
        iconImage: sadEmoji64,
      };
      handleShowPopupMessage(popupMessageInfo);
    }
  };

  const handleQuantityInput = (e, cartIndex) => {
    const regex = /^\d+$/;
    let quantity = e.target.value === "" ? "" : parseInt(e.target.value, 10);

    if (
      (quantity >= 1 && regex.test(quantity) && Number.isInteger(quantity)) ||
      e.target.value === ""
    ) {
      setCart((prev) => {
        const newCart = [...prev];
        newCart[cartIndex] = {
          ...newCart[cartIndex],
          quantity: quantity,
        };
        return newCart;
      });
      setSelectedFood((prev) => {
        const newSelectedFood = [...prev];
        const index = newSelectedFood.findIndex(
          (food) => food.item_id === cart[cartIndex].item_id
        );
        if (index === -1) return newSelectedFood;
        newSelectedFood[index] = {
          ...newSelectedFood[index],
          quantity: quantity,
        };
        return newSelectedFood;
      });
    }
  };

  const handleConfirmQuantity = async (e, cartIndex) => {
    let quantity = e.target.value === "" ? 1 : parseInt(e.target.value, 10);

    if (isNaN(quantity) || quantity === "") {
      setCart((prev) => {
        const newCart = [...prev];
        newCart[cartIndex] = {
          ...newCart[cartIndex],
          quantity: 1,
        };
        return newCart;
      });
      (prev) => {
        const newSelectedFood = [...prev];
        const index = newSelectedFood.findIndex(
          (food) => food.item_id === cart[cartIndex].item_id
        );
        if (index === -1) return newSelectedFood;
        newSelectedFood[index] = {
          ...newSelectedFood[index],
          quantity: 1,
        };
        return newSelectedFood;
      };
    }

    if (quantity > 30) {
      const popupMessageInfo = {
        show: true,
        message: "Bạn chỉ được đặt tối đa 30 suất cho mỗi món",
        iconImage: sadEmoji64,
      };
      handleShowPopupMessage(popupMessageInfo, 2000, async () => {
        try {
          const response = await axios.post(
            `${apiUrl}/cart/update-cart`,
            {
              item_id: cart[cartIndex].item_id,
              quantity: 30,
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          if (response.data.success && response.data.data) {
            setCart((prev) => {
              const newCart = [...prev];
              newCart[cartIndex] = {
                ...newCart[cartIndex],
                quantity: 30,
              };
              return newCart;
            });
            setSelectedFood((prev) => {
              const newSelectedFood = [...prev];
              const index = newSelectedFood.findIndex(
                (food) => food.item_id === cart[cartIndex].item_id
              );
              if (index === -1) return newSelectedFood;
              newSelectedFood[index] = {
                ...newSelectedFood[index],
                quantity: 30,
              };
              return newSelectedFood;
            });
          } else {
            const popupMessageInfo = {
              show: true,
              message: "Something went wrong, please try again",
              iconImage: sadEmoji64,
            };
            handleShowPopupMessage(popupMessageInfo);
          }
        } catch (error) {
          console.log(error);
          const popupMessageInfo = {
            show: true,
            message: "Something went wrong, please try again",
            iconImage: sadEmoji64,
          };
          handleShowPopupMessage(popupMessageInfo);
        }
      });
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/cart/update-cart`,
          {
            item_id: cart[cartIndex].item_id,
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (response.data.success && response.data.data) {
          setCart((prev) => {
            const newCart = [...prev];
            newCart[cartIndex] = {
              ...newCart[cartIndex],
              quantity: quantity,
            };
            return newCart;
          });
          setSelectedFood((prev) => {
            const newSelectedFood = [...prev];
            const index = newSelectedFood.findIndex(
              (food) => food.item_id === cart[cartIndex].item_id
            );
            if (index === -1) return newSelectedFood;
            newSelectedFood[index] = {
              ...newSelectedFood[index],
              quantity: quantity,
            };
            return newSelectedFood;
          });
        } else {
          const popupMessageInfo = {
            show: true,
            message: "Something went wrong, please try again",
            iconImage: sadEmoji64,
          };
          handleShowPopupMessage(popupMessageInfo);
        }
      } catch (error) {
        console.log(error);
        const popupMessageInfo = {
          show: true,
          message: "Something went wrong, please try again",
          iconImage: sadEmoji64,
        };
        handleShowPopupMessage(popupMessageInfo);
      }
    }
  };

  const handleRemoveFromCart = async (cartIndex) => {
    const popupConfirmInfo = {
      show: true,
      message: cart[cartIndex].name,
      question: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
      onConfirm: async () => {
        try {
          const response = await axios.post(
            `${apiUrl}/cart/remove-from-cart`,
            {
              cart_id: cart[cartIndex].cart_id,
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          if (response.data.success) {
            setCart((prev) => {
              const newCart = [...prev];
              newCart.splice(cartIndex, 1);
              return newCart;
            });
            setUpdateTotalCart(Math.random() + Date.now());
            setShowPopupConfirm({
              show: false,
              message: "",
              question: "",
              onConfirm: null,
              onCancel: null,
            });
            setSelectedFood((prev) => {
              const newSelectedFood = [...prev];
              const index = newSelectedFood.findIndex(
                (food) => food.item_id === cart[cartIndex].item_id
              );
              if (index === -1) return newSelectedFood;
              newSelectedFood.splice(index, 1);
              return newSelectedFood;
            });
          } else {
            const popupMessageInfo = {
              show: true,
              message: "Something went wrong, please try again",
              iconImage: sadEmoji64,
            };
            handleShowPopupMessage(popupMessageInfo);
          }
        } catch (error) {
          console.log(error);
          const popupMessageInfo = {
            show: true,
            message: "Something went wrong, please try again",
            iconImage: sadEmoji64,
          };
          handleShowPopupMessage(popupMessageInfo);
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
    };

    setShowPopupConfirm(popupConfirmInfo);
  };

  const handleChooseItem = (e, item) => {
    if (e.target.checked) {
      setSelectedFood((prev) => [...prev, item]);
    } else {
      setSelectedFood((prev) => {
        const newSelectedFood = [...prev];
        const index = newSelectedFood.findIndex(
          (food) => food.item_id === item.item_id
        );
        if (index === -1) return newSelectedFood;
        newSelectedFood.splice(index, 1);
        return newSelectedFood;
      });
    }
  };

  const handleUnAppliedVoucher = () => {
    setAppliedVoucher(null);
  };

  const handleOrder = () => {
    if (selectedFood.length < 1) {
      const popupMessageInfo = {
        show: true,
        message: "Bạn chưa chọn món ăn nào",
        iconImage: sadEmoji64,
      };
      handleShowPopupMessage(popupMessageInfo, 1500);
      return;
    } else {
      const createOrder = async () => {
        try {
          const response = await axios.post(
            `${apiUrl}/order/create-order`,
            {
              total_amount:
                totalSelectedFood - calculateDiscount() < 0
                  ? 0
                  : totalSelectedFood - calculateDiscount(),
              voucher_id: appliedVoucher ? appliedVoucher.voucher_id : null,
              total_discount: calculateDiscount(),
            },
            {
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              },
            }
          );

          const result = response.data;

          if (result.success && result.data) {
            const order_id = result.data.order_id;
            const orderItems = selectedFood.map((food) => {
              return {
                item_id: food.item_id,
                quantity: food.quantity,
                price: food.price,
              };
            });

            try {
              const response = await axios.post(
                `${apiUrl}/order/bulk-create-order-items`,
                {
                  order_id,
                  order_items: orderItems,
                }
              );

              const result = response.data;
              if (result.success && result.data) {
                if (appliedVoucher) {
                  try {
                    const response = await axios.post(
                      `${apiUrl}/voucher/use-voucher`,
                      {
                        voucher_id: appliedVoucher
                          ? appliedVoucher?.voucher_id
                          : null,
                        order_id: order_id,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${TOKEN}`,
                        },
                      }
                    );

                    const result = response.data;

                    if (result.success) {
                      setAppliedVoucher(null);
                      setTotalSelectedFood(0);
                      setSelectedFood([]);
                      navigate(`/payment/${order_id}`);
                    }
                  } catch (error) {
                    console.log(error);
                    const data = error.response.data;
                    handleShowPopupMessage(
                      {
                        show: true,
                        message: data.error,
                        iconImage: sadEmoji64,
                      },
                      2000
                    );
                  }
                } else {
                  navigate(`/payment/${order_id}`);
                }
              } else {
                const popupMessageInfo = {
                  show: true,
                  message: "Đặt hàng không thành công",
                  iconImage: sadEmoji64,
                };
                handleShowPopupMessage(popupMessageInfo, 2000);
              }
            } catch (error) {
              console.log(error);
              handleShowPopupMessage(
                {
                  show: true,
                  message: "Có lỗi xảy ra khi tạo order items",
                  iconImage: sadEmoji64,
                },
                2000
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      startTransition(async () => {
        try {
          const response = await axios.post(
            `${apiUrl}/order/check-unvailable-foods`,
            {
              food_list: selectedFood.map((food) => food.item_id),
            }
          );

          if (response && response.data) {
            const result = response.data;

            if (!result.success && result.data && result.data.length > 0) {
              const unavailableFoods = result.data
                .map((food) => food.name)
                .join(", ");

              const popupMessageInfo = {
                show: true,
                message: `${unavailableFoods} đã hết hàng. Vui lòng chọn món khác`,
                iconImage: sadEmoji64,
              };
              handleShowPopupMessage(popupMessageInfo, 1500);
              return;
            } else {
              createOrder();
            }
          }
        } catch (error) {
          console.log(error);
          const popupMessageInfo = {
            show: true,
            message: "Something went wrong, please try again",
            iconImage: sadEmoji64,
          };
          handleShowPopupMessage(popupMessageInfo);
        }
      });
    }
  };

  return (
    <div className="cart">
      {!cart.length > 0 ? (
        <h1
          style={{
            fontSize: "25px",
            color: "tomato",
            textAlign: "center",
            height: "150px",
            marginTop: "100px",
          }}
        >
          Giỏ hàng của bạn đang trống
        </h1>
      ) : (
        <>
          <div className="cart-items box">
            <div className="cart-items-title">
              <p style={{ textAlign: "center" }}>Chọn</p>
              <p>Mặt hàng</p>
              <p>Tên món</p>
              <p>Đơn giá</p>
              <p>Số lượng</p>
              <p>Thành tiền</p>
              <p>Xóa</p>
            </div>
            <br />
            <hr />
            {cart.map((item, index) => {
              if (cart.length > 0) {
                return (
                  <div key={item.item_id}>
                    <div className="cart-items-title cart-items-item">
                      <input
                        type="checkbox"
                        name="cart-checkbox"
                        onChange={(e) => handleChooseItem(e, item)}
                      />
                      <img
                        src={`http://localhost:4000/images/${item.image_url}`}
                        alt=""
                      />
                      <p>{item.name}</p>
                      <p>{formatCurrency(item.price)}</p>
                      <div className="cart-counter">
                        <button onClick={() => handleDecreaseQuantity(index)}>
                          -
                        </button>
                        <input
                          className="cart-quantity"
                          type="text"
                          value={item.quantity}
                          onFocus={(e) => (e.target.value = "")}
                          onBlur={(e) => handleConfirmQuantity(e, index)}
                          onChange={(e) => handleQuantityInput(e, index)}
                        />
                        <button onClick={() => handleIncreaseQuantity(index)}>
                          +
                        </button>
                      </div>
                      <p>
                        {!isNaN(item.quantity)
                          ? formatCurrency(item.price * item.quantity)
                          : formatCurrency(0)}
                      </p>
                      <p
                        className="cross"
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        x
                      </p>
                    </div>
                    {index < cart.length - 1 && <hr />}
                  </div>
                );
              }
            })}
          </div>
          <div className="select-voucher">
            <button
              className="select-voucher-btn"
              onClick={() => setShowVouchersPopup(true)}
            >
              Chọn ưu đãi
            </button>
            {appliedVoucher && appliedVoucher?.code && (
              <div className="voucher-applied">
                <button
                  className="unapplied-voucher-btn"
                  onClick={handleUnAppliedVoucher}
                >
                  x
                </button>
                <Tippy
                  content={
                    appliedVoucher.discount_type === "percentage"
                      ? `Giảm ${formatPercent(
                          appliedVoucher.discount_value
                        )} tối đa ${formatCurrency(
                          appliedVoucher.max_discount_amount
                        )}` +
                        `. Áp dụng cho đơn tối thiểu ${formatCurrency(
                          appliedVoucher.min_order_amount
                        )}`
                      : `Giảm ${formatCurrency(
                          appliedVoucher.discount_value
                        )}` +
                        `. Áp dụng cho đơn tối thiểu ${formatCurrency(
                          appliedVoucher.min_order_amount
                        )}`
                  }
                >
                  <p className="voucher-applied-box">
                    Ưu đãi: {appliedVoucher?.code}
                  </p>
                </Tippy>
              </div>
            )}
          </div>
          <div className="cart-bottom">
            <div className="cart-total box">
              <div>
                <div className="cart-total-details">
                  <p>Tổng cộng</p>
                  <p>{formatCurrency(totalSelectedFood)}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Ưu đãi</p>
                  <p className="discount">
                    {formatCurrency(calculateDiscount())}
                  </p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Thành tiền</p>
                  <b>
                    {/* {convertNumberToWords(total).charAt(0).toUpperCase() +
                      convertNumberToWords(total).slice(1)} */}
                    {formatCurrency(
                      totalSelectedFood - calculateDiscount() < 0
                        ? 0
                        : totalSelectedFood - calculateDiscount()
                    )}
                  </b>
                </div>
              </div>
              <button onClick={handleOrder}>
                {isPending && (
                  <FontAwesomeIcon icon={faSpinner} className="spinner" />
                )}
                Đặt hàng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

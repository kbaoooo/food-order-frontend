import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { formatCurrency, formatDate } from "../../helpers";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { customRound } from "../../helpers";
import "./FoodDetail.css";

import axios from "axios";

function FoodDetail() {
  const [food, setFood] = useState({});
  const [comments, setComments] = useState([]);

  const {
    token,
    setShowLogin,
    apiUrl,
    handleShowPopupMessage,
    setUpdateTotalCart,
  } = useContext(StoreContext);
  const TOKEN = token();
  const ratingStars = [
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
        />
      ),
    },
  ];

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchFood = async () => {
      try {
        const response = await axios.get(`${apiUrl}/menu/get-food/${id}`);
        const result = response.data;
        const { success, data } = result;

        if (success && data) {
          setFood(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/review/get-reviews/${id}`);

        const result = response.data;

        const { success, data } = result;

        if (success && data) {
          setComments(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchComments();
  }, []);


  const handleAddToCart = async () => {
    if (!TOKEN) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/cart/update-cart`,
        {
          item_id: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const result = response.data;
      if (result.success && result.data) {
        setUpdateTotalCart(Math.random());
        handleShowPopupMessage(
          {
            show: true,
            message: "Đã thêm vào giỏ hàng",
            iconImage: assets.tomatoImage,
          },
          1500
        );
      } else {
        handleShowPopupMessage({
          show: true,
          message: "Thêm vào giỏ hàng thất bại :(",
          iconImage: assets.sadEmoji64,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="food-detail-container">
      <div className="food-detail-wrapper">
        <img
          src={`http://localhost:4000/images/${food.image_url}`}
          className="display-img box"
          alt=""
        />
        <div className="food-detail box">
          <h2 className="food-detail-name">{food.item_name}</h2>
          <span className="sold">
            <b>({customRound(food.average_rating)}*)</b> Đánh giá
          </span>
          <p className="food-detail-cate">Phân loại: {food.category_name}</p>
          <p className="food-detail-price">{formatCurrency(food.price)}</p>
          <p className="food-detail-description">
            Mô tả món ăn: {food.description}
          </p>
          <button className="food-detail-btn" onClick={handleAddToCart}>
            <img
              src={assets.shopping_cart_tomato}
              style={{ width: "24px" }}
              alt=""
            />
            <p>Thêm vào giỏ hàng</p>
          </button>
        </div>
      </div>
      <div className="food-detail-comments box">
        <h2>Bình luận</h2>
        <div className="comments">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div className="comment" key={index}>
                <div className="comment-user">
                  <div className="img-circle">
                    <img src={assets.profile_icon} alt="" />
                  </div>
                  <p className="user">
                    <b>{comment.username}</b>
                    <span className="date-review">
                      {formatDate(comment.created_at)}
                    </span>
                  </p>
                  <div className="stars-cmt">
                    {ratingStars.map((star, index) => {
                      return comment.rating >= index + 1
                        ? star.starColor
                        : star.starEmpty;
                    })}
                  </div>
                </div>
                <p className="comment-content">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p style={{ marginTop: "10px", textDecoration: "underline" }}>
              Món ăn chưa có bình luận nào
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodDetail;

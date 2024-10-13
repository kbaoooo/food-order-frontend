import "./FeedBack.css";
import { useEffect, useState, useContext, useRef } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";
import { formatCurrency, customRound } from "../../helpers";

function FeedBack() {
  const [feedback, setFeedback] = useState(null);
  const [food, setFood] = useState(null);
  const { apiUrl, token, setShowLogin, handleShowPopupMessage } =
    useContext(StoreContext);
  const { item_id, order_id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const commentRef = useRef(null);

  const TOKEN = token();

  if (!item_id) {
    navigate("/page-not-found");
  }

  if (!TOKEN) {
    navigate("/");
    setShowLogin(true);
  }

  const ratingStars = [
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(1)}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(1)}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(2)}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(2)}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(3)}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(3)}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(4)}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(4)}
        />
      ),
    },
    {
      starEmpty: (
        <img
          src={assets.star_empty}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(5)}
        />
      ),
      starColor: (
        <img
          src={assets.star_color}
          alt=""
          key={Math.random()}
          onClick={() => handleRating(5)}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/review/get-review-by-user/${order_id}/${item_id}`,
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (response && response.data) {
          const result = response.data;
          if (result && result.success && result.data) {
            setFeedback(result.data);
          } else {
            setFeedback(null);
          }
        }
      } catch (error) {
        setFeedback(null);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`${apiUrl}/menu/get-food/${item_id}`);

        if (response && response.data) {
          const result = response.data;

          if (result && result.success && result.data) {
            setFood(result.data);
          } else {
            navigate("/page-not-found");
          }
        }
      } catch (error) {
        navigate("/page-not-found");
      }
    };

    if (TOKEN && item_id) {
      fetchFood();
    }
  }, []);

  const handleRating = (rate) => {
    setRating((prev) => {
      if (prev === rate) {
        return 0;
      }
      return rate;
    });
  };

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };

  const handlePostReview = async () => {
    if (!TOKEN) {
      setShowLogin(true);
      return;
    }

    if (rating === 0) {
      handleShowPopupMessage(
        {
          show: true,
          message: "Vui lòng đánh giá sao cho món ăn",
          iconImage: assets.starFace,
        },
        1500
      );
      return;
    }

    if (comment.trim() === "") {
      handleShowPopupMessage(
        {
          show: true,
          message: "Hãy để lại đánh giá của bạn",
          iconImage: assets.starFace,
        },
        1500
      );
      commentRef.current.focus();
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/review/post-review`,
        {
          item_id,
          order_id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      const result = response.data;
      console.log(result);

      if (result.success && result.data) {
        handleShowPopupMessage(
          {
            show: true,
            message: "Cảm ơn bạn đã đánh giá món ăn của chúng tôi",
            iconImage: assets.tomatoImage,
          },
          2000,
          () => {
            setRating(0);
            setComment("");
            navigate(`/food/${item_id}`);
          }
        );
      } else {
        handleShowPopupMessage({
          show: true,
          message: "Đánh giá thất bại :(",
          iconImage: assets.sadEmoji64,
        });
      }
    } catch (error) {
      console.log(error);

      handleShowPopupMessage({
        show: true,
        message: "Đánh giá thất bại :(",
        iconImage: assets.sadEmoji64,
      });
    }
  };

  return (
    <>
      {feedback ? (
        <p className="feedbacked">
          Bạn đã đánh giá cho sản phẩm này. <Link to={`/food/${item_id}`} className="feedbacked-link">Xem bình luận</Link>
        </p>
      ) : (
        <div className="feedback-container">
          <div className="feedback-wrapper">
            <h2>Đánh giá món ăn của chúng tôi</h2>
            <div className="feedback-content">
              <div className="feedback-header box">
                <div className="feedback-header-left">
                  <img
                    src={
                      food && `http://localhost:4000/images/${food?.image_url}`
                    }
                    alt="food"
                  />
                </div>
                <div className="feedback-header-right">
                  <div className="feedback-food-info">
                    <h3>{food && food?.item_name}</h3>
                    <span className="sold">
                      <b>({customRound(food?.average_rating)}*)</b> Đánh giá
                    </span>
                    <p>Phân loại: {food && food?.category_name} </p>
                    <p>Mô tả: {food && food?.description}</p>
                    <p>Giá: {food && formatCurrency(food?.price)}</p>
                  </div>
                  <div className="feedback-essay">
                    <p>
                      Nhà hàng Tomato xin chân thành cảm ơn quý khách đã lựa
                      chọn thưởng thức các món ăn của chúng tôi. Chúng tôi hy
                      vọng rằng các món ăn đã mang đến cho quý khách những trải
                      nghiệm ẩm thực tuyệt vời. Nếu quý khách hài lòng, chúng
                      tôi rất mong nhận được những đánh giá tích cực từ quý
                      khách. Những lời đánh giá của quý khách sẽ giúp chúng tôi
                      tiếp tục duy trì và nâng cao chất lượng món ăn, mang đến
                      hương vị đặc trưng mà quý khách yêu thích. Xin chân thành
                      cảm ơn và hẹn gặp lại quý khách!
                    </p>
                  </div>
                </div>
              </div>
              <div className="feedback-reviews box">
                <h2>Đánh giá</h2>
                <p>
                  Nếu cảm thấy hài lòng, vui lòng đánh giá 5 sao cho chúng tôi
                </p>
                <div className="stars">
                  {ratingStars.map((star, index) => {
                    return rating >= index + 1
                      ? star.starColor
                      : star.starEmpty;
                  })}
                </div>
                <p
                  style={{
                    marginTop: "35px",
                    color: "#333",
                    fontWeight: "bold",
                    fontSize: "17px",
                  }}
                >
                  Đánh giá của bạn về món ăn của chúng tôi
                </p>
                <textarea
                  ref={commentRef}
                  placeholder="Viết đánh giá của bạn"
                  className="write-comment"
                  onChange={handleChangeComment}
                  value={comment}
                ></textarea>
                <div className="review-btn">
                  <button
                    className="post-review-btn"
                    onClick={handlePostReview}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedBack;

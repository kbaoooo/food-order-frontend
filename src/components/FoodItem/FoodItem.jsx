import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";
import { useContext, useState } from "react";
import { customRound, formatCurrency } from "../../helpers";
import axios from "axios";
import sadEmoji64 from "../../assets/sad-emoji64.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { assets } from "../../assets/assets";
import {
  faHeart,
  faStarHalfAlt,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faFullHeart,
  faStar as faStarFull,
} from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";

const FoodItem = ({
  id,
  name,
  price,
  description,
  image,
  is_favour,
  rating,
  available,
}) => {
  const { token, setShowLogin, handleShowPopupMessage, apiUrl } =
    useContext(StoreContext);
  const [favour, setFavour] = useState(is_favour);
  const TOKEN = token();

  const ratingValue = customRound(rating);
  const isInt = Number.isInteger(ratingValue) ? true : false;

  const handleToggleFavour = async () => {
    if (!TOKEN) {
      setShowLogin(true);
      return;
    }

    setFavour(!favour);

    try {
      const response = await axios.post(
        `${apiUrl}/favour/toggle-favour`,
        {
          item_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const result = response.data;

      if (!result.success) {
        setFavour(!favour);
        const popupInfo = {
          show: true,
          message: "Thao tác thất bại",
          iconImage: sadEmoji64,
        };

        handleShowPopupMessage(popupInfo);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="food-item">
      {!available && (
        <div className="food-item-overlay">
          <img
            className="out-of-stock"
            src={assets.outOfStock}
            alt="out of stock"
          />
        </div>
      )}
      <div className="food-item-img-container">
        <img
          className="food-item-img"
          src={`http://localhost:4000/images/${image}`}
          alt={name}
        />
        {favour ? (
          <Tippy content="Yêu thích">
            <div className="favour-btn" onClick={handleToggleFavour}>
              <FontAwesomeIcon icon={faFullHeart} className="favour" />
            </div>
          </Tippy>
        ) : (
          <Tippy content="Yêu thích">
            <div className="favour-btn" onClick={handleToggleFavour}>
              <FontAwesomeIcon icon={faHeart} className="unfavour" />
            </div>
          </Tippy>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <Link className="food-item-name" to={`/food/${id}`}>
            {name}
          </Link>
          <div className="food-item-rating">
            {[1, 2, 3, 4, 5].map((_, index) => {
              if (isInt) {
                if (index < ratingValue) {
                  return <FontAwesomeIcon key={index} icon={faStarFull} />;
                }
              }

              if (!isInt) {
                if (index < ratingValue - 1) {
                  return <FontAwesomeIcon key={index} icon={faStarFull} />;
                }

                if (index === Math.round(ratingValue - 1)) {
                  return <FontAwesomeIcon key={index} icon={faStarHalfAlt} />;
                }
              }

              return <FontAwesomeIcon key={index} icon={faStar} />;
            })}
          </div>
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">{formatCurrency(price)}</p>
        <p style={{ textAlign: "right" }}>
          <Link className="food-item-view-detail" to={`/food/${id}`}>
            Xem chi tiết
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FoodItem;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassHalf,
  faCircleCheck,
  faUtensils,
  faTruckFast,
  faHouseCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./Tabs.css";
import { assets } from "../../assets/assets";
import { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import classNames from "classnames";

function Tabs({ curent_status }) {
  return (
    <div className="tabs-container">
      <div className="tabs-wrapper">
        <ul>
          <li className={
            classNames({
              "tabs-active": curent_status === "pending"
            })
          }>
            {curent_status === "pending" && (
              <div className="tabs-pointer">
                <img src={assets.tomatoImage} alt="" />
              </div>
            )}
            <div>
              <span className="tabs-icon">
                <FontAwesomeIcon icon={faHourglassHalf} />
              </span>
              <span className="tabs-text">Đang xác nhận</span>
            </div>
          </li>
          <li
            className={
              classNames({
                "tabs-active": curent_status === "confirmed"
              })
            }
          >
            {curent_status === "confirmed" && (
              <div className="tabs-pointer">
                <img src={assets.tomatoImage} alt="" />
              </div>
            )}
            <div>
              <span className="tabs-icon">
                <FontAwesomeIcon icon={faCircleCheck} />
              </span>
              <span className="tabs-text">Đã xác nhận</span>
            </div>
          </li>
          <li
            className={
              classNames({
                "tabs-active": curent_status === "preparing"
              })
            }
          >
            {curent_status === "preparing" && (
              <div className="tabs-pointer">
                <img src={assets.tomatoImage} alt="" />
              </div>
            )}
            <div>
              <span className="tabs-icon">
                <FontAwesomeIcon icon={faUtensils} />
              </span>
              <span className="tabs-text">Đang làm món ăn</span>
            </div>
          </li>
          <li
            className={
              classNames({
                "tabs-active": curent_status === "delivering"
              })
            }
          >
            {curent_status === "delivering" && (
              <div className="tabs-pointer">
                <img src={assets.tomatoImage} alt="" />
              </div>
            )}
            <div>
              <span className="tabs-icon">
                <FontAwesomeIcon icon={faTruckFast} />
              </span>
              <span className="tabs-text">Đang giao hàng</span>
            </div>
          </li>
          <li
            className={
              classNames({
                "tabs-active": curent_status === "completed"
              })
            }
          >
            {curent_status === "completed" && (
              <div className="tabs-pointer">
                <img src={assets.tomatoImage} alt="" />
              </div>
            )}
            <div>
              <span className="tabs-icon">
                <FontAwesomeIcon icon={faHouseCircleCheck} />
              </span>
              <span className="tabs-text">Giao hàng thành công</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Tabs;

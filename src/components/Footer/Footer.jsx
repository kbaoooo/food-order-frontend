import { assets } from '../../assets/assets';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className='footer-content'>
        <div className='footer-content-left'>
          <img src={assets.logo} alt="" />
          <p>Tomato là nhà hàng chuyên phục vụ các món ăn tươi ngon, hấp dẫn, mang hương vị đậm đà từ những nguyên liệu tự nhiên, hứa hẹn mang đến trải nghiệm ẩm thực độc đáo và đầy cảm hứng cho thực khách.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className='footer-content-center'>
          <h2>NHÀ HÀNG</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Giao hàng</li>
            <li>Chính sách & Bảo mật</li>
          </ul>
        </div>
        <div className='footer-content-right'>
          <h2>LIÊN HỆ</h2>
          <ul>
            <li>+84 386 204 932</li>
            <li>contact@tomato.com</li>
          </ul>
        </div>
      </div>
      <hr />

      <p className='footer-copyright'>
        &copy;Copyright 2024 Tomato. All rights reserved.
      </p>
    </div>
  )
}

export default Footer

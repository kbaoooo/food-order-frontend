/* eslint-disable react/prop-types */
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({
  category,
  setCategory
}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Khám phá thực đơn của chúng tôi</h1>
      <p className='explore-menu-text'>Lựa chọn từ thực đơn đa dạng với nhiều món ăn hấp dẫn được chế biến từ các nguyên liệu tươi ngon nhất và chuyên môn ẩm thực cao của các đầu bếp hàng đầu Việt Nam. Bữa ăn của chúng tôi sẽ đem đến chất lượng tuyệt vời nhất và nâng trải nghiệm ăn uống của thực khách lên một tầm cao mới.</p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div onClick={() => setCategory((prev) => prev === item.menu_name ? "all" : item.menu_name)} key={index} className='explore-menu-list-item'>
              <img className={category === item.menu_name ? 'active' : ''} src={item.menu_image} alt={item.name} />
              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu

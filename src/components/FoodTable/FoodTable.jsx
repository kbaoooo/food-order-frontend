import "./FoodTable.css";
import { formatCurrency } from "../../helpers";

function FoodTable({ data }) {
  return (
    <div className="list-table">
      <div className="list-table-format title">
        <b>Món ăn</b>
        <b>Phân loại</b>
        <b>Số lượng</b>
        <b>Tổng cộng</b>
      </div>
      {data &&
        data.map((item, index) => (
          <div key={index} className="list-table-format">
            <div className="flex list-table-format-product">
              <img
                src={`http://localhost:4000/images/${item.image_url}`}
                alt={item.name}
              />
              <p>{item.name}</p>
            </div>
            <p>{item.category_name}</p>
            <p>{item.quantity}</p>
            <p>{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
    </div>
  );
}

export default FoodTable;

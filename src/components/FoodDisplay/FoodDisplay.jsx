import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, title, food_list }) => {
  console.log("food_list", food_list);
  
  return (
    <div className="food-display" id="foot-display">
      <h2>{title}</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          
          if (category === "all" || category === item.category_name) {  
            return (
              <FoodItem
                key={index}
                id={item.item_id}
                name={item.item_name || item.name}
                description={item.description}
                price={item.price}
                image={item.image_url}
                is_favour={item.is_favour}
                rating={item.average_rating}
                available={item.available}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;

import "./Favour.css";
import { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { useNavigate } from "react-router-dom";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import axios from "axios";

function Favour() {
  const navigate = useNavigate();
  const { apiUrl, token, setShowLogin } = useContext(StoreContext);
  const [favourList, setFavourList] = useState([]);
  const [category, setCategory] = useState("all");

  const TOKEN = token();

  if (!TOKEN) {
    navigate("/");
    setShowLogin(true);
  }

  useEffect(() => {
    const fetchFavourList = async () => {
      try {
        const response = await axios.get(`${apiUrl}/favour/get-favours`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const result = response.data;

        if (result.success && result.data) {
          setFavourList(result.data);
        } else {
          setFavourList([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavourList();
  }, []);
  console.log(favourList);

  return (
    <div className="favour-container">
      <ExploreMenu category={category} setCategory={setCategory} />
      {favourList.length > 0 ? (
        <FoodDisplay title="Món ăn yêu thích" food_list={favourList} category={category}/>
      ) : (
        <div className="no-favour">Chưa có món ăn yêu thích nào</div>
      )}
    </div>
  );
}

export default Favour;

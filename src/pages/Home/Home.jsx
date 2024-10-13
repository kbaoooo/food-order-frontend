import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import Header from "../../components/Header/Header";
import "./Home.css";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import axios from "axios";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const [food_list, setFoodList] = useState([]);

  const { apiUrl, token, setShowAddressPopup } = useContext(StoreContext);
  const [category, setCategory] = useState("all");

  const TOKEN = token();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const result = response.data;

        if (result && result.success && result.data) {
          if (!result.data.phone_number || !result.data.address) {
            setShowAddressPopup(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (TOKEN) {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const fetchFoodList = async () => {
      const myDecodedToken = await decodeToken(token());

      const response = await axios.post(`${apiUrl}/menu/get-menu`, {
        user_id: myDecodedToken?.user_id || null,
      });
      const result = response.data;
      const data = result.data || [];

      setFoodList(data);
    };
     
    fetchFoodList();
    const interval = setInterval(() => {
      fetchFoodList();
    }
    , 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay title="Thực đơn" category={category} food_list={food_list} />
      <AppDownload />
    </div>
  );
};

export default Home;

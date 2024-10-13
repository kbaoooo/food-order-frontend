// Page404.js
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px", height: "250px" }}>
      <h1>404</h1>
      <p>Oops! Có vẻ như trang web của bạn tìm kiếm không tồn tại :(</p>
      <p style={{marginTop: '10px', fontSize: '14px', color: 'gray'}}> Hãy quay trở về trang chủ.</p>
      <Link
        to="/"
        style={{
          color: "tomato",
          marginTop: "15px",
          display: "inline-block",
          fontWeight: "bold",
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
};

export default Page404;

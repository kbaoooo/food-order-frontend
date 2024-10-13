import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { CircularProgress, Alert } from "@mui/material";
import "./VerifyEmail.css";

function VerifyEmail() {
  const { apiUrl, token } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const TOKEN = token();

  const emailToken = searchParams.get("emailToken");

  if (!TOKEN && !emailToken) {
    navigate("/");
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (response && response.data) {
          const result = response.data;

          if (result && result.success && result.data) {
            const user = result.data;
            setUser(user);
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
    (async () => {
      if (emailToken) {
        try {
          const response = await axios.post(`${apiUrl}/auth/verify-email`, {
            email_token: emailToken,
          });
          setIsLoading(true);

          if (response && response.data) {
            const result = response.data;

            if (result.success && result.data) {
              const { user, token } = result.data;

              if (user && token) {
                if (user?.isVeryfied) {
                  localStorage.setItem("token", token);

                  setTimeout(() => {
                    setUser(user);
                    setIsLoading(false);
                  }, 3000);
                } else {
                  setError("Xác thực email không thành công. Vui lòng thử lại");
                }
              }
            }
          }
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    })();
  }, [emailToken, user]);

  return (
    <div>
      {!emailToken && !user && (
        <p className="verify-email">
          Hãy xác thực tài khoản của bạn trong email
        </p>
      )}
      {emailToken && isLoading && !user && (
        <div className="verifying">
          <CircularProgress />
          <p>Email của bạn đang được xác thực ...</p>
        </div>
      )}
      <div>
        {!user?.isVeryfied ? (
          <div>{error ? <Alert severity="error">{error}</Alert> : null}</div>
        ) : (
          <div className="validation-success">
            <Alert severity="success">Xác thực email thành công</Alert>
            <Link
              to="/"
              style={{
                color: "tomato",
                marginTop: "15px",
                display: "inline-block",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Về trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;

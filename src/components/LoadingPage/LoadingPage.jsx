import "./LoadingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function LoadingPage({ content }) {
  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        {content || <p>Đang xử lý giao dịch</p>}
        <FontAwesomeIcon icon={faSpinner} className="spinner loading-icon" />
      </div>
    </div>
  );
}

export default LoadingPage;

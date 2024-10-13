import './PopupConfirm.css'

function PopupConfirm({ question, message, onConfirm, onCancel }) {
  return (
    <div className="popup-confirm-container">
      <div className="popup-confirm-wrapper">
        <h2>{question}</h2>
        <p>{message}</p>
        <div className="popupconfirm-buttons">
          <button onClick={onConfirm} className='popup-confirm-btn-yes'>Có</button>
          <button onClick={onCancel} className='popup-confirm-btn-no'>Không</button>
        </div>
      </div>
    </div>
  )
}


export default PopupConfirm
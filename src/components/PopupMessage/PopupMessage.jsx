import './PopupMessage.css';

function PopupMessage({message, iconImage}) {
  return (
    <div className='popup-container'>
        <div className='popup-wrapper'>
            <img src={iconImage} alt="" className='popup-icon'/>
            <p className='popup-message'>{message}</p>
        </div>
    </div>
  )
}

export default PopupMessage

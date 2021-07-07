function ImagePopup(props) {
  return (
    <div className={`popup popup_type_image ${props.isOpen && 'popup_is-opened'}`}>
      <div className="popup__image-container">
        <img src={props.card.link} alt={props.card.name} className="popup__image" />
        <p className="popup__image-title">{props.card.name}</p>
        <button type="button" className="popup__close popup-close" onClick={props.onClose} />
      </div>
    </div>
  );
}

export default ImagePopup;

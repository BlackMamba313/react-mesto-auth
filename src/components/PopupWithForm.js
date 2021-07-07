function PopupWithForm(props) {
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen && 'popup_is-opened'}`}>
      <div className="popup__body">
        <form className="popup__form" name={props.name} onSubmit={props.onSubmit} method="post">
          <button type="button" onClick={props.onClose} className="popup__close popup-close" />
          <h2 className="popup__title">{props.title}</h2>
          {props.children}
          <button className="popup__btn-save" type="submit">
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;

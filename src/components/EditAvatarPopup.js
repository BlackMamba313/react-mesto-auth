import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      title="Обновить аватар"
      name="avatar"
      buttonText="Сохранить"
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_avatarLink"
        name="avatarLink"
        id="avatarLink"
        placeholder="Ссылка на картинку"
        type="url"
        required
        ref={avatarRef}
      />
      <span className="popup__error" id="avatarLink-error" />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;

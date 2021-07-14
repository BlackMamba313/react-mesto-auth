import { useState, useContext, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = useContext(CurrentUserContext);


  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);


  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAboutChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen ? 'popup_is-opened' : ''}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isSaving={props.isSaving}
      name="person"
      title="Редактировать профиль"
    >
      <input
        className="popup__input popup__input_name"
        name="name"
        id="name"
        minLength="2"
        maxLength="40"
        placeholder="Имя"
        required
        type="text"
        value={name || ''}
        onChange={handleNameChange}
      />
      <span className="popup__error" id="name-error" />
      <input
        className="popup__input popup__input_text"
        name="job"
        id="job"
        minLength="2"
        maxLength="200"
        placeholder="Вид деятельности"
        required
        type="text"
        onChange={handleAboutChange}
        value={description || ''}
      />
      <span className="popup__error" id="job-error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;

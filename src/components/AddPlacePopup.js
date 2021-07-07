import { useState } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({ name, link });
  }

  return (
    <PopupWithForm
      title="Новое место"
      name="add"
      onSubmit={handleSubmit}
      onClose={props.onClose}
      isOpen={props.isOpen}
    >
      <input
        className="popup__input popup__input_title"
        name="title"
        id="title"
        required
        minLength="2"
        type="text"
        maxLength="30"
        placeholder="Название"
        onChange={handleNameChange}
        value={name}
      />
      <span className="popup__error" id="title-error" />
      <input
        className="popup__input popup__input_url"
        name="link"
        id="link"
        placeholder="Ссылка на картинку"
        type="url"
        required
        onChange={handleLinkChange}
        value={link}
      />
      <span className="popup__error" id="link-error" />
    </PopupWithForm>
  );
}

export default AddPlacePopup;

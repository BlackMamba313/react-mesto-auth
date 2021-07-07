import { useContext } from 'react';
import deleteIcon from '../images/deleteIcon.svg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = props.cardData.owner._id === currentUser._id;
  const isLiked = props.cardData.likes.some((i) => i._id === currentUser._id);

  function handleClick() {
    props.onCardClick(props.cardData);
  }

  function handleLike() {
    props.onCardLike(props.cardData);
  }

  function handleDeleteClick() {
    props.onDeleteClick(props.cardData);
  }
  const cardDeleteButtonClassName = isOwn ? 'elements__delete-btn' : 'elements__delete-btn_hidden';
  const cardLikeButtonClassName = `elements__like-btn ${
    isLiked ? 'elements__like-btn_active' : ''
  }`;
  return (
    <article className="elements__card">
      <div className="elements__img-container">
        <img
          src={deleteIcon}
          alt="Удалить"
          onClick={handleDeleteClick}
          className={cardDeleteButtonClassName}
        />
        <img
          src={props.cardData.link}
          alt={props.cardData.name}
          className="elements__image popup-link"
          onClick={handleClick}
        />
      </div>
      <div className="elements__info">
        <h2 className="elements__title">{props.cardData.name}</h2>
        <div className="elements__likes">
          <button onClick={handleLike} className={cardLikeButtonClassName} />
          <p className="elements__likesCounter">{props.cardData.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;

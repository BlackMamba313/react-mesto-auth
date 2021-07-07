import { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  if (!currentUser) {
    return (
      <section className="loading">
        <span className="profile__preloader" />
      </section>
    );
  }

  return (
    <>
      <main>
        <section className="profile">
          <img
            onClick={props.onEditAvatar}
            className="profile__avatar"
            src={currentUser.avatar}
            alt="Аватар"
          />
          <div className="profile__info">
            <div className="profile__title-box">
              <h1 className="profile__title">{currentUser.name}</h1>
              <button onClick={props.onEditProfile} type="button" className="profile__edit-btn" />
            </div>
            <p className="profile__subtitle">{currentUser.about}</p>
          </div>
          <button
            onClick={props.onAddPlace}
            type="button"
            className="profile__add-btn popup-link"
          />
        </section>

        <section className="elements">
          {props.cards.map((item, index) => (
            <Card
              cardData={item}
              key={index}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onDeleteClick={props.onDeleteClick}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default Main;

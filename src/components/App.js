import { useState, useEffect } from 'react';
import {Switch, Route, useHistory} from "react-router-dom";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import InfoToolTip from './InfoTooltip';
import Register from './Register'
import ProtectedRoute from './ProtectedRoute';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ClosePopup from './ClosePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import auth from '../utils/auth'

function App() {
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
    const [currentUser, setCurrentUser] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([user, cards]) => {
                setCurrentUser(user);
                setCards(cards.slice(0, 100));
            })
            .catch((err) => console.log(err));
    }, []);

    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    };
    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    };
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    };
    function handleCardClick(card) {
        setSelectedCard({ name: card.name, link: card.link });
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api
            .likeCard(card._id, !isLiked)
            .then((newCard) => {
                setCards(cards => cards.map((c) => (c._id === card._id ? newCard : c)))
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api
            .deleteCard(card._id)
            .then(() => {
                setCards( cards.filter((c) => c._id !== card._id))
                closeAllPopups()
            })
            .catch((err) => console.log(err))
    }

    function handleUpdateUser(user) {
        api
            .setUserInfo(user)
            .then((user) => {setCurrentUser(user)
                closeAllPopups()})
            .catch((err) => console.log(err))

    }

    function handleUpdateAvatar(avatar) {
        api
            .setAvatar(avatar)
            .then((avatar) => {setCurrentUser(avatar)
                closeAllPopups()})
            .catch((err) => console.log(err))
    }

    function handleAddPlaceSubmit(card) {
        api
            .postNewCard(card)
            .then((card) => {setCards([card, ...cards])
                closeAllPopups()})
            .catch((err) => console.log(err))
    }

    const closeAllPopups = () => {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard({ name: '', link: '' });
    };

    return (
        <>
            <CurrentUserContext.Provider value={currentUser}>
                <Header />
                <Main
                    onEditProfile={handleEditProfileClick}
                    onEditAvatar={handleEditAvatarClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onDeleteClick={handleCardDelete}
                />
                <Footer />
                {isEditProfilePopupOpen ? (
                    <ClosePopup>
                        <EditProfilePopup
                            isOpen={isEditProfilePopupOpen}
                            onClose={closeAllPopups}
                            onUpdateUser={handleUpdateUser}
                        />
                    </ClosePopup>
                ) : (
                    ''
                )}
                {isAddPlacePopupOpen ? (
                    <ClosePopup>
                        <AddPlacePopup
                            isOpen={isAddPlacePopupOpen}
                            onClose={closeAllPopups}
                            onAddPlace={handleAddPlaceSubmit}
                        />
                    </ClosePopup>
                ) : (
                    ''
                )}
                {isEditAvatarPopupOpen ? (
                    <ClosePopup>
                        <EditAvatarPopup
                            isOpen={isEditAvatarPopupOpen}
                            onClose={closeAllPopups}
                            onUpdateAvatar={handleUpdateAvatar}
                        />
                    </ClosePopup>
                ) : (
                    ''
                )}
                {selectedCard.link ? (
                    <ClosePopup>
                        <ImagePopup isOpen={selectedCard.link} card={selectedCard} onClose={closeAllPopups} />
                    </ClosePopup>
                ) : (
                    ''
                )}
            </CurrentUserContext.Provider>
        </>
    );
}

export default App; 
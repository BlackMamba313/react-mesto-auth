import { useState, useEffect } from 'react';
import {Switch, Route, useHistory} from "react-router-dom";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ClosePopup from './ClosePopup';
import Login from "./Login"
import InfoToolTip from "./InfoTooltip";
import Register from "./Register"
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import auth from '../utils/auth';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
  const [currentUser, setCurrentUser] = useState([]);
  const [isInfoPopupOpen,setIsInfoPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [email, setEmail] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegSucces, setIsRegSucces] = useState(false)
  const history = useHistory();

    useEffect(() => {
        handleCheckToken();
        api.getUserInfo().then((info) => {
            setCurrentUser(info);
        })
            .catch(err => console.log(err))
        api.getInitialCards()
            .then((info) => {
                setCards(info)
            })
            .catch((err) => console.log(err))
    }, [])

  function handleCheckToken(){
    const jwt =localStorage.getItem("jwt");
    if (jwt){
      auth.getToken(jwt)
          .then((res) => {
            setIsLoggedIn(true)
            setEmail(res.data.email)
            history.push('/');
          })
          .catch(err => {
            if (err.status === 400) {
              console.log('400 — Токен не передан или передан не в том формате')
            }
            console.log('401 — Переданный токен некорректен')
          })
    }
  }

  function handleRegSubmit(email,password){
    auth.register(email,password)
        .then(res=>{
          setIsInfoPopupOpen(true);
          setIsRegSucces(true);
          history.push('/sign-in');

        })
        .catch(err=>{
          if(err.status === 400){
            console.log('Некорректно заполнено одно из полей ')
          }
          setIsInfoPopupOpen(true);
          setIsRegSucces(false);
        })
  }
  function handleLoginSubmit(email,password){
    auth.login(email, password)
        .then(res=>{
          localStorage.setItem("jwt", res.token)
          setIsLoggedIn(true);
          setEmail(email);
          history.push("/")

        })
        .catch((err)=>{
          if(err.status === 400){
            console.log("400 - не передано одно из полей")
          }
          else if(err.status === 401){
            console.log("401 - пользователь с email не найден ")
          }
          return console.log("Error: 500")
        })
  }
  function handleSignout(){
    localStorage.removeItem('jwt');
    setIsLoggedIn(false)
    history.push('/sign-in');
  }



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
    setIsInfoPopupOpen(false)
    setSelectedCard({ name: '', link: '' });
  };

  return (
      <CurrentUserContext.Provider value={currentUser}>
          <Header email={email} onSignOut={handleSignout}/>
          <Switch>
            <Route  path="/sign-in">
              <Login onSubmit={handleLoginSubmit}/>
            </Route>
            <Route  path="/sign-up">
              <Register onSubmit={handleRegSubmit}/>
            </Route>
              <ProtectedRoute exact path="/"
                              component={Main}
                              isLoggedIn={isLoggedIn}
                              onEditProfile={handleEditProfileClick}
                              onAddPlace={handleAddPlaceClick}
                              onEditAvatar={handleEditAvatarClick}
                              onCardClick={handleCardClick}
                              cards={cards}
                              onCardLike={handleCardLike}
                              onCardDelete={handleCardDelete}
              />
          </Switch>
          {isLoggedIn && <Footer/>}
          <InfoToolTip isRegSucces={isRegSucces} isOpen={isInfoPopupOpen} onClose={closeAllPopups}/>
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
  )
}

export default App;

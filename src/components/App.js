import {useState, useEffect} from "react";
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from"./Footer";
import Login from "./Login"
import InfoToolTip from "./InfoTooltip";
import Register from "./Register"
import ProtectedRoute from "./ProtectedRoute";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup"
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import api from "../utils/api";
import * as auth from"../utils/auth"

function App() {
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard(false);
        setIsInfoPopupOpen(false)
    }

    function handleCardClick(props) {
        setSelectedCard(props);
    }

    function handleUpdateUser(name, about) {
        api.(name, about)
            .then((data) => {
                setCurrentUser(data)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    function handleUpdateAvatar(link) {
        api.editUserAvatar(link)
            .then((data) => {
                setCurrentUser(data)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    function handleAddPlaceSubmit(name, link) {
        api.addCard(name, link)
            .then((newCard) => {
                setCard([newCard, ...cards])
            })
            .catch((err) => console.log(err))
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        console.log(isLiked)
        if (!isLiked) {
            api.likeCard(card._id)
                .then((newCard) => {
                    const newCards = cards.map((c) => c._id === card._id ? newCard : c);
                    setCard(newCards);
                })
                .catch(err=>{
                    console.log(err)
                })

        } else {
            api.unlikeCard(card._id)
                .then((newCard) => {
                    const newCards = cards.map((c) => c._id === card._id ? newCard : c);
                    setCard(newCards);
                })
                .catch(err=>{
                    console.log(err)
                })
        }

    }
    function handleCheckToken(){
        const jwt =localStorage.getItem("jwt");
        if (jwt){
            auth.checkToken(jwt)
                .then((res) => {
                    setIsLoggedIn(true)
                    setEmail(res.data.email)
                    history.push('/');
                })
                .catch(err => {
                    if (err.status === 401) {
                        console.log('401 — Токен не передан или передан не в том формате')
                    }
                    console.log('401 — Переданный токен некорректен')
                })
        }
    }
    function handleCardDelete(card) {
        api.deleteCard(card)
            .then(() => {
                const newCards = cards.filter((item) => {
                    return item._id !== card;
                })
                setCard(newCards)
            })
            .catch((err) => console.log(err))
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
    const history = useHistory();
    const [email, setEmail] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegSucces, setIsRegSucces] = useState(false)
    const [cards, setCard] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isInfoPopupOpen,setIsInfoPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState(false);

    useEffect(() => {
        handleCheckToken();
        api.getUserInfo().then((info) => {
            setCurrentUser(info);
        })
            .catch(err => console.log(err))
        api.getInitialCards()
            .then((info) => {
                setCard(info)
            })
            .catch((err) => console.log(err))
    }, [])



    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="App">
                <div className="page">
                    <Header email={email} onSignOut={handleSignout}/>
                    <Switch>
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
                        <Route  path="/sign-in">
                            <Login onSubmit={handleLoginSubmit}/>
                        </Route>
                        <Route  path="/sign-up">
                            <Register onSubmit={handleRegSubmit}/>
                        </Route>
                    </Switch>
                    { isLoggedIn && <Footer/>}

                    <InfoToolTip isRegSucces={isRegSucces} isOpen={isInfoPopupOpen} onClose={closeAllPopups}/>
                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                                      onUpdateUser={handleUpdateUser}/>
                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
                                   onAddPlace={handleAddPlaceSubmit}/>
                    <PopupWithForm name="card-delete" title="Вы уверены?">
                        <button type="submit" className="popup__save">Да</button>
                    </PopupWithForm>
                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                     onUpdateAvatar={handleUpdateAvatar}/>
                    <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;

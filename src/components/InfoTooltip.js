import Fail from "../images/Fail.svg";
import Succesful from "../images/Succesful.svg"
export default function InfoToolTip({onClose, isOpen, isRegSucces}){
    return(
        <div className={isOpen ? `popup_opened popup` :`popup` }>
            <div className="popup__content">
                <button type="button"  className="popup__close" onClick={onClose} ></button>
                <img src={isRegSucces ? Succesful:Fail} className="popup__info-icon" alt="успех регистрации"/>
                <h3 className="popup__title-info">{isRegSucces ?
                    "Вы успешно зарегистрировались":
                    "Что-то пошло не так\n Попробуйте еще раз."
                }</h3>
            </div>
        </div>
    )
}
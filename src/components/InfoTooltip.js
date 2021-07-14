import fail from '../images/FailRegister.svg';
import succesful from '../images/SuccesfulRegister.svg';

export default function InfoToolTip({ onClose, isOpen, isRegSucces }) {
  return (
    <div className={isOpen ? `popup_opened popup` : `popup`}>
      <div className="popup__content">
        <button type="button" className="popup__close" onClick={onClose}></button>
        <img src={isRegSucces ? succesful : fail} className="popup__info-icon" alt="результат" />
        <h3 className="popup__title-info">
          {isRegSucces
            ? 'Вы успешно зарегистрировались'
            : 'Что-то пошло не так Попробуйте еще раз.'}
        </h3>
      </div>
    </div>
  );
}

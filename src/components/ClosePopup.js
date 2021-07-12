import { cloneElement, useEffect } from 'react';

function ClosePopup(props) {
  const { children, ...rest } = props;

  useEffect(() => {
    function closePopupWithEsc(e) {
      if (e.key === 'Escape') {
        children.props.onClose();
      }
    }

    function closePopupWithClick(e) {
      if (e.target.classList.contains('popup')) {
        children.props.onClose();
      }
    }

    document.addEventListener('mousedown', closePopupWithClick);
    document.addEventListener('keydown', closePopupWithEsc);

    return () => {
      document.removeEventListener('mousedown', closePopupWithClick);
      document.removeEventListener('keydown', closePopupWithEsc);
    };
  }, [children]);

  return <>{cloneElement(children, { ...rest })}</>;
}

export default ClosePopup;

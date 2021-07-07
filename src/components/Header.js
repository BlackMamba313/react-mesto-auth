import mestoLogo from '../images/mestoLogo.svg';

function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={mestoLogo} alt="логотип сайта" />
    </header>
  );
}
export default Header;

import {Link, withRouter} from 'react-router-dom'
import {
  BsHouseFill,
  BsFillBriefcaseFill,
  BsBackspaceReverse,
} from 'react-icons/bs'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar-container">
      <Link to="/">
        <li>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </li>
      </Link>
      <ul className="nav-link-container">
        <li className="nav-link">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>
      <ul className="nav-icon-container">
        <li className="nav-link">
          <Link to="/" className="nav-link">
            <BsHouseFill />
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/jobs" className="nav-link">
            <BsFillBriefcaseFill />
          </Link>
        </li>
        <li className="nav-link" onClick={onClickLogOut}>
          <BsBackspaceReverse />
        </li>
      </ul>
      <button type="button" className="logout-btn" onClick={onClickLogOut}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)

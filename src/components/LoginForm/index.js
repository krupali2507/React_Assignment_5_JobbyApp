import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    failureMessage: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLoginFailure = error => {
    this.setState({failureMessage: error})
  }

  onSubmitLoginCredentials = async event => {
    event.preventDefault()

    const {usernameInput, passwordInput} = this.state

    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username: usernameInput, password: passwordInput}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  renderLoginForm = () => {
    const {usernameInput, passwordInput, failureMessage} = this.state

    return (
      <>
        <form
          className="form-container"
          onSubmit={this.onSubmitLoginCredentials}
        >
          <div className="input-container">
            <label htmlFor="uname" className="label-control">
              USERNAME
            </label>
            <input
              type="text"
              id="uname"
              value={usernameInput}
              className="input-control"
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>
          <div className="input-container">
            <label htmlFor="pwd" className="label-control">
              PASSWORD
            </label>
            <input
              type="password"
              id="pwd"
              value={passwordInput}
              className="input-control"
              onChange={this.onChangePassword}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="error-class">{failureMessage}</p>
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-form-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          {this.renderLoginForm()}
        </div>
      </div>
    )
  }
}

export default LoginForm

import {Component} from 'react'
import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  onSubmitLoginCredentials = async event => {
    event.preventDefault()

    const {usernameInput, passwordInput} = this.state
    const userDetails = {usernameInput, passwordInput}
    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
  }

  renderLoginForm = () => {
    const {usernameInput, passwordInput} = this.state

    return (
      <form className="form-container" onSubmit={this.onSubmitLoginCredentials}>
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
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    )
  }

  render() {
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

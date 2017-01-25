import React from 'react';
import { connect } from 'react-redux';
import { usernameChanged, passwordChanged, login, logout, register, saveState, getState } from '../actions/actions';

class LoginBox extends React.Component {
  render() {
    return (
      <div className="login-box">
        { this.props.hasToken ? (
          <div>
            <div className="login-text">Welcome, {this.props.username}!</div>
            <button onClick={this.props.logout}>Logout</button>
          </div>
        ) : (
          <div>
            <input type="text"
                   className="login-input login-username"
                   value={this.props.username}
                   placeholder="Username"
                   onChange={(e) => this.props.onUsernameChange(e)}/>
            <input type="password"
                   className="login-input login-password"
                   value={this.props.password}
                   placeholder="Password"
                   onChange={(e) => this.props.onPasswordChange(e)}/>
            <button onClick={this.props.login}>Login</button>
            <button onClick={this.props.register}>Register</button>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.getIn(['auth', 'username']),
    password: state.getIn(['auth', 'password']),
    hasToken: !!state.getIn(['auth', 'token'], ""),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => { dispatch(login()); },
    logout: () => { dispatch(logout()); },
    register: () => { dispatch(register()); },
    onUsernameChange: (e) => {
      dispatch(usernameChanged(e.target.value));
    },
    onPasswordChange: (e) => {
      dispatch(passwordChanged(e.target.value));
    }
  }
}

// what
export default connect(mapStateToProps, mapDispatchToProps)(LoginBox);
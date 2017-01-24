import React from 'react';
import { connect } from 'react-redux';
import { usernameChanged, passwordChanged, login, register, saveState, getState } from '../actions/actions';

class LoginBox extends React.Component {
  render() {
    return (
      <div className="login-box">
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
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.getIn(['auth', 'username']),
    password: state.getIn(['auth', 'password']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => { dispatch(login()); },
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
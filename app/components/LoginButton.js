import React from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/actions';

class LoginButton extends React.Component {
  render() {
    return (
      <div className="nav-link login-button">
        <button onClick={this.props.login}>Login</button>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => {
      dispatch(login());
    }
  }
}

// what
export default connect(null, mapDispatchToProps)(LoginButton);
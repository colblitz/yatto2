import React from 'react';
import { connect } from 'react-redux';
import { saveState, getState } from '../actions/actions';

class StateOptions extends React.Component {
  render() {
    return (
      <div className="state-options">
        <button onClick={(e) => this.props.onSaveState(this.props.token)} disabled={!this.props.hasToken}>Save to Account</button><br />
        <button onClick={(e) => this.props.onGetState(this.props.token)} disabled={!this.props.hasToken}>Load from Account</button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    hasToken: !!state.getIn(['auth', 'token'], ""),
    token: state.getIn(['auth', 'token'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveState: (token) => {
      if (token) {
        dispatch(saveState(token));
      }
    },
    onGetState: (token) => {
      if (token) {
        dispatch(getState(token));
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateOptions);
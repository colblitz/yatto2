import React from 'react';
import { connect } from 'react-redux';

class StateOptions extends React.Component {
  render() {
    return (
      <div className="state-options">
        <button>Save to Account</button>
        <button>Load from Account</button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StateOptions);
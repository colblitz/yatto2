import React from 'react';
import { connect } from 'react-redux';

const Test = ({ testValue }) => {
  return (
    <div>
      Test div {testValue}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    testValue: state.get('test')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);
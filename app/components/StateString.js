import React from 'react';
import { connect } from 'react-redux';

class StateString extends React.Component {
  render() {
    return (
      <div className="state-string">
        <h3>Reddit-friendly Summary</h3>
        <div className="state-string-box">
          <textarea id="state" className="state-string-textarea" value={this.props.stateString}></textarea>
          <button id="copy-button" data-clipboard-target="#state">Copy to Clipboard</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stateString: state.get('stateString')
  }
}

export default connect(mapStateToProps, null)(StateString);
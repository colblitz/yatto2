import React from 'react';
import { connect } from 'react-redux';
import { formatChanged } from '../actions/actions';

class DisplayOptions extends React.Component {
  render() {
    return (
      <div className="method-options">
        <h3>Display Options</h3>
        <input type="radio" value={0} name="format" checked={this.props.format == 0} onChange={this.props.formatChange}/>Scientific
        <input type="radio" value={1} name="format" checked={this.props.format == 1} onChange={this.props.formatChange}/>Letters
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    format: state.getIn(['ui', 'format'], 0),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    formatChange: (e) => {
      dispatch(formatChanged(parseInt(e.target.value)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayOptions);
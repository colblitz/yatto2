import React from 'react';
import { connect } from 'react-redux';
import { optionValueChanged } from '../actions/actions';

class OptionInput extends React.Component {
  render() {
    return (
      <div className='optionInputBox'>
        <input type="number"
               className="input optionInput"
               value={this.props.value}
               min="0"
               onChange={(e) => this.props.onOptionValueChange(this.props.key, e)}/>
        <div className="label optionLabel">
          {this.props.label}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    value: state.getIn(['options', ownProps.key], 0),
    key: ownProps.key,
    label: ownProps.label
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOptionValueChange: (key, e) => {
      var value = parseInt(e.target.value);
      if (!isNaN(value)) {
        dispatch(optionValueChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionInput);
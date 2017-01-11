import React from 'react';
import { connect } from 'react-redux';
import { optionValueChanged } from '../actions/actions';

class OptionInput extends React.Component {
  render() {
    return (
      <div className='option-input-box'>
        <input type="number"
               className="input option-input"
               value={this.props.value}
               min="0"
               disabled={this.props.disabled}
               onChange={(e) => this.props.onOptionValueChange(this.props.okey, e)}/>
        <div className="label option-label">
          {this.props.label}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    disabled: state.get('calculatingSteps'),
    value: state.getIn(ownProps.okey, 0),
    okey: ownProps.okey,
    label: ownProps.label
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOptionValueChange: (okey, e) => {
      var value = parseInt(e.target.value);
      if (!isNaN(value)) {
        dispatch(optionValueChanged(okey, value))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionInput);
import React from 'react';
import { connect } from 'react-redux';
import { optionValueChanged } from '../actions/actions';

class OptionCheck extends React.Component {
  render() {
    return (
      <div className='option-input-box'>
        <input type="checkbox"
               className="input option-check"
               checked={this.props.isChecked}
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
    value: state.getIn(ownProps.okey, false),
    okey: ownProps.okey,
    label: ownProps.label
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOptionValueChange: (okey, e) => {
      dispatch(optionValueChanged(okey, e.target.checked));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionCheck);
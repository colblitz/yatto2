import React from 'react';
import { connect } from 'react-redux';
import { optionValueChanged, optionsChanged } from '../actions/actions';

class OptionInput extends React.Component {
  render() {
    return (
      <div className='option-input-box'>
        { this.props.radio &&
          <input type="radio" value={this.props.rvalue} name={this.props.radio} checked={this.props.svalue == this.props.rvalue} onChange={(e) => this.props.optionsChange(this.props.radio, e)}/>
        }
        <input type="number"
               className={"input option-input " + (this.props.radio ? "radio" : "")}
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
  var disabled = state.getIn(['ui', 'calculatingSteps'], false);
  if (ownProps.radio) {
    disabled = disabled || state.getIn(['options', ownProps.radio], -1) != ownProps.rvalue;
  }
  return {
    disabled,
    value: state.getIn(ownProps.okey, 0),
    okey: ownProps.okey,
    label: ownProps.label,
    radio: ownProps.radio,
    rvalue: ownProps.rvalue,
    svalue: state.getIn(['options', ownProps.radio], -1),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onOptionValueChange: (okey, e) => {
      var value = parseInt(e.target.value);
      if (!isNaN(value)) {
        dispatch(optionValueChanged(okey, value))
      }
    },
    optionsChange: (radio, e) => {
      dispatch(optionsChanged(radio, parseInt(e.target.value)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionInput);
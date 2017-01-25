import React from 'react';
import { connect } from 'react-redux';
import OptionInput from './OptionInput';
import OptionCheck from './OptionCheck';
import { toggleAdvanced } from '../actions/actions';

class AdvancedOptionList extends React.Component {
  render() {
    return (
      <div className="options-list advanced-options-list">
        <div className="advanced-options-toggle">
          <h3>Advanced
          { this.props.advanced ? (
            <i className="fa fa-chevron-up" onClick={(e) => this.props.onToggleAdvanced(false)}></i>
          ) : (
            <i className="fa fa-chevron-down" onClick={(e) => this.props.onToggleAdvanced(true)}></i>
          )}
          </h3>
        </div>
        { this.props.advanced &&
          <div>
            <OptionInput okey={['options', 'tps']} label="Taps/second"/>
            <OptionCheck okey={['options', 'useAll']} label="Use all relics"/>
            <OptionCheck okey={['options', 'optimize']} label="Optimize first"/>
            <OptionCheck okey={['options', 'actives']} label="Consider Actives"/>
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    advanced: state.getIn(['options', 'advanced'], false),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleAdvanced: (show) => {
      dispatch(toggleAdvanced(show));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedOptionList);
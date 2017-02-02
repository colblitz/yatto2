import React from 'react';
import { connect } from 'react-redux';
import { tabChanged } from '../actions/actions';

class TabbedPanel extends React.Component {
  getButtonForTab(index, onclick, label) {
    return <button key={index} onClick={onclick}>{label}</button>
  }
  render() {
    var tabButtons = React.Children.map(this.props.children, function(child, i) {
      return this.getButtonForTab(i, (e) => this.props.tabChanged(i), child.props.tabLabel);
    }.bind(this));
    return (
      <div className="tabbed-panel">
        <div className="tab-buttons">
          {tabButtons}
        </div>
        {React.Children.toArray(this.props.children)[this.props.tabIndex]}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tabIndex: state.getIn(['ui', 'tabIndex'], 0),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    tabChanged: (i) => {
      dispatch(tabChanged(i));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabbedPanel);
import React from 'react';

class Panel extends React.Component {
  render() {
    return (
      <div className="panel">
        {this.props.children}
      </div>
    );
  }
}

export default Panel;
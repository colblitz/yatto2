import React from 'react';

class ArtifactInput extends React.Component {
  render() {
    return (
      <div className='artifactInput'>
      	<input type="number" className="input artifactInput" value={this.props.value} onChange={event => this.props.onChange(event)}/>
      	<div className="label artifactLabel">
          {this.props.name}
        </div>
      </div>
    );
  }
}

export default ArtifactInput;
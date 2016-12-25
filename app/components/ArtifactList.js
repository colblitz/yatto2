import React, { PropTypes } from 'react'
import { ArtifactInfo } from '../util/Artifact';
import ArtifactInput from './ArtifactInput';


// function renderArtifactInput(aid) {
//     return <ArtifactInput key={aid} aid={aid} />;
//   }
// function getArtifacts() {
//     return Object.keys(ArtifactInfo)
//                 .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
//                 .map(function(aid) {
//                   return (
//                     this.renderArtifactInput(aid)
//                   );
//                 }.bind(this));
//   }



// const Link = ({ active, children, onClick }) => {
//   if (active) {
//     return <span>{children}</span>
//   }

//   return (
//     <a href="#"
//        onClick={e => {
//          e.preventDefault()
//          onClick()
//        }}
//     >
//       {children}
//     </a>
//   )
// }

// Link.propTypes = {
//   active: PropTypes.bool.isRequired,
//   children: PropTypes.node.isRequired,
//   onClick: PropTypes.func.isRequired
// }

// export default Link



// import React, { PropTypes } from 'react'
// import ArtifactInput from './ArtifactInput';

// const ArtifactList = ({ artifacts }) => (

// )


// const TodoList = ({ todos, onTodoClick }) => (
//   <ul>
//     {todos.map(todo =>
//       <Todo
//         key={todo.id}
//         {...todo}
//         onClick={() => onTodoClick(todo.id)}
//       />
//     )}
//   </ul>
// )

// TodoList.propTypes = {
//   todos: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     completed: PropTypes.bool.isRequired,
//     text: PropTypes.string.isRequired
//   }).isRequired).isRequired,
//   onTodoClick: PropTypes.func.isRequired
// }

// export default TodoList





// // const mapStateToProps = (state) => {
// //   return {
// //     artifactsLoaded: state.getIn(['infoDocs', 'ArtifactInfo'])
// //   }
// // }

// // class ArtifactList extends React.Component {
// //   renderArtifactInput(aid) {
// //     return <ArtifactInput key={aid} aid={aid} />;
// //   }
// //   getArtifacts() {
// //     return Object.keys(ArtifactInfo)
// //                 .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
// //                 .map(function(aid) {
// //                   return (
// //                     this.renderArtifactInput(aid)
// //                   );
// //                 }.bind(this));
// //   }
// //   render() {
// //     const artifacts = this.getArtifacts();
// //     {this.props.artifactsLoaded &&
// //       <div className='artifactList'>
// //         { artifacts }
// //       </div>
// //     }
// //   }
// // }


// class ArtifactList extends React.Component {
//   constructor() {
//     super();
//     this.state = {};
//     // TODO: Figure out how to not be bad at React
//     // setTimeout(function(){
//     //   const b = {};
//     //   for (var artifact in ArtifactInfo) {
//     //     b[ArtifactInfo[artifact].name] = 1;
//     //   }
//     //   this.setState(b);
//     //   this.render();
//     // }.bind(this), 1000);
//   }
//   artifactChanged(aid, event) {
//     this.setState({[aid]: event.target.value});
//   }
//   renderArtifactInput(aid) {
//     return <ArtifactInput key={aid} name={aid} value={this.state[aid]} onChange={event => this.artifactChanged(aid, event)} />;
//   }
//   getArtifacts() {
//     return Object.keys(ArtifactInfo)
//                 .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
//                 .map(function(artifact) {
//                   return (
//                     this.renderArtifactInput(ArtifactInfo[artifact].name)
//                   );
//                 }.bind(this));
//   }
//   render() {
//     const artifacts = this.getArtifacts();
//     return (
//       <div className='artifactList'>
//         { artifacts }
//       </div>
//     );
//   }
// }

// export default ArtifactList;



class ArtifactList extends React.Component {
  renderArtifactInput(aid) {
    return <ArtifactInput key={aid} aid={aid} />;
  }
  getArtifacts() {
    // if (artifactOrder) {
    //   return artifactOrder.map(function(aid) { return this.renderArtifactInput(aid); }.bind(this));
    // }
    return Object.keys(ArtifactInfo)
                .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
                .map(function(aid) {
                  return (
                    this.renderArtifactInput(aid)
                  );
                }.bind(this));
  }
  render() {
    console.log("render ArtifactList");
    // const artifacts = this.getArtifacts(artifactOrder);
    const artifacts = this.getArtifacts();
    console.log(artifacts.length);
    return (
      <div className='artifactList'>
        { artifacts }
      </div>
    );
  }
}

export default ArtifactList;
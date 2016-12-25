import React from 'react';
import { connect } from 'react-redux';

const Test = ({ testValue }) => {
  return (
    <div>
      Test div {testValue}
    </div>
  );
};

//     let input;
 
//     return (
//         <div className="filterable-table">
//             <input
//                 value={filter}
//                 ref={node => {input = node;}}
//                 onChange={() => onFilter(input.value)} />
 
//             <ProductTable filter={filter} />
//         </div>
//     );
// };

const mapStateToProps = (state) => {
  return {
    testValue: state.get('test')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(FilterableTable);

// class Test extends React.Component {
//   render() {
//     return (
//       <div>
//         Test div {this.props.testValue}
//       </div>
//     );
//   }
// }

// export default Test;
import React from 'react';
import { connect } from 'react-redux';
import SkillList from './SkillList';

const OrderedSkillList = ({ allLoaded }) => {
  return (
    <div className="ordered-skill-list ordered-list">
      <div className="list-wrapper">
        { allLoaded &&
          <SkillList />
        }
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  var allLoaded = state.getIn(['infoDocs', 'SkillInfo']) &&
                  state.getIn(['infoDocs', 'LocalizationInfo']);
  return {
    allLoaded
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedSkillList);
import React from 'react';
import { connect } from 'react-redux';
import SkillList from './SkillList';

const OrderedSkillList = ({ skillLoaded, localizationLoaded }) => {
  return (
    <div className="orderedSkillList">
      { skillLoaded && localizationLoaded &&
        <SkillList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    skillLoaded: state.getIn(['infoDocs', 'SkillInfo']),
    localizationLoaded: state.getIn(['infoDocs', 'LocalizationInfo']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedSkillList);
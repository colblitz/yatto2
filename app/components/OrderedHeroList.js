import React from 'react';
import { connect } from 'react-redux';
import HeroList from './HeroList';

const OrderedHeroList = ({ allLoaded }) => {
  return (
    <div className="ordered-hero-list ordered-list">
      { allLoaded &&
        <HeroList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  var allLoaded = state.getIn(['infoDocs', 'HeroInfo']) &&
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
)(OrderedHeroList);
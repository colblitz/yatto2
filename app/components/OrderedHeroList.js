import React from 'react';
import { connect } from 'react-redux';
import HeroList from './HeroList';

const OrderedHeroList = ({ heroLoaded, localizationLoaded }) => {
  return (
    <div className="ordered-hero-list ordered-list">
      { heroLoaded && localizationLoaded &&
        <HeroList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    heroLoaded: state.getIn(['infoDocs', 'HeroInfo']),
    localizationLoaded: state.getIn(['infoDocs', 'LocalizationInfo']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedHeroList);
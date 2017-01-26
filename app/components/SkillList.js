import React from 'react'
import { getSkillName } from '../util/Localization';
import { SkillInfo } from '../util/Skill';
import SkillInput from './SkillInput';

class SkillList extends React.Component {
  renderSkillInput(sid) {
    return <SkillInput key={sid} sid={sid} />;
  }
  getSkills(tree) {
    return Object.keys(SkillInfo)
                .filter(function(sid) {
                  return SkillInfo[sid].type == tree;
                })
                .sort(function(a, b) { return getSkillName(a).localeCompare(getSkillName(b)); })
                .map(function(sid) {
                  return (
                    this.renderSkillInput(sid)
                  );
                }.bind(this));
  }
  render() {
    const skills = this.getSkills();
    return (
      <div className='skill-list'>
        <h4>Yellow</h4>
        <div>
          { this.getSkills(0) }
        </div>
        <h4>Green</h4>
        <div>
          { this.getSkills(1) }
        </div>
        <h4>Blue</h4>
        <div>
          { this.getSkills(2) }
        </div>
      </div>
    );
  }
}

export default SkillList;

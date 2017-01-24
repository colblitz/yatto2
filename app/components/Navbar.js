import React from 'react';
import { Link } from 'react-router';
import LoginBox from './LoginBox';

class Navbar extends React.Component {
  render() {
    return (
      <nav>
        <div className='nav-bar'>
          <div className="nav-links">
            <div className='nav-link'><Link to="/">Main</Link></div>
            <div className='nav-link'><Link to="/faq">FAQ/Thanks</Link></div>
            <div className='nav-link'><Link to="/ref">Reference</Link></div>
            <div className='nav-link'><Link to="/for">Formulas</Link></div>
          </div>
          <LoginBox/>
        </div>
      </nav>
    );
  }
}

export default Navbar;
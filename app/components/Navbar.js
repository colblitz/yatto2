import React from 'react';
import { Link } from 'react-router';
import LoginButton from './LoginButton';

class Navbar extends React.Component {
  render() {
    return (
      <nav>
        <div className='nav-bar'>
          NavBar goes here
          <div className='nav-link'><Link to="/">Main</Link></div>
          <div className='nav-link'><Link to="/faq">FAQ/Thanks</Link></div>
          <div className='nav-link'><Link to="/ref">Reference</Link></div>
          <div className='nav-link'><Link to="/for">Formulas</Link></div>
          <LoginButton/>
        </div>
      </nav>
    );
  }
}

export default Navbar;
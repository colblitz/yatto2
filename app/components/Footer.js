import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className='footer'>
          <div className="footer-contact">
            <b>Updated for:</b> Tap Titans 2 (1.3.2)
          </div>
          <div className="footer-github">
            <a href="https://github.com/colblitz/yatto2"><b>Github</b></a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

class App extends React.Component {
  render() {
    return (
      <div className='entire-page'>
        <Header />
        <Navbar />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default App;
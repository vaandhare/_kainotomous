import React, { Component } from 'react';
import '../../styles/Dashboard.css'

class Navbar extends Component {
  

  render() {
    var statement = "Unknown"
    
    if(this.props.account === '0x47fcb933Bcd2d6471480b04967B1b0024b9cDff0'){
      statement = "Deputy";
    }
    else if (this.props.account === '0xd7B24b894Ea0CA70A604Cbd1981592bb4B0F12B6'){
      statement = "Chief";
    }
    else{
      statement ="Chairman";
    }
    return (
      
<nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
  
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse text-white" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto ">
      <li className="nav-item active ">
        <a className="nav-link " href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Profile</a>
      </li>
      <li className="nav-item ">
        <a className="nav-link" href="#">
          Analytics
        </a>
        </li>
        </ul>
        <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block text-white">
          Welcome {statement}
        
      </li>
    </ul>
  </div>
</nav>
);
          }
        }


export default Navbar;
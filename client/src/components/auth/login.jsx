import React from "react";
import loginImg from "../../login.svg";
import "./style.scss";
import axios from "axios";
// import { useHistory } from "react-router-dom";


export class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      address:'',
      errorMessage:""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cleanInputs = this.cleanInputs.bind(this);
  }

  async handleSubmit(event) {
    // const history = useHistory();
    event.preventDefault();
    const {email,address} = this.state;
    const response = await axios.post("http://localhost:5000/api/Users/login", {
      email:email,
      address:address
    });
    if(response.data.message == 'error'){
      this.setState({errorMessage:"Authentication Failed"})
    }
    else{
      localStorage.setItem('isLogin', true);
      window.location.href = '/dashboard'; 
    }
    
    this.cleanInputs()
  }

  cleanInputs(){
   
    this.setState({email:""})
    this.setState({address:""})
    
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          {/* <div className="image">
            <img src={loginImg} />
          </div> */}
          <div className="form">
            { this.state.errorMessage ? (<h4 className="error">{this.state.errorMessage}</h4>): <div></div>}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" value={this.state.email}
               onChange={(e)=>{this.setState({email:e.target.value})}} placeholder="johndoe@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" name="address" value={this.state.address}
               onChange={(e)=>{this.setState({address:e.target.value})}} placeholder="Blockhain Address" />
            </div>
          </div>
          <button type="button" className="btn" onClick={this.handleSubmit}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
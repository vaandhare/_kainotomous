import React,{ Fragment } from "react";
import loginImg from "../../login.svg";
import "./style.scss";
import axios from "axios";

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname:'',
      email:'',
      address:'',
      role:'',
      department:''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cleanInputs = this.cleanInputs.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {fullname,email,address,role,department} = this.state;
    const response = await axios.post("http://localhost:5000/api/Users/register", {
      fullname: fullname,
      email:email,
      address:address,
      role:role,
      department:department,
    });
    console.log(response.data);
    this.cleanInputs()
  }

  cleanInputs(){
    this.setState({fullname:""})
    this.setState({email:""})
    this.setState({address:""})
    this.setState({role:""})
    this.setState({department:""})
  }

  render() {
    return (
      <Fragment>
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          {/* <div className="image">
            <img src={loginImg} />
          </div> */}
          <div className="form">
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" name="fullname" value={this.state.fullname}
               onChange={(e)=>{this.setState({fullname:e.target.value})}}
               placeholder="e.g John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" value={this.state.email}
               onChange={(e)=>{this.setState({email:e.target.value})}} placeholder="johndoe@gmail.com" />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" name="address" value={this.state.address}
               onChange={(e)=>{this.setState({address:e.target.value})}} placeholder="Blockchain Address" />
            </div>
            <div className="form-group">
              <label htmlFor="address">Roles</label>
              <select value={this.state.role} onChange={(e)=>{this.setState({role:e.target.value})}}>
                <option value="" disabled>Select Role</option>
                <option value="DGCA">DGCA</option>
                <option value="DoAS">Director of Aerodrome Standards</option>
                <option value="AI">Aerodrome Inspector</option>
                <option value="MoCA">Ministry of Civil Aviation</option>
                
              </select>
            </div>
            {/* {
              this.state.role !== "Chairman" ? (
                <div className="form-group">
                <label htmlFor="address">Department</label>
                <select value={this.state.department} onChange={(e)=>{this.setState({department:e.target.value})}}>
                <option value="" disabled>Select Department</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Air Navigational System">Air Navigational System</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>
              ):""
            } */}
            <button type="button" className="btn" onClick={this.handleSubmit}>
            Register
          </button>
          </div>
          
          
        </div>
      </div>
      </Fragment>
    );
  }
}


export default Register;

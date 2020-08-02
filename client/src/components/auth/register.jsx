import axios from "axios";
import React, { Fragment } from "react";
import "./style.scss";

export class Register extends React.Component {
  async componentWillMount() {
    await this.get_Airports();
  }
  constructor(props) {
    super(props);
    this.state = {
      airports:[],
      fullname:'',
      email:'',
      address:'',
      role:'',
      
      airportCode:'',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cleanInputs = this.cleanInputs.bind(this);
    
  }

  buildAirportSelect() {
    var arr = [];
    this.state.airports.map((airport, key) => {
      if(airport.operatorAddr == ""){
        arr.push(
          <option value={airport.airport_code} key={key}>
            
            {airport.airport_name}
          </option>
        );
      }
      
    });
    return arr;

  }

  async get_Airports() {
    const response = await axios.get(`http://localhost:5000/api/airports/`);
    this.setState({ airports: response.data });
    // console.log(this.state.currentUser)
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {fullname,email,address,role,department,airportCode} = this.state;
    const response = await axios.post("http://localhost:5000/api/Users/register", {
      fullname: fullname,
      email:email,
      address:address,
      role:role,
      airportCode:airportCode
    });
    
    const airresponse = await axios.get(`http://localhost:5000/api/airports/${airportCode}`)
    const airport = airresponse.data[0];
    console.log(airport);
    const putres = await axios.put(`http://localhost:5000/api/airports/${airport._id}`, {
      airport_code: airport.airport_code,
      airport_name: airport.airport_name,
      city_name: airport.city_name,
      lat: airport.lat,
      long: airport.long,
      operatorAddr: address,
      status: airport.status,
    });

    // console.log(response.data);
    this.cleanInputs()
  }

  cleanInputs(){
    this.setState({fullname:""})
    this.setState({email:""})
    this.setState({address:""})
    this.setState({role:""})
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
                <option value="DGCA">Director General of Civil Aviation</option>
                <option value="DoAS">Director of Aerodrome Standards</option>
                <option value="AI">Aerodrome Inspector</option>
                <option value="ED">ED (Licensing)</option>
                <option value="AD">Aerodrome Director</option>
                
              </select>
            </div>
            {
              this.state.role == "AD" ? (
                <div className="form-group">
                <label htmlFor="address">Select Aerodrome</label>
                <select
                          value={this.state.airportCode}
                          onChange={(e) => {
                            this.setState({ airportCode: e.target.value });
                            
                          }}
                          className="form-control"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select the Airport
                        </option>
                          {this.buildAirportSelect()}
                        </select>
              </div>
              ):""
            }

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

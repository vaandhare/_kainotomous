import React from "react";
import { Link } from "react-router-dom";
import Image403 from "../../assets/Image_403.png";
import "../../styles/usernotapproved.css";

function Usernotapproved() {
  // const message = 'Hello Function Component!';

  return (
    <div className="errordiv">
      {/* <div className="image">
            
          </div>  */}
      {/* <h1>403</h1>
    <h2>Access forbidden!</h2>
    <h2>Ask Admin, To Approve this Account</h2>
     */}
      <img src={Image403} width="500" height="auto" />
      <Link to="/auth">
        <button>Home</button>
      </Link>
    </div>
  );
}

export default Usernotapproved;

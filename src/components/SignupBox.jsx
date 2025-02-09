import React from "react";
import google from "../assets/google.png";
import facebook from "../assets/facebook.png";


const SignupBox = () => {
  return (
    <div className="signup-box">
      <h3>Sign Up and get up to ₹83 FREE BONUS!</h3>
      <form className="form">
        <input type="email" placeholder="Email" className="input" />
        <button type="submit" className="submit-button">Continue</button>
      </form>
      <div className="social-login">
        <button className="google">
          <img className="social-icon" src={google} alt="Google" /> Google
        </button>
        <button className="facebook">
          <img className="social-icon" src={facebook} alt="Facebook" /> Facebook
        </button>
      </div>
      <p className="reviews">Check out our 16,858 reviews</p>
    </div>
  );
};

export default SignupBox;

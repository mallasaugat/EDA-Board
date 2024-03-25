import React, { useState } from "react";
import SignIn from "./signIn"; 
import { myFirebase } from "../../model/MyFirebase";

import PropTypes from 'prop-types';

function SignUp({ onSignUpSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signedUp, setSignedUp] = useState(false); // State to track sign-up status

  function signUp(e) {
    e.preventDefault();
    try {
      myFirebase.signUp(email, password);
      // Set signedUp to true upon successful sign-up
      onSignUpSuccess();
    } catch (error) {
      console.log(error);
    }
  }

  // Render SignIn component if signedUp is true
  if (signedUp) {
    return <SignIn />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="signIN">
        <form onSubmit={signUp} className="p-4">
          <h1>Sign Up</h1>
          <input type="email" className="form-control mb-3" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="form-control mb-3" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

SignUp.propTypes = {
  onSignUpSuccess: PropTypes.object
}

export default SignUp;

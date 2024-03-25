import React, { useState } from "react";
import { myFirebase } from "../../model/MyFirebase";
import PropTypes from 'prop-types';

function SignIn({ onSignInSuccess, switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [liked, setLiked] = useState(false);

  function signIn(e) {
    e.preventDefault();
    try {
      myFirebase.signIn(email, password);
      onSignInSuccess();
    } catch (error) {
      console.log(error);
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function toggleLike() {
    setLiked(!liked);
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="signIn">
        <form onSubmit={signIn} className="p-4">
          <h1>Log In</h1>
          <input type="email" className="form-control mb-3" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
          <input type="password" className="form-control mb-3" placeholder="Enter your password" value={password} onChange={handlePasswordChange} />
          <button type="submit" className="btn btn-primary">Log In</button>
        </form>
        <button onClick={switchToSignUp} className="btn btn-secondary">Sign Up</button>
        <button onClick={toggleLike} className="btn btn-info mt-3">{liked ? 'Liked' : 'Like'}</button>
      </div>
    </div>
  );
}

SignIn.propTypes = {
  onSignInSuccess: PropTypes.object,
  switchToSignUp: PropTypes.object
}

export default SignIn;

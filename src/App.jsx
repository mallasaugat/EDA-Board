// App.jsx
import React, { useState } from "react";
import ReadCSV from './components/ReadCSV';
import SignUp from './components/auth/signUp';

import './App.css'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
  }
  
  const switchToSignIn = () => {
    setIsSignUpMode(false);
  }

  return (
    <div>
      {isSignedIn ? (
        <ReadCSV />
      ) : (
        <>
          {isSignUpMode ? (
            <p>Not signed In</p>
          ) : (
            <SignUp onSignUpSuccess={handleSignInSuccess} switchToSignIn={switchToSignIn} />

          )}
        </>
      )}
    </div>
  );
}

export default App;

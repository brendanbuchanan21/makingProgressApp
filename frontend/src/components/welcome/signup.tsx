import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from './firebase';
import { Dumbbell, Loader2, ArrowRight } from 'lucide-react';
import './signup.css';
import visibilityOn from '../../images/visibilityOnEye.svg';
import visibilityOff from '../../images/visibilityOffEye.svg';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*?&]{6,}$/;

        if(password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 6 characters long, contain at least one uppercase letter, and have no spaces.");
            return;
        }

        try {
         setIsLoading(true);
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         const user = userCredential.user;

         await sendEmailVerification(user);

         setMessage("A verification email has been sent to your inbox. Once verified, login below.")

        } catch (err: any) {
            setError("User credentials not valid. Please use a valid email address");
            console.error("sign up failed", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }
    const togglePasswordVibility2 = () => {
        setShowPassword2(!showPassword2);
    }

    return (
        <section id='signup-section'>
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <div className="nav-logo">
                <Dumbbell className="nav-logo-icon" />
              </div>
              <span className="nav-title">makingProgress</span>
            </div>
          </div>
        </div>
      </nav>

      <div className='signup-main-container'>
        <div className='signup-main-blur'></div>

        <div className='signup-section-container'>
          <div className='card-container-signup'>
            <div className='signup-title-container'>
              <h1 className='signup-title'>Join <span className='signup-title-span'>makingProgress</span></h1>
              <p className='signup-description'>Create an account and start your fitness journey today</p>
            </div>
            <div className='credential-signup-input-container'>
              <input type="email" placeholder='Email address' className='signup-input-email' onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }} />
              <div className='signup-password-div'>
                <div className='individual-password-div-container'>
                     <input type={showPassword ? "text" : "password"} placeholder='Password' className='signup-password-input' onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                }} />
                 <img src={showPassword ? visibilityOn : visibilityOff} alt="password visibility" className='password-toggle-icon' onClick={togglePasswordVisibility} />
                </div>
                <div className='individual-password-div-container'>
                <input type={showPassword2 ? "text" : "password"} placeholder='Password' className='signup-password-input' onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }} />
                <img src={showPassword2 ? visibilityOn : visibilityOff} alt="password visibility 2" className='password-toggle-icon' onClick={togglePasswordVibility2} />
                </div>
              </div>
              <div className='signup-btn-container' onClick={handleSignUp}>
                {isLoading ? (
                  <Loader2 className='spinner' />
                ) : (
                  <>
                    <p className='signup-text'>Sign Up</p>
                    <ArrowRight />
                  </>
                )}
              </div>
              {error && (
                <div className='error-div'>
                  <p>{error}</p>
                </div>
              )}
              {message && (
                <div className='message-div'>
                    <p>{message}🎉 Make sure to check spam.</p>
                </div>
              )}
              <div className='signup-bottom-text-div'>
                <p>Already have an account? <span className='signup-login-text' onClick={() => navigate('/login')}>Login</span></p>
              </div>
            </div>
          </div>
          <div className='signup-img-container'>
            <img src="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className='img-signup' />
          </div>
        </div>
      </div>
    </section>
  )
    
}

export default SignUp;
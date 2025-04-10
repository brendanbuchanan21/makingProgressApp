import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from './firebase';
import '../../styles/login.css';
import { Link } from 'react-router-dom';

const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


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
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         const user = userCredential.user;

         await sendEmailVerification(user);

         setMessage("A verification email has been sent to your inbox. Once verified, login below.")

        } catch (err: any) {
            setError("User credentials not valid. Please use a valid email address");
            console.error("sign up failed", err.message);
        }
    };

    return (
        <section className='login-section'>
        <div className='login-container' id='sign-up-container'>
            <p className='form-login-text'>Sign Up</p>
            <form onSubmit={handleSignUp}>
                <div className='shaded-login-area'>
                    <div className='input-div'>
                    <input 
                        type="email"
                        className='sign-in-input'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='email address'
                        />
                        </div>
                        <div className='input-div'>
                    <input 
                        type="password"
                        className='sign-in-input'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='password'
                        />
                        </div>
                        <div className='input-div'>
                     <input 
                        type="password"
                        className='sign-in-input'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder='confirm password'
                        />
                        </div>
                        <button type="submit" className='login-btn'>Sign Up</button>
                </div>

            </form>

            {error && <div className='login-error-message'>{error}</div>}
            {message && <div className='sign-up-verification-message'>{message}</div>}
            <p id='sign-up-text'>Already have an account? <Link to="/welcome"><span id='sign-up-login-text'>Login</span></Link></p> 
        </div>
        </section>
    );
}

export default SignUp;
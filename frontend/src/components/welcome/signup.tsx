import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import '../../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import Welcome from './welcome';
import DashBoard from '../dashboard/dashboard';

const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up successfully");
            navigate('/workouts');
        } catch (err: any) {
            setError(err.message);
            console.error("sign up failed", err.message)
        }
    };

    return (
        <section className='sign-up-section'>
        <div className='login-container'>
            <p className='form-login-text'>Sign Up</p>
            <form onSubmit={handleSignUp}>
                <div className='shaded-login-area'>
                    <input 
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='email address'
                        />
                    <input 
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='password'
                        />
                     <input 
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder='confirm password'
                        />
                        <button type="submit" id="login-btn">Sign Up</button>
                </div>

            </form>

            {error && <div className='login-error-message'>{error}</div>}
            <p id='sign-up-text'>Already have an account? <Link to="/welcome"><span id='sign-up-login-text'>Login</span></Link></p> 
        </div>
        </section>
    );
}

export default SignUp;
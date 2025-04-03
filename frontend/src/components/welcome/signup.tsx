import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import '../../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
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
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up successfully");
            navigate('/workouts');
        } catch (err: any) {
            setError("User credentials not valid. Please use a valid email address");
            console.error("sign up failed", err.message);
        }
    };

    return (
        <section className='sign-up-section'>
        <div className='login-container'>
            <p className='form-login-text'>Sign Up</p>
            <form onSubmit={handleSignUp}>
                <div className='shaded-login-area-sign-up'>
                    <input 
                        type="email"
                        className='input-sign-up'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='email address'
                        />
                    <input 
                        type="password"
                        className='input-sign-up'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='password'
                        />
                     <input 
                        type="password"
                        className='input-sign-up'
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
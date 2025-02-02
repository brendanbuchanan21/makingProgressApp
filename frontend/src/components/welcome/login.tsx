import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in succesfully");
            navigate('/dashboard');
            
        } catch (err: any) {
            setError(err.message);
            console.error("Login failed:", err.message);
        }


    };

    return(
        <>
        <section className='login-section'>
        <div className='login-container'>
            <p className='form-login-text'>Login</p>
            <form onSubmit={handleLogin}>
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
                        <button type="submit" id="login-btn">Login</button>
                </div>

            </form>

            {error && <div className='login-error-message'>{error}</div>}
            <p id='sign-up-text'><Link to="/signup"><span id='login-signup-text'>Sign Up</span></Link></p> 
        </div>
        </section>
        </>
    );

}

export default Login;
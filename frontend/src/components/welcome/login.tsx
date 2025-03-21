import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import visibilityOn from '../../images/visibilityOnEye.svg';
import visibilityOff from '../../images/visibilityOffEye.svg'
import '../../styles/login.css';;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const togglePasswordVisbility = () => {
        setShowPassword(!showPassword)
    }


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getAuth();

        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log('hmm what does this look like:', user);
            console.log("User logged in succesfully", user.uid);
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
                    <div className='input-div'>
                    <input 
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='email address'
                        />
                        </div>

                        <div className='input-div'>
                    <input 
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='password'
                        />
                <img src={showPassword ? visibilityOn : visibilityOff}
                    className='password-toggle-icon' onClick={togglePasswordVisbility} />
                        </div>

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
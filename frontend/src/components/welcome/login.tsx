import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import visibilityOn from '../../images/visibilityOnEye.svg';
import visibilityOff from '../../images/visibilityOffEye.svg';
import { Dumbbell, ArrowRight, Loader2 } from 'lucide-react';
import '../../styles/login.css';
import '../welcome/landingPage.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const togglePasswordVisbility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e:any) => {
    e.preventDefault();
    const auth = getAuth();
    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in");
        await signOut(auth);
        return;
      }
      navigate('/workouts');
    } catch (err:any) {
      setError("User credentials are not valid. Please check your information or sign up below");
      console.error("Login failed:", err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <section id='login-section'>
        {/* Navigation */}
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

        {/* main section */}
        <div className='login-main-container'>
            <div className='login-main-blur'></div>

            <div className='login-section-container'>
                <div className='card-container-login'>
                    <div className='login-title-container'>
                        <h1 className='login-title'>Welcome Back to <span className='login-title-span'>makingProgress</span></h1>
                        <p className='login-description'>Log in to continue your fitness journey and track your progress</p>
                    </div>
                    <div className='credential-login-input-container'>
                        <input type="email" placeholder='Email address' className='login-input-email' onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');

                        }}/>
                        <div className='login-password-div'>
                            <input type="password" placeholder='Password' className='login-password-input' onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}/>
                            <img src={showPassword ? visibilityOff : visibilityOff} alt="password visibility" className='password-toggle-icon' onClick={togglePasswordVisbility}/>
                        </div>
                        <div className='login-btn-container' onClick={handleLogin}>
                            {isLoading ? (
                                <Loader2 />
                            ) : (
                                <>
                                <p className='login-text'>Login</p>
                                <ArrowRight/>
                                </>
                            )}
                        </div>
                        {error && (
                            <div className='error-div'>
                                <p>Please try logging in again</p>
                            </div>
                        )}
                        <div className='login-bottom-text-div'>
                            <p>Don't have an account? <span className='login-sign-up-text'>Sign Up</span></p>
                        </div>
                    </div>  
                </div>
                <div className='login-img-container'>
                    <img src="https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className='img-login'/>
                </div>
            </div>
        </div>

    </section>
)
};

export default Login;

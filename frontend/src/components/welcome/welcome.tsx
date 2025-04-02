import '../../styles/login.css';
import Login from './login';

const Welcome = () => {

    return (
        <>
        <section className="welcome-section">
        <div className='welcome-header-div'>
        <h1 className='welcome-text'>Welcome</h1> 
        <h3>let's make Progress!</h3>
        </div>
        </section>
        <Login />
        </>
    );
}

export default Welcome;
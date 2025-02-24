import './dashboard.css'
import settingsIcon2 from '../../images/settingsIcon.svg'
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <>
        <nav id="dashboard-nav-bar">
        <div className="dashboard-navbar-text-div">
        <Link to="/dashboard">
        <p id="dashboard-text-navbar">Dashboard</p>
        </Link>
        </div>

        <div className="dashboard-navbar-directory-div">
            <Link to='/history'>
            <p>History</p>
            </Link>
            <Link to="/workouts">
            <p>Workouts</p>
            </Link>
            <Link to="/biometricsHome">
            <p>BioMetrics</p>
            </Link>
            <Link to="/settingsPg">
            <img src={settingsIcon2} id='db-settings-svg' />
            </Link>
        </div>
        </nav>
        </>
    );
}

export default NavBar;
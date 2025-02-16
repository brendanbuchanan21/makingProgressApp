import './dashboard.css'
import settingsIcon from '../../images/settingsIcon.png'
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
            <p>Logs</p>
            <Link to="/workouts">
            <p>Workouts</p>
            </Link>
            <p>BioMetrics</p>
            <Link to="/settingsPg">
            <img src={settingsIcon} id='db-settings-svg' />
            </Link>
        </div>
        </nav>
        </>
    );
}

export default NavBar;
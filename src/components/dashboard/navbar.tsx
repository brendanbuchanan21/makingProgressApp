import './dashboard.css'
import settingsImg from '../../images/settings_24dp_WHITE_FILL0_wght400_GRAD0_opsz24.svg'
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
            <img src={settingsImg} id='db-settings-svg' />
        </div>
        </nav>
        </>
    );
}

export default NavBar;
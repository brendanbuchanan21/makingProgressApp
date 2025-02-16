import './workouts.css'
import '../../dashboard/dashboard.css'
import NavBar from '../../dashboard/navbar';
import todayImg from '../../../images/todayImg.jpg'
import planningImg from '../../../images/planningImg.jpg'
import currentPlanImg from '../../../images/currentPlanImg.jpeg'
import { Link } from 'react-router-dom';
 

const WorkoutSection = () => {
return (
    <>
    <NavBar />
    <section className='WP-section-1'>
        <div className='WP-header-div'>
        <h1>Workouts</h1>
        </div>

        <div className='WP-cards-container'>
            <div className='WP-card'>
                <p className='WP-card-text'>New Plan</p>
                <img src={planningImg} className='WP-card-img'/>
                <Link to='/newPlanPopup' className='WP-card-btn'>
                <p>let's go</p>
                </Link>
            </div>

            <div className='WP-card'>
                <p className='WP-card-text'>Today's workout</p>
                <img src={todayImg} className='WP-card-img'/>
                <p className='WP-card-btn'>let's go</p>
            </div>

            <div className='WP-card'>
                <p className='WP-card-text'>Current Plan</p>
                <img src={currentPlanImg} className='WP-card-img' />
                <Link to='/currentPlanPage' className='WP-card-btn'>
                <p>let's go</p>
                </Link>
            </div>
        </div>
    </section>
   
    </>
);




}

export default WorkoutSection;
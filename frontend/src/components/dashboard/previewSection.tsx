import './dashboard.css'
import graphPreview from '../../images/graphPreview.jpeg';
import workoutimg from '../../images/workoutimg.png';
import dumbbell from '../../images/dumbbell-svgrepo-com.svg'
import React from 'react';
import { Link } from 'react-router-dom'


const PreviewSection: React.FC = () => {
    return (

    <section className='dashboard-preview-section'>
            <div className='db-header-text-div'>
                <h1>makingProgress</h1>
                <img src={dumbbell} id='dashboard-dumbbell-svg' />
            </div>
            <div className='preview-cards-container'>
            <div className="preview-card">
                <p className='preview-card-title'>History</p>
                <img src={graphPreview} alt="Graph Preview" className='preview-card-img'/>
                <button className='dashboard-preview-card-btn'>Take me here</button>
            </div>
            <div className="preview-card">
                <p className='preview-card-title'>Workouts</p>
                <img src={workoutimg} alt="workout img" className='preview-card-img' />
                <Link to="/workouts" className="dashboard-preview-card-btn">
        Take me here
    </Link>
            </div>
            <div className="preview-card">
                <p className='preview-card-title'>BioMetrics</p>
                <img src={graphPreview} className='preview-card-img' />
                <Link to="/practice" className='dashboard-preview-card-btn'>Take me here</Link>
            </div>
            </div>
        </section>
    );
}

export default PreviewSection;
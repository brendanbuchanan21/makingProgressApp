import './dashboard.css'
import graphPreview from '../../images/graphPreview.jpeg';
import biometricsImg from '../../images/biometricsImage.jpg'
import dumbbell from '../../images/dumbbell-svgrepo-com.svg'
import dumbbellFull from '../../images/dbpicture.jpg'
import muscleGroupVolume from '../../images/muscle-group-volume.jpeg'
import todaysWorkoutImg from '../../images/todays-workout-img.png'

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
                <p className='preview-card-title'>Workouts</p>
                <img src={todaysWorkoutImg} alt="workout img" className='preview-card-img' />
                <Link to="/workouts" className="dashboard-preview-card-btn">
        Take me here
    </Link>
            </div>
            <div className="preview-card">
                <p className='preview-card-title'>BioMetrics</p>
                <img src={biometricsImg} className='preview-card-img' />
                <Link to="/biometricsHome" className='dashboard-preview-card-btn'>Take me here</Link>
            </div>
            
            <div className="preview-card">
                <p className='preview-card-title'>History</p>
                <img src={muscleGroupVolume} alt="Graph Preview" className='preview-card-img'/>
                <button className='dashboard-preview-card-btn'>Take me here</button>
            </div>
            </div>
        </section>
    );
}

export default PreviewSection;
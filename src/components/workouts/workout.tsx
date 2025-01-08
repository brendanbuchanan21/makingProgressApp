import './workouts.css'
import '../dashboard/dashboard.css';
import NavBar from '../dashboard/navbar';
import calendarImg from '../../images/calendarImg.jpg';
import NewPlanPopup from './newPlanPopup';
import React, { useState } from 'react';
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
                <img src={calendarImg} className='WP-card-img'/>
                <Link to='/newPlanPopup' className='WP-card-btn'>
                <p>let's go</p>
                </Link>
            </div>

            <div className='WP-card'>
                <p className='WP-card-text'>Today's workout</p>
                <img src={calendarImg} className='WP-card-img'/>
                <p className='WP-card-btn'>let's go</p>
            </div>

            <div className='WP-card'>
                <p className='WP-card-text'>Current Plan</p>
                <img src={calendarImg} className='WP-card-img'/>
                <p className='WP-card-btn'>let's go</p>
            </div>
        </div>
    </section>
   
    </>
);




}

export default WorkoutSection;
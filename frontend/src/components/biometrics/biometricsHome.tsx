import './biometricsHome.css'
import NavBar from '../dashboard/navbar';
import { useState } from 'react';
import GettingBioMetricsForm from './gettingTheBiometrics';


const BiometricsHome = () => {

    const [showInputForm, setShowInputForm] = useState(false);

    const handleGetStarted = () => {
        setShowInputForm(true);
    }

    const handleCloseForm = () => {
        setShowInputForm(false);
    }

    return (
        <>
        <div className="biometrics-home-page">
            <NavBar />
        <section className="biometrics-intro">
        <div className="biometrics-intro-container">
            <h1>Track your transformation</h1>
            <p>
            Monitor your body's transformation over time and get personalized insights.
            Enter your basic information to see your progress and receive tailored recommendations.
            </p>
            <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
        </div>
        {showInputForm && <GettingBioMetricsForm />}
        </section>
        </div>
        </>
    )
}

export default BiometricsHome;
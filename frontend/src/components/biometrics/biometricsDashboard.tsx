import './biometricDashboard.css'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import MacroPieChart from './macroPieChart';
import { Root } from 'react-dom/client';
import WeightProgressChart from './weightChangesChart';
import WeightCalendar from './newWeightEntry';
import { useState } from 'react';
import { addBodyWeightEntry } from '../../redux/bodyWeightSlice';

const BiometricDashboard = () => {


    const age = useSelector((state: RootState) => state.biometric.age);
    const initialWeight = useSelector((state: RootState) => state.biometric.initialWeight);
    const recommendedCals = useSelector((state: RootState) => state.biometric.recommendedCalories);
    const bmi = useSelector((state: RootState) => state.biometric.bmi);
    const leanBodyMass = useSelector((state: RootState) => state.biometric.leanBodyMass);
    const bodyFatPercentage = useSelector((state: RootState) => state.biometric.bodyFatPercentage);

    const dispatch = useDispatch();



    // Rounding off the values
    const roundedBmi = Math.round(bmi * 10) / 10;
    const roundedRecommendedCals = Math.round(recommendedCals);
    const roundedLeanBodyMass = Math.round(leanBodyMass * 10) / 10;
    const roundedBodyFatPercentage = Math.round(bodyFatPercentage * 10) / 10;
    
    const weightData = useSelector((state: RootState) => state.bodyWeight.entries);

    const [todaysWeight, setTodaysWeight] = useState("");

    const handleAddWeight = () => {
        if(todaysWeight === "") {
            alert("Please enter a valid number")
            return;
        }
        const weightValue = parseFloat(todaysWeight);

        const newEntry = {
            date: new Date().toISOString().split("T")[0],
            weight: weightValue,
        }

        dispatch(addBodyWeightEntry(newEntry));
        setTodaysWeight(""); 
    }

    return (
        <>
        <section className='biometric-dashboard-section'>
            <div className='biometrics-dashboard-title-div'>
                <h1>Biometrics Dashboard</h1>
            </div>
            <div className='biometric-card-div-big-container'>
                <div className='biometric-card-wrapper'>
                    <h2>Your Trends</h2>
            <div className="biometric-card-div">
            <WeightProgressChart />
            </div>
            </div>
            <div className='biometric-card-wrapper'>
                <h2>Your Metrics</h2>
            <div className="biometric-card-div">
            <p>Age: {age} </p>
            <p>Weight: {initialWeight}</p>
            <p>BMI:{roundedBmi} </p>
            <p>Lean Body Mass:{roundedLeanBodyMass}lbs</p>
            <p>Body Fat Percentage: {roundedBodyFatPercentage}% </p>
            <p>Recommend Calories: {roundedRecommendedCals}</p>
            <MacroPieChart />
            </div>
            </div>

            <div className='biometric-card-wrapper'>
                <h2>New Entry</h2>
            <div className="biometric-card-div">
                <div className='month-div'>
                <h3>February</h3>
                </div>
                <div className='body-weight-card-toggle-div'>
                    
                </div>
                <div className='body-weight-card-today-input-div'>
                    {/* basically when someone changes the value of the input, we need to update state*/}
                    <p>Today's weight:</p>
                    <input type='number' placeholder='input weight' onChange={(e) => setTodaysWeight(e.target.value)}/>
                    <button onClick={handleAddWeight}>Add</button>
                </div>
            <WeightCalendar weightData={weightData} />
            </div>
            </div>
            </div>
        </section>
        </>
    )
}

export default BiometricDashboard;
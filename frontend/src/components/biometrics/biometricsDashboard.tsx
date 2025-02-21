import './biometricDashboard.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import MacroPieChart from './macroPieChart';
import { Root } from 'react-dom/client';
import WeightProgressChart from './weightChangesChart';

const BiometricDashboard = () => {


    const age = useSelector((state: RootState) => state.biometric.age);
    const initialWeight = useSelector((state: RootState) => state.biometric.initialWeight);
    const recommendedCals = useSelector((state: RootState) => state.biometric.recommendedCalories);
    const bmi = useSelector((state: RootState) => state.biometric.bmi);
    const leanBodyMass = useSelector((state: RootState) => state.biometric.leanBodyMass);
    const bodyFatPercentage = useSelector((state: RootState) => state.biometric.bodyFatPercentage);
    const protein = useSelector((state: RootState) => state.biometric.protein);
    const fats = useSelector((state: RootState) => state.biometric.fats);
    const carbs = useSelector((state: RootState) => state.biometric.carbs);


    // Rounding off the values
    const roundedBmi = Math.round(bmi * 10) / 10;
    const roundedRecommendedCals = Math.round(recommendedCals);
    const roundedLeanBodyMass = Math.round(leanBodyMass * 10) / 10;
    const roundedBodyFatPercentage = Math.round(bodyFatPercentage * 10) / 10;

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
            <p>"At vero eos et accusamus et iusto odio dignissimos "At vero eos et accusamus et iusto odio digi quos dolores ete sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
            </p>
            </div>
            </div>
            </div>
        </section>
        </>
    )
}

export default BiometricDashboard;
import { useState, useEffect } from "react";
import { usePostBioMetricsMutation } from "../../redux/biometricApi";
import { setBiometricData } from "../../redux/biometricSlice";
import { useDispatch } from "react-redux";
import BodyFatPopup from "./bodyFatPopup";

interface GettingBioMetricsFormProps {
    onClose: () => void;
  }

const GettingBioMetricsForm: React.FC<GettingBioMetricsFormProps> = ({ onClose }) => {


    const dispatch = useDispatch();

    //setting ranges for different metrics 
    const feetOptions = [4,5,6,7];
    const inchOptions = Array.from({ length: 12 }, (_, i) => i);
    const weightOptions = Array.from({ length: 500 }, (_, i) => i);
    const ageOptions = Array.from({ length: 86 }, (_, i) => i + 15);


    // state holding for the form data 
    const [feet, setFeet] = useState("");
    const [inches, setInches] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [goal, setGoal] = useState("");

    const [showBodyFatPopup, setShowBodyFatPopup] = useState(false);
    const [selectedBodyFat, setSelectedBodyFat] = useState(0);


    //make api call to post data to backend 
    const [postBioMetrics] = usePostBioMetricsMutation();

    // handle submitting the form to the backend 
    const handleFinalSubmit = async () => {

        const bioMetricData = {
            height: `${feet}'${inches}`,
            weight: Number(weight),
            age: Number(age),
            gender, 
            activityLevel,
            goal, 
            bodyFatPercentage: selectedBodyFat
        };

        console.log("Submitting Biometric Data:", bioMetricData); 
        try {
            const response = await postBioMetrics(bioMetricData).unwrap();
            console.log('succesful postage of metrics. here is the return:', response)
            dispatch(setBiometricData({
                ...bioMetricData, 
                bmi: response.bmi,
                recommendedCalories: response.recommendedCalories,
                id: response.id,
                leanBodyMass: response.leanBodyMass
            }))
        } catch (error) {
            console.log('something went wrong:', error)
        }
    }

    useEffect(() => {
        if (selectedBodyFat !== 0) {
          handleFinalSubmit();  // Call handleFinalSubmit when body fat is updated
        }
      }, [selectedBodyFat]);  // Dependency on selectedBodyFat
    


    const handleNextBtn = (e: React.FormEvent) => {
        e.preventDefault();
        if(!feet || !inches || !weight || !age || !gender || !activityLevel || !goal) {
            alert('please fill out all fields');
            return;
        }
        setShowBodyFatPopup(true);
    }


    return (
        <>
        <div className="modal-overlay">
        <div className="modal-content">
            {!showBodyFatPopup ? (
        <form onSubmit={handleNextBtn}>
            <div className="biometric-form-header-div">
            <h2>Tell us about yourself</h2>
            </div>
            <div id="height-inputs" className="biometric-form-divs">
                <label>Height:</label>
                <select value={feet} onChange={(e) => setFeet(e.target.value)} required>
                    <option value="" disabled selected>Feet</option>
                    {feetOptions.map(feet => (
                        <option key={feet} value={feet}>{feet}'</option>
                    ))}
                </select>
                <select value={inches} onChange={(e) => setInches(e.target.value)} required>
                    <option value="" disabled selected>Inches</option>
                    {inchOptions.map(inch => (
                        <option key={inch} value={inch}>{inch}"</option>
                    ))}
                </select>
            </div>
            <div id="weight-inputs" className="biometric-form-divs">
            <label>Weight:</label>
            <select value={weight} onChange={(e) => setWeight(e.target.value)} required>
                <option value="" disabled selected>Weight</option>
                {weightOptions.map(weight => (
                    <option key={weight} value={weight}>{weight}lbs</option>
                ))}
            </select>
            </div>
            <div id="age-options" className="biometric-form-divs">
                <label>Age:</label>
                <select name="age" value={age} onChange={(e) => setAge(e.target.value)} required>
                    <option value="" disabled selected>Age</option>
                    {ageOptions.map(age => (
                        <option value={age} key={age}>{age}</option>
                    ))}
                </select>
            </div>
            <div id="gender-options" className="biometric-form-divs">
                <label>Gender:</label>
                <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="" disabled selected>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                </select>
            </div>
            <div id="activity-input" className="biometric-form-divs">
                <label>Activity Level:</label>
                <select name="activity-level" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} required>
                <option value="" disabled selected>Activity</option>
                <option value="sedentary">
                Sedentary (little to no exercise)
                </option>
                <option value="lightly-active">Lightly Active (exercise 1-3 times a week)</option>
                <option value="moderately-active">Moderately Active (3-5 times a week training)</option>
                <option value="very-active">Very Active (hard exercise 6-7 days a week)</option>
                <option value="super-active">Super Active (trains everyday and physically demanding job)</option>
                </select>
            </div>
           
            <div id="goal-input" className="biometric-form-divs">
                <label>Goal:</label>
                <select name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} required>
                    <option value="" disabled selected>Goal</option>
                    <option value="lose-weight">Lose Weight</option>
                    <option value="maintain-weight">Maintain Weight</option>
                    <option value="gain-weight">Gain Weight</option>
                </select>
            </div>
            <button onClick={onClose} className="first-biometric-pop-up-btn">Go back</button>
            <button className="first-biometric-pop-up-btn" >Next</button>
           
        </form>
            ) : (
               <BodyFatPopup onSubmit={(bodyFat) => {
                setSelectedBodyFat(bodyFat);
              }} onBack={() => setShowBodyFatPopup(false)}/> 
            
                   
                )}
        </div>
        </div>
        </>
    )
}

export default GettingBioMetricsForm;
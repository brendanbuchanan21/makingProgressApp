import biometricModel from "../models/biometricModel.js";


export const submitBiometrics = async (req, res) => {

    try {
        console.log('request body:', req.body);
        const { height, weight, age, gender, activityLevel, goal, bodyFatPercentage } = req.body;
        if(!height || !weight || !age || !gender || !activityLevel || !goal) {
          return res.status(400).json({message: "one of these inputs from the form is empty"});
        }


        //convert height to inches for BMI calculations
        const [feet, inches] = height.split("'");
        const heightInInches = parseInt(feet) * 12 + parseInt(inches);


        //calculate BMI 
        const bmi = (weight / (heightInInches * heightInInches)) * 703;


        // Convert lbs to kg
        const weightInKg = weight / 2.2046;

         // Calculate Basal Metabolic Rate (BMR)
         let bmr = 10 * weightInKg + 6.25 * heightInInches * 2.54 - 5 * age;
         if (gender === "Male") bmr += 5;
         else bmr -= 161;


         const activityMultipliers = {
            "sedentary": 1.2,
            "lightly-active": 1.375,
            "moderately-active": 1.55,
            "very-active": 1.725,
            "super-active": 1.9
         }

         const tdee = bmr * activityMultipliers[activityLevel];

         // Adjust calories based on goal
         let recommendedCalories = tdee;
         if (goal === "lose-weight") recommendedCalories -= 500;
         if (goal === "gain-weight") recommendedCalories += 500;
         

         let leanBodyMass = null;
         if (bodyFatPercentage) {
            leanBodyMass = weight * (1 - bodyFatPercentage / 100);
         }


         const newBioMetric = new biometricModel({
            height, 
            weight,
            age,
            gender,
            activityLevel,
            goal, 
            bmi,
            recommendedCalories,
            bodyFatPercentage,
            leanBodyMass,

         });

         await newBioMetric.save();
         res.status(201).json({ message: "Biometric data saved!", bmi, recommendedCalories, id: newBioMetric._id, leanBodyMass });


    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const deleteBioMetrics = async (req, res) => {

    const { id } = req.params;

    try {
        const bioMetricsData = await biometricModel.findByIdAndDelete(id);
        if(!bioMetricsData) {
            res.status(405).json({message: 'could not find data via id'})
        }
        res.status(200).json({message: 'succesfully find program and deleted'});
    } catch (error) {
        console.error('error retrieving the data id:', error);
    }
}
import biometricModel from "../models/biometricModel";


export const submitBiometrics = async (req, res) => {

    try {
        const { height, weight, age, gender, activityLevel, goal } = req.body;
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
         
         const newBioMetric = new biometricModel({
            height, 
            weight,
            age,
            gender,
            activityLevel,
            goal, 
            bmi,
            recommendedCalories

         });

         await newBioMetric.save();
         res.status(201).json({ message: "Biometric data saved!", bmi, recommendedCalories });


    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
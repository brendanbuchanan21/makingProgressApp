import biometricModel from "../models/biometricModel.js";


export const submitBiometrics = async (req, res) => {

    try {
        console.log('request body:', req.body);
        const { height, initialWeight, age, gender, activityLevel, goal, bodyFatPercentage } = req.body;
        if(!height || !initialWeight || !age || !gender || !activityLevel || !goal) {
          return res.status(400).json({message: "one of these inputs from the form is empty"});
        }


        //convert height to inches for BMI calculations
        const [feet, inches] = height.split("'");
        const heightInInches = parseInt(feet) * 12 + parseInt(inches);


        //calculate BMI 
        const bmi = (initialWeight / (heightInInches * heightInInches)) * 703;


        // Convert lbs to kg
        const weightInKg = initialWeight / 2.2046;

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
         if (goal === "lose-weight") recommendedCalories -= 250;
         if (goal === "gain-weight") recommendedCalories += 250;
         

         let leanBodyMass = null;
         let proteinGrams = null;
         let fatGrams = null;
         let carbGrams = null;


         if (bodyFatPercentage) {
            leanBodyMass = initialWeight * (1 - bodyFatPercentage / 100);
            proteinGrams = leanBodyMass; // 1 gram per pound of LBM

            fatGrams = initialWeight * 0.5; // 0.3 grams per pound of total weight
            const fatCalories = fatGrams * 9;
        
            const remainingCalories = recommendedCalories - (proteinGrams * 4) - fatCalories;
            carbGrams = remainingCalories / 4;
        } else {
            console.log("Body fat percentage not provided. Macronutrients not calculated.");
        }


         const newBioMetric = new biometricModel({
            height, 
            initialWeight,
            age,
            gender,
            activityLevel,
            goal, 
            bmi,
            recommendedCalories,
            bodyFatPercentage,
            leanBodyMass,
            protein: proteinGrams,
            fats: fatGrams,
            carbs: carbGrams

         });

         await newBioMetric.save();
         res.status(201).json({ message: "Biometric data saved!", bmi, recommendedCalories, id: newBioMetric._id, leanBodyMass, protein: proteinGrams,
            fats: fatGrams, carbs: carbGrams
          });


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
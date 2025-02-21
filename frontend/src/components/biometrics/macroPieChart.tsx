import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // This imports and registers all necessary Chart.js components

const MacroPieChart: React.FC = () => {
  // Retrieve macronutrient values from Redux store
  // These values could be in grams or percentages – adjust your labels accordingly.
  const protein = useSelector((state: RootState) => state.biometric.protein) || 0;
  const carbs = useSelector((state: RootState) => state.biometric.carbs) || 0;
  const fats = useSelector((state: RootState) => state.biometric.fats) || 0;

  // Prepare the data for the Pie chart.
  // Here, we assume the values represent percentages.
  const data = {
    labels: [`Protein ${protein}g`, `Carbs ${carbs}`, `Fats ${fats}`],
    datasets: [
      {
        data: [protein, carbs, fats],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div style={{ maxWidth: "200px", margin: "0 auto" }}>
      <Pie data={data} />
    </div>
  );
};

export default MacroPieChart;

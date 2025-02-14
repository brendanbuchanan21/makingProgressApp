
import { useEffect, useState } from "react";
import axios from 'axios'


interface Workout {
    _id: string;
    title: string;
    RIR: number;
}


const PracticePage = () => {

    const [workouts, setWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        const getWorkouts = async () => {
            try {
                const response = await axios.get('/api/workouts')
                console.log("API Response:", response.data); // Debugging log
                setWorkouts(response.data);
            } catch (error) {
                console.error("error fetching data:", error);
            }
         

        }

        getWorkouts();
    }, []);


    return (
        <>
        <h1>Hello World</h1>
        <ul>
            {workouts.map((workout) => (
                <li key={workout._id}>{workout.title} {workout.RIR}</li>
            ))}
        </ul>
        </>
    )
}

export default PracticePage;

import Welcome from './components/welcome/welcome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/welcome/signup'; // Adjust the path as needed
import DashBoard from './components/dashboard/dashboard';
import WorkoutSection from './components/workouts/workout'
import NewPlanPopup from './components/workouts/newPlanPopup';
import AddExercisesPopUp from './components/workouts/addExercisesPopup';



import './App.css'

function App() {



  return (
    <>
    <Router>
      <Routes>
       <Route path='/' element={<Welcome />} />
       <Route path='/welcome' element={<Welcome />}/> 
       <Route path='/signup' element={<SignUp />}/> 
       <Route path='/dashboard' element={<DashBoard />} />
       <Route path='/workouts' element={<WorkoutSection />} />
       <Route path='/newPlanPopup' element={<NewPlanPopup onClose={() => { console.log('Popup closed'); }} />} />
       <Route path='/addExercisesPopup' element={<AddExercisesPopUp />} />
      </Routes>
    </Router>
    </>
  );
}

export default App

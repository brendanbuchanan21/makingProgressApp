
import Welcome from './components/welcome/welcome'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/welcome/signup'; // Adjust the path as needed
import WorkoutSection from './components/workouts/creatingplan/workout'
import NewPlanPopup from './components/workouts/creatingplan/newPlanPopup';
import SubmitWorkoutPg from './components/workouts/creatingplan/submitworkoutpg';
import CurrentPlanPage from './components/workouts/currentPlan/currentPlanPage';
import SettingsPg from './components/dashboard/settingsPg';
import HistoryHome from './components/history/historyHome';
import TodaysWorkoutPage from './components/workouts/currentPlan/todaysWorkoutPage';
import './App.css'
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from './redux/userSlice';
import { useDispatch } from 'react-redux';
import { auth } from './components/welcome/firebase';
import WorkoutTemplate from './components/workouts/noPlanWorkouts/noPlanWorkoutPage';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid));
      } else {
        dispatch(setUser(null))
      }
    })
    return () => unsubscribe();
  }, [dispatch]);
  
  return (
    <>
    <Router>
      <Routes>
       <Route path='/' element={<Welcome />} />
       <Route path='/welcome' element={<Welcome />}/> 
       <Route path='/signup' element={<SignUp />}/> 
       <Route path='/settingsPg' element={<SettingsPg />} />
       <Route path='/workouts' element={<WorkoutSection />} />
       <Route path='/todaysWorkoutPage' element={<TodaysWorkoutPage />} />
       <Route path='/history' element={<HistoryHome />} />
       <Route path='/newPlanPopup' element={<NewPlanPopup onClose={() => { console.log('Popup closed'); }} />} />
       <Route path='/submitworkoutpg' element={<SubmitWorkoutPg />} />
       <Route path='/currentPlanPage' element={<CurrentPlanPage />} />
       <Route path='/quickWorkoutPage' element={<WorkoutTemplate/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App

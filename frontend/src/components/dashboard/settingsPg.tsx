import './settingsPg.css'
import { signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from '../welcome/firebase'
import { useNavigate } from 'react-router-dom'
import NavBar from './navbar'
import { useResetUserDataMutation } from '../../redux/userDataApi'
import { resetWorkoutState } from '../../redux/workoutSlice'
import { useDispatch } from 'react-redux'
import { resetQuickWorkout } from '../../redux/noPlanWorkoutSlice'
import ConfirmModal from './settingsDeletePopUp';
import { useState } from 'react';
import backArrow from '../../images/backArrow.svg'
import SignOutModal from './settingsLogoutPopUp';
import ResetAccountPopUp from './settingsResetAccountPopUp';

const SettingsPg = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetUserData] = useResetUserDataMutation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [logoutPopUp, setLogOutPopUp] = useState(false);
  const [resetPopUp, setResetPopUp] = useState(false);


const logout = async () => {
        
  try {
    await signOut(auth);

  } catch (error) {
    console.error('error signing out:', error);
    return;
  }
  navigate('/login');
}

const resetAccount = async () => {

  try {
    await resetUserData({});
    dispatch(resetWorkoutState());
    dispatch(resetQuickWorkout());
    setResetPopUp(false);
  
  } catch (error) {
    console.error(error);
  }
}


const deleteAccount = async (password: string) => {

  const user = auth.currentUser;

  if(!user) {
    console.error("No user authenticated");
    return;
  }
  try {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
    await resetUserData({});
    dispatch(resetWorkoutState());
    dispatch(resetQuickWorkout());
    await deleteUser(user); // Delete the user from Firebase
    setDeleteModalOpen(false); // Close the modal
    navigate("/signup"); // Redirect to welcome page

  } catch(error) {
    console.error("error deleting account:", error);
    alert("Failed to delete account. Please try again.");
  }
}

const handleBackClick = () => {
  navigate('/workouts');
}

    return (

        <>
        <div className="settings-page">
        <NavBar />

        <div className='settings-main-section-wrapper'>
            <div className='back-click-settings-page-div' onClick={handleBackClick}>
                <div className='back-arrow-smaller-div'>
                <img src={backArrow} alt="back-arrow" className='back-arrow-icon'/>
                </div>
            </div>
         <div className='settings-main-container'>
            <div className="settings-page-header-div">
            <h1>Settings</h1>  
            </div>

            <div className='settings-page-container-body-div'>
            <div className='settings-description-container'>
                <p>Know more</p>
            </div>
            <div className='settings-description-container'>
                <p onClick={() => setResetPopUp(true)}>Reset Account</p>
            </div>
            <div className='settings-description-container'>
                <p onClick={() => setDeleteModalOpen(true)}>Delete Account</p>
            </div>
            </div>
            <div className='sign-out-div'>
            <button onClick={() => setLogOutPopUp(true)}>Sign Out</button>
            </div>
         </div>
         </div>

    

        </div>
        {deleteModalOpen && (
            <ConfirmModal isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={deleteAccount}
            title="Confirm Account Deletion"
            message="Are you sure you want to delete your account? This action cannot be undone. All data related to this account will forever be lost."
            />
        )}
        {logoutPopUp && (
            <SignOutModal isOpen={logoutPopUp} 
            onClose={() => setLogOutPopUp(false)}
            onConfirm={logout}
            title="Sign Out"
            message="Are you sure you want to sign out?"
            />
        )}
        {resetPopUp && (
            <ResetAccountPopUp 
            isOpen={resetPopUp}
            onClose={() => setResetPopUp(false)}
            onConfirm={resetAccount}
            title="Reset Account"
            message="Are you sure you want to reset your account? All associated data will be lost and cannot be recovered"

            />
        )}
        
        </>
    )
}

export default SettingsPg;
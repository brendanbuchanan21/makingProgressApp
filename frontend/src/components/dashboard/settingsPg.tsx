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

const SettingsPg = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [resetUserData] = useResetUserDataMutation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)


    const logout = async () => {
        //if someone clicks the button, we want to send an alert
        // are you sure you want to sign out? 
        //if confirmed, through firebase, sign out user
        const confirmSignOut = window.confirm('Are you sure you want to logout?');

        if(!confirmSignOut) {
            return;
        }
    

        try {
            await signOut(auth);
            console.log("successfully signed out");

        } catch (error) {
            console.error('error signing out:', error);
            return;
        }
        navigate('/welcome');
    }

    const resetAccount = async () => {
        if(window.confirm('are you sure you want to reset your account? all workout data will be lost')) {
            // query deletion of all workout collection data 
            // no plan quick workout documents
        


            try {
                await resetUserData({});
                dispatch(resetWorkoutState());
                dispatch(resetQuickWorkout());


            } catch (error) {
                console.error(error);
            }
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
            navigate("/welcome"); // Redirect to welcome page

            

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
                <p><img src={backArrow} alt="back-arrow" className='back-arrow-icon'/>Go back</p>
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
                <p onClick={resetAccount}>Reset Account</p>
            </div>
            <div className='settings-description-container'>
                <p onClick={() => setDeleteModalOpen(true)}>Delete Account</p>
            </div>
            </div>
            <div className='sign-out-div'>
            <button onClick={logout}>Sign Out</button>
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
        
        </>
    )
}

export default SettingsPg;
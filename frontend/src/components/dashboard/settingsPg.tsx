import './settingsPg.css'
import { signOut } from 'firebase/auth'
import { auth } from '../welcome/firebase'
import { useNavigate } from 'react-router-dom'
import NavBar from './navbar'

const SettingsPg = () => {

    const navigate = useNavigate();



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


    return (

        <>
        <div className="settings-page">
        <NavBar />

        <div className='settings-main-section-wrapper'>
         <div className='settings-main-container'>
            <div className="settings-page-header-div">
            <h1>Settings</h1>  
            </div>

            <div className='settings-page-container-body-div'>
            <div className='settings-description-container'>
                <p>Know more</p>
            </div>
            <div className='settings-description-container'>
                <p>LBs/KG</p>
            </div>
            <div className='settings-description-container'>
                <p>Reset Account</p>
            </div>
            <div className='settings-description-container'>
                <p>News letter</p>
            </div>
            </div>
            <div className='sign-out-div'>
            <button onClick={logout}>Sign Out</button>
         </div>
         </div>
         </div>

        




        </div>
        </>
    )
}

export default SettingsPg;
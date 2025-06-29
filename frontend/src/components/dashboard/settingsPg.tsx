"use client"

import "./settingsPg.css"
import { signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { auth } from "../welcome/firebase"
import { useNavigate } from "react-router-dom"
import NavBar from "./navbar"
import { useResetUserDataMutation } from "../../redux/userDataApi"
import { resetWorkoutState } from "../../redux/workoutSlice"
import { useDispatch } from "react-redux"
import { resetQuickWorkout } from "../../redux/noPlanWorkoutSlice"
import ConfirmModal from "./settingsDeletePopUp"
import { useState } from "react"
import SignOutModal from "./settingsLogoutPopUp"
import ResetAccountPopUp from "./settingsResetAccountPopUp"

const SettingsPg = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [resetUserData] = useResetUserDataMutation()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [logoutPopUp, setLogOutPopUp] = useState(false)
  const [resetPopUp, setResetPopUp] = useState(false)

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("error signing out:", error)
      return
    }
    navigate("/login")
  }

  const resetAccount = async () => {
    try {
      await resetUserData({})
      dispatch(resetWorkoutState())
      dispatch(resetQuickWorkout())
      setResetPopUp(false)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteAccount = async (password: string) => {
    const user = auth.currentUser

    if (!user) {
      console.error("No user authenticated")
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email!, password)
      await reauthenticateWithCredential(user, credential)
      await resetUserData({})
      dispatch(resetWorkoutState())
      dispatch(resetQuickWorkout())
      await deleteUser(user)
      setDeleteModalOpen(false)
      navigate("/signup")
    } catch (error) {
      console.error("error deleting account:", error)
      alert("Failed to delete account. Please try again.")
    }
  }

  const handleBackClick = () => {
    navigate("/workouts")
  }

  return (
    <>
      <NavBar />
      <section className="SP-section">
        {/* Hero Section */}
        <div className="SP-hero-section">
          <div className="SP-header-content">
            <button className="SP-back-btn" onClick={handleBackClick}>
              <svg className="SP-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="SP-header-text">
              <h1 className="SP-main-title">Settings</h1>
              <p className="SP-subtitle">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="SP-container">
          <div className="SP-settings-grid">
            {/* Account Section */}
            <div className="SP-settings-card">
              <div className="SP-card-header">
                <div className="SP-card-icon SP-card-icon-account">👤</div>
                <h3 className="SP-card-title">Account</h3>
              </div>
              <div className="SP-card-content">
                <div className="SP-settings-list">
                  <button className="SP-setting-item" onClick={() => alert("Feature coming soon!")}>
                    <div className="SP-setting-info">
                      <div className="SP-setting-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="SP-setting-text">
                        <span className="SP-setting-name">About</span>
                        <span className="SP-setting-description">Learn more about the app</span>
                      </div>
                    </div>
                    <svg className="SP-setting-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="SP-setting-item" onClick={() => alert("Feature coming soon!")}>
                    <div className="SP-setting-info">
                      <div className="SP-setting-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="SP-setting-text">
                        <span className="SP-setting-name">Profile</span>
                        <span className="SP-setting-description">Update your personal information</span>
                      </div>
                    </div>
                    <svg className="SP-setting-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="SP-setting-item" onClick={() => alert("Feature coming soon!")}>
                    <div className="SP-setting-info">
                      <div className="SP-setting-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2zM4 7h12V5H4v2z"
                          />
                        </svg>
                      </div>
                      <div className="SP-setting-text">
                        <span className="SP-setting-name">Preferences</span>
                        <span className="SP-setting-description">Customize your app experience</span>
                      </div>
                    </div>
                    <svg className="SP-setting-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="SP-settings-card">
              <div className="SP-card-header">
                <div className="SP-card-icon SP-card-icon-data">🗂️</div>
                <h3 className="SP-card-title">Data Management</h3>
              </div>
              <div className="SP-card-content">
                <div className="SP-settings-list">
                  <button className="SP-setting-item SP-setting-item-warning" onClick={() => setResetPopUp(true)}>
                    <div className="SP-setting-info">
                      <div className="SP-setting-icon SP-setting-icon-warning">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      <div className="SP-setting-text">
                        <span className="SP-setting-name">Reset Account</span>
                        <span className="SP-setting-description">Clear all workout data and start fresh</span>
                      </div>
                    </div>
                    <svg className="SP-setting-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="SP-setting-item SP-setting-item-danger" onClick={() => setDeleteModalOpen(true)}>
                    <div className="SP-setting-info">
                      <div className="SP-setting-icon SP-setting-icon-danger">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                      <div className="SP-setting-text">
                        <span className="SP-setting-name">Delete Account</span>
                        <span className="SP-setting-description">Permanently delete your account and all data</span>
                      </div>
                    </div>
                    <svg className="SP-setting-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="SP-signout-section">
            <button className="SP-signout-btn" onClick={() => setLogOutPopUp(true)}>
              <svg className="SP-signout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        {deleteModalOpen && (
          <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={deleteAccount}
            title="Confirm Account Deletion"
            message="Are you sure you want to delete your account? This action cannot be undone. All data related to this account will forever be lost."
          />
        )}

        {logoutPopUp && (
          <SignOutModal
            isOpen={logoutPopUp}
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
      </section>
    </>
  )
}

export default SettingsPg

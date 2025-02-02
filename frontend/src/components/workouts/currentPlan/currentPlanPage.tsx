import { useSelector, UseSelector } from "react-redux"
import { RootState } from "../../../redux/store";
import './currentPlanPage.css'
import WeekCard from "./weekCard";
import NavBar from "../../dashboard/navbar";
import { Link } from "react-router-dom";

const CurrentPlanPage = () => {

    




    return (
        <>
        <section className="currentPlanPage">
            <NavBar />
            <div className="currentPlanPage-header-div">
                <h1>Your Plan</h1>
            </div>
            <div className="currentPlanPage-edit-plan-btn-div">
            <Link to="/workouts" className="currentPlanPage-back-btn">
            Back
            </Link>
                <button className="currentPlanPage-edit-btn">Edit Plan</button>
            </div>
            <div className="grid-container">
                {/*we have to map over each week thats in the program for each card*/}
                <WeekCard />
            </div>
        </section>
        </>
    )



}
export default CurrentPlanPage;

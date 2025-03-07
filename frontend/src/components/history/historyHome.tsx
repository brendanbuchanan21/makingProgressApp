import NavBar from "../dashboard/navbar"
import './historyHome.css'
import TotalVolumeMuscleGroup from "./totalVolumeMuscleGroup";

const HistoryHome = () => {
    return (
        <>
        <NavBar />
        <section className="history-main-section">
        <div className="history-main-title-div">
        <h1>Total Volume Comparison of muscle groups</h1>
        </div>
        <div>
        <TotalVolumeMuscleGroup />
        </div>
        </section>
        
        </>
    )
}

export default HistoryHome;
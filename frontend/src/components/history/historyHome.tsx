import NavBar from "../dashboard/navbar"
import './historyHome.css'
import TotalVolumeMuscleGroup from "./totalVolumeMuscleGroup";
import TotalVolumeChart from "./totalVolumeChart";


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
        <div className="total-volume-chart-div">
            <TotalVolumeChart />
        </div>
        </section>
        
        </>
    )
}

export default HistoryHome;
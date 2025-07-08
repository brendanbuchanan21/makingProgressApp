import React from 'react';
import dumbbellImg from "../../../images/dumbbell-svgrepo-com.svg"

interface PreviousPlansCardProps {
    plans: any[];
}


const PreviousPlansCard: React.FC<PreviousPlansCardProps> = ({plans}) => {
    return (
        <>
            {plans.map((program: any) => (
                  <div className="CPP-history-card CPP-plan-card" key={program._id}>
                    <div className="CPP-card-header">
                      <div className="CPP-card-icon">🏆</div>
                      <h3 className="CPP-card-title">{program.name}</h3>
                    </div>
                    <div className="CPP-card-content">
                      <div className="CPP-card-detail">
                        <span className="CPP-detail-label">Duration</span>
                        <span className="CPP-detail-value">
                          {program.startDate} - {program.endDate}
                        </span>
                      </div>
                      <div className="CPP-card-detail">
                        <span className="CPP-detail-label">Lasted</span>
                        <span className="CPP-detail-value">{program.duration}</span>
                      </div>
                      <div className="CPP-card-detail">
                        <span className="CPP-detail-label">Total Volume</span>
                        <span className="CPP-detail-value">
                          {program.totalVolume} lbs
                          <img src={dumbbellImg || "/placeholder.svg"} alt="" className="CPP-dumbbell-icon" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
        </>
    )

}
export default PreviousPlansCard;
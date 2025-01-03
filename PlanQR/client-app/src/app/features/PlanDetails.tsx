import { useParams } from "react-router-dom"
import NavBar from "../layout/NavBar";
import './PlanDetails.css';
import MyCalendar from "../layout/MyCalendar";

export default function PlanDetails() 
{
    const { room } = useParams();
    return(
        <>
           <NavBar />
           <main className="plan-details-main">
                <p><strong>{room}</strong></p>
           </main>
           <MyCalendar />
        </>
    )
}
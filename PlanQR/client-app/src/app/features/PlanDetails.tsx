import { useParams } from "react-router-dom"
import NavBar from "../layout/NavBar";
import './PlanDetails.css';
import MyCalendar from "../layout/MyCalendar";

export default function PlanDetails() 
{
    const { department , room } = useParams();
    return(
        <>
           <NavBar />
           <main className="plan-details-main">
                <p><strong>{department} {room}</strong></p>
           </main>
           <MyCalendar />
        </>
    )
}
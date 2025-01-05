import NavBar from "../layout/NavBar";
import './PlanDetails.css';
import MyCalendar from "../layout/MyCalendar";

export default function PlanDetails() 
{
    return(
        <>
           <NavBar />
           {/* <main className="plan-details-main">
           </main> */}
           <MyCalendar />
        </>
    )
}
import Landing from "../../nondashboard/Landing/page";


export default function FarmerDashboard() {
  const user = JSON.parse(localStorage.getItem("agri-user")) || {
    name: "Farmer"
  };

  return <Landing isFarmer={true} user={user} />;
}
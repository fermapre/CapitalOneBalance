import { useNavigate } from "react-router-dom";
import "./../styles.css";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Main</h2>
      <button onClick={() => navigate("/balance")}>Ir a Balance</button>
    </div>
  );
}

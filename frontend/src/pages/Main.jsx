import { useNavigate } from "react-router-dom";
import "./../styles.css";
import Landing from "../components/Landing";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div>
      <Landing />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
        <button onClick={() => navigate('/balance')}>Ir a Balance</button>
      </div>
    </div>
  );
}

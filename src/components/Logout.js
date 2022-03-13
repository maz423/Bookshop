import "./Logout.css"
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'

function Logout(){

    const navigate = useNavigate();

    const handleLogout = () => {
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
          };
          const URL = 'http://localhost:8000/logout';

          fetch(URL, requestOptions)
          .then((response) => {
              if (!response.ok){
                  alert("Error logging out")
              } else {
                  //TODO Clear logged in property here
                  navigate('/');
              }
          })
          .catch((error) => {
              alert(error);
          })
    }

    return (
        <div>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default Logout;
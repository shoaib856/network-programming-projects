import bgPentagon from "../assets/images/bg-pentagon.svg";
import PropTypes from "prop-types";
import { iconBag } from "./App";
const GetStarted = ({ setUserChoice }) => {
  return (
    <div className="getStarted-container">
      <div className="relative w-4/6 mx-auto">
        <img src={bgPentagon} alt="bg-triangle" className="w-full" />
        <div
          onClick={() =>
            setUserChoice({ choice: "spock", icon: iconBag.spock })
          }
          className="icon-bg icon-bg-spock spock-place "
        >
          <div className="icon">
            <img src={iconBag.spock} alt="spock" />
          </div>
        </div>
        <div
          onClick={() =>
            setUserChoice({ choice: "lizard", icon: iconBag.lizard })
          }
          className="icon-bg icon-bg-lizard lizard-place"
        >
          <div className="icon">
            <img src={iconBag.lizard} alt="lizard" />
          </div>
        </div>
        <div
          onClick={() =>
            setUserChoice({ choice: "scissors", icon: iconBag.scissors })
          }
          className="icon-bg icon-bg-scissors scissors-place"
        >
          <div className="icon">
            <img src={iconBag.scissors} alt="scissors" />
          </div>
        </div>
        <div
          onClick={() =>
            setUserChoice({ choice: "paper", icon: iconBag.paper })
          }
          className="icon-bg icon-bg-paper paper-place"
        >
          <div className="icon">
            <img src={iconBag.paper} alt="paper" />
          </div>
        </div>
        <div
          onClick={() => setUserChoice({ choice: "rock", icon: iconBag.rock })}
          className="icon-bg icon-bg-rock rock-place"
        >
          <div className="icon">
            <img src={iconBag.rock} alt="rock" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;

GetStarted.propTypes = {
  setUserChoice: PropTypes.func.isRequired,
};

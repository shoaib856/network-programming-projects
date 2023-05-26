import { useEffect, useState } from "react";
import { iconBag } from "./App";
import PropTypes from "prop-types";

const Game = ({
  userChoice,
  houseChoice,
  count,
  setCount,
  setUserChoice,
  setHouseChoice,
  socket,
  roomName,
}) => {
  const [winner, setWinner] = useState(null);
  const [playAgainRequest, setPlayAgainRequest] = useState(false);
  const [waiting, setWaiting] = useState(false);

  // const randomSelection = () => {
  //   const choice = ["paper", "rock", "scissors"][
  //     crypto.getRandomValues(new Uint32Array(1))[0] % 3
  //   ];
  //   setHouseChoice({ choice, icon: iconBag[choice] });
  // };

  useEffect(() => {
    socket.on("playAgain", (playAgain) => {
      if (playAgain) {
        setWinner(null);
        setUserChoice(null);
        setHouseChoice(null);
      }
    });
  }, []);
  useEffect(() => {
    socket.on("waitingForOpponent", (waiting) => setWaiting(waiting));
  }, []);

  useEffect(() => {
    socket.on("playAgainRequest", (playAgainRequest) =>
      setPlayAgainRequest(playAgainRequest)
    );
  }, []);

  useEffect(() => {
    if (houseChoice) {
      if (userChoice.choice === houseChoice.choice) {
        setWinner("draw");
        setCount(count);
      } else if (
        (userChoice.choice === "rock" && houseChoice.choice === "scissors") ||
        (userChoice.choice === "paper" && houseChoice.choice === "rock") ||
        (userChoice.choice === "scissors" && houseChoice.choice === "paper") ||
        (userChoice.choice === "rock" && houseChoice.choice === "lizard") ||
        (userChoice.choice === "lizard" && houseChoice.choice === "spock") ||
        (userChoice.choice === "spock" && houseChoice.choice === "scissors") ||
        (userChoice.choice === "scissors" && houseChoice.choice === "lizard") ||
        (userChoice.choice === "lizard" && houseChoice.choice === "paper") ||
        (userChoice.choice === "paper" && houseChoice.choice === "spock") ||
        (userChoice.choice === "spock" && houseChoice.choice === "rock")
      ) {
        setWinner(true);
        setCount(count + 1);
      } else {
        setWinner(false);
        setCount(count);
      }
    }
  }, [houseChoice, userChoice]);

  return (
    <>
      {(playAgainRequest || waiting) && (
        <div className="play-again-request">
          <p>
            {waiting
              ? "Waiting for Opponent Response"
              : "Opponent wants to play again"}
          </p>
          <div className="flex gap-3">
            {playAgainRequest && (
              <button
                onClick={() => {
                  socket.emit("playAgain", true);
                  setWinner(null);
                  setUserChoice(null);
                  setHouseChoice(null);
                }}
                className="play-again-btn"
              >
                PLAY AGAIN
              </button>
            )}
            <button
              onClick={() => {
                socket.emit("leaveRoom", roomName);
              }}
              type="button"
              className="leave-btn"
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
      <div className="game-container">
        <div className="choice you">
          <p>YOU PICKED</p>
          <div
            className={`icon-bg icon-bg-${userChoice?.choice} ${
              winner === true && "winner-effect"
            }`}
          >
            <div className="icon">
              <img src={userChoice?.icon} alt="userChoice" />
            </div>
          </div>
        </div>
        {winner !== null && (
          <div className="winner-status">
            <p className="winner-text">
              {winner === "draw" ? "DRAW" : winner ? "YOU WIN" : "YOU LOSE"}
            </p>
            <button
              onClick={() => {
                socket.emit("playAgainRequest", true);
                // setWinner(null);
                // setUserChoice(null);
                // setHouseChoice(null);
              }}
              className="play-again-btn"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
        <div className="choice opponent">
          <p>OPPONENT PICKED</p>
          {houseChoice ? (
            <div
              className={`icon-bg icon-bg-${houseChoice?.choice} ${
                winner === false && "winner-effect"
              }`}
            >
              <div className="icon">
                <img src={houseChoice?.icon} alt="House Picked" />
              </div>
            </div>
          ) : (
            <div className="icon-shadow"></div>
          )}
        </div>
      </div>
    </>
  );
};
export default Game;

Game.propTypes = {
  userChoice: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  setCount: PropTypes.func.isRequired,
  setUserChoice: PropTypes.func.isRequired,
};

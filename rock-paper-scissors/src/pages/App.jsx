import { useEffect, useRef, useState } from "react";

import logo from "../assets/images/logo-bonus.svg";

import rock from "../assets/images/icon-rock.svg";
import paper from "../assets/images/icon-paper.svg";
import scissors from "../assets/images/icon-scissors.svg";
import lizard from "../assets/images/icon-lizard.svg";
import spock from "../assets/images/icon-spock.svg";

import iconClose from "../assets/images/icon-close.svg";
import imageRules from "../assets/images/image-rules-bonus.svg";

import GetStarted from "./GetStarted";
import JoinRoom from "./JoinRoom";
import Game from "./Game";

import { io } from "socket.io-client";

const socket = io("http://localhost:6600");

export const iconBag = {
  rock,
  paper,
  scissors,
  lizard,
  spock,
};

function App() {
  const [count, setCount] = useState(0);
  const [userChoice, setUserChoice] = useState(null);
  const [houseChoice, setHouseChoice] = useState(null);
  const rulesRef = useRef(null);
  const [startGame, setStartGame] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [roomName, setRoomName] = useState(null);

  useEffect(() => {
    socket.on("joinedRoom", (Joined) => setJoinedRoom(Joined));
  }, [joinedRoom]);

  useEffect(() => {
    socket.on("joinedRoom", (leave) => setJoinedRoom(leave));
  }, [joinedRoom]);

  useEffect(() => {
    socket.on("startGame", (startGame) => setStartGame(startGame));
    setUserChoice(null);
    setHouseChoice(null);
    setCount(0);
  }, [startGame]);

  useEffect(() => {
    userChoice && socket.emit("move", userChoice);
  }, [userChoice]);

  useEffect(() => {
    socket.on("move", (houseChoice) => setHouseChoice(houseChoice));
  }, [houseChoice]);

  return startGame ? (
    <>
      <header>
        <div className="logo">
          <img src={logo} alt="Rock-Paper-Scissors" />
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
        <div className="score">
          <p className="score-text">SCORE</p>
          <p className="score-number">{count}</p>
        </div>
      </header>

      {userChoice ? (
        <Game
          userChoice={userChoice}
          houseChoice={houseChoice}
          count={count}
          setCount={setCount}
          setUserChoice={setUserChoice}
          setHouseChoice={setHouseChoice}
          socket={socket}
          roomName={roomName}
        />
      ) : (
        <GetStarted setUserChoice={setUserChoice} />
      )}
      <button
        type="button"
        onClick={() => {
          rulesRef.current.showModal();
        }}
        className="rules-btn"
      >
        RULES
      </button>
      <dialog
        ref={rulesRef}
        className="rounded-lg w-full sm:max-w-md sm:w-full p-8 backdrop:backdrop-blur"
      >
        <div className="flex justify-between items-center mb-10">
          <p className="text-3xl text-[hsl(229,_25%,_31%)]">RULES</p>
          <button
            onClick={() => {
              rulesRef.current.close();
            }}
            className="close-btn"
          >
            <img src={iconClose} alt="close" />
          </button>
        </div>
        <img
          className="w-full"
          src={imageRules}
          alt={`paper => rock, rock => scissors, scissors => paper`}
        />
      </dialog>
    </>
  ) : (
    <JoinRoom
      setJoinedRoom={setJoinedRoom}
      joinedRoom={joinedRoom}
      socket={socket}
      setRoomName={setRoomName}
      roomName={roomName}
    />
  );
}

export default App;

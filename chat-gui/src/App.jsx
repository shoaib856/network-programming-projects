import { useEffect, useRef, useState } from "react";
import usersInGroup from "./assets/team.png";
import { io } from "socket.io-client";

import send from "./assets/icons8-sent-50.png";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const userRef = useRef(null);
  const messageRef = useRef(null);

  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    socket.on("messages", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);
  useEffect(() => {
    window.scrollTo(0, 99999999999999);
  }, [messages]);

  useEffect(() => {
    socket.on("user-connected", (username) => {
      setUsername(username);
    });
  }, [username]);

  useEffect(() => {
    socket.on("users", (users) => {
      setUsers(users);
    });
  }, [users]);


  useEffect(() => {
    userRef.current?.focus();
    messageRef.current?.focus();
  }, [username]);

  return (
    <>
      {!username ? (
        <div className="flex justify-center items-center bg-black/50 w-full h-full absolute top-0 left-0">
          <form className="flex flex-col max-w-xl w-full gap-1 bg-amber-200 rounded p-5">
            <input
              type="text"
              name="user"
              placeholder="Enter Your username"
              ref={userRef}
              required
              className="flex-1 border border-amber-400 focus:outline-amber-700 transition rounded px-3 py-1"
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                socket.emit("user-connected", userRef.current.value);
                userRef.current.value = "";
              }}
              className="bg-amber-500 hover:bg-amber-700 transition hover:text-white py-1 px-3 rounded"
            >
              Connect
            </button>
          </form>
        </div>
      ) : (
        <>
          <nav className="px-24 md:px-44 text-2xl fixed top-0 left-0 bg-amber-200/50 backdrop-blur w-full flex justify-between items-center">
            <h1>
              Chat App
              <span className="text-sm text-gray-500"> (Socket.io)</span>
            </h1>
            <div className="relative">
              <button type="button" onClick={() => setShowUsers(!showUsers)}>
                <img src={usersInGroup} alt="users in group" width={50} />
              </button>
              <div
                className={`${
                  showUsers ? "block" : "hidden"
                } absolute top-16 right-0 w-max rounded-lg bg-white shadow-lg`}
              >
                <h1 className="py-1 pl-3 text-xl backdrop-blur w-full">
                  Users
                </h1>
                <ul className={`flex flex-col gap-2 px-1 py-2 `}>
                  {users.map((user, index) => {
                    return (
                      user.username && (
                        <li
                          key={index}
                          className={`text-lg bg-amber-100 py-1 px-3 rounded ${
                            user.username === username ? "order-1" : "order-2"
                          }`}
                        >
                          {user.username} (ID: {user.userID}){" "}
                          {user.username === username && "- YOU"}
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>
          <ul
            id="messages"
            className=" w-full p-2 mt-16 flex flex-col gap-1 flex-1 bg-amber-50"
          >
            {messages.map((message, index) => (
              <li
                key={index}
                className={`bg-amber-100 py-1 px-3 w-fit rounded-lg text-xl max-w-2xl break-words ${
                  username === message.username && "self-end bg-amber-300"
                }`}
              >
                <span
                  className={`text-sm ${
                    username === message.username
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {username === message.username ? "YOU" : message.username}
                </span>
                <p className="text-lg">{message.msg}</p>
              </li>
            ))}
          </ul>

          <form className=" flex p-2 gap-1 w-full bg-white">
            <input
              type="text"
              name="message"
              placeholder="Enter Your Message"
              value={message}
              ref={messageRef}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="text-lg flex-1 border border-amber-400 focus:outline-amber-700 transition rounded px-3 py-1"
            />
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                message && socket.emit("chat-message", message);
                setMessage("");
              }}
              className="bg-amber-300 hover:bg-amber-400 transition hover:text-white py-1 px-3 rounded"
            >
              <img src={send} alt="Send" width={30} />
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default App;

import React, { useEffect, useRef, useState } from "react";

const JoinRoom = ({
  socket,
  roomName,
  setRoomName,
  setJoinedRoom,
  joinedRoom,
}) => {
  const [rooms, setRooms] = useState([]);
  const [full, setFull] = useState(false);

  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const formRef = useRef(null);
  const roomNameRef = useRef(null);

  useEffect(() => {
    socket.on("joinRoom", (room) => setRoomName(room));
  }, [roomName]);

  useEffect(() => {
    socket.on("rooms", (rooms) => setRooms(rooms));
  }, [rooms]);

  useEffect(() => {
    socket.on("roomFull", (full) => setFull(full));
    setTimeout(() => {
      setFull(false);
    }, 3000);
  }, [full]);

  useEffect(() => {
    socket.on("opponentDisconnected", (disconnected) => {
      setOpponentDisconnected(disconnected);
    });
    setTimeout(() => {
      setOpponentDisconnected(false);
    }, 3000);
  }, [opponentDisconnected]);

  return (
    <div className="flex !justify-center !items-center w-full">
      <div className="p-5 max-w-xl w-full rounded-md  bg-slate-200">
        {!joinedRoom ? (
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              socket.emit("joinRoom", roomNameRef.current.value);
              socket.on("joinedRoom", (Joined) => {
                setJoinedRoom(Joined);
              });
              formRef.current.reset();
            }}
            ref={formRef}
          >
            <p className="text-center">Choose a Room To Start the Game</p>
            <h1 className="text-2xl">Rooms</h1>
            <ul className=" flex flex-col gap-2 ">
              {rooms.length === 0 ? (
                <li className="text-lg py-1 px-3 bg-yellow-300/50 rounded text-slate-600">
                  No Rooms Available, Create Your Own Room & Start Playing
                </li>
              ) : (
                rooms.map((room) => (
                  <li
                    key={room}
                    className="text-xl py-2 px-3 bg-slate-500/30 rounded flex justify-between items-center"
                  >
                    <p>{room}</p>
                    <button
                      type="button"
                      onClick={() => {
                        socket.emit("joinRoom", room);
                      }}
                      className="bg-teal-300 hover:bg-teal-400 transition px-3 py-1 rounded-md hover:text-white"
                    >
                      Join
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="flex items-center text-lg gap-2">
              <label htmlFor="room-name">ROOM NAME</label>
              <input
                className="py-1 px-3 rounded-md flex-1 outline-none "
                type="text"
                autoComplete="off"
                name="room-name"
                id="room-name"
                ref={roomNameRef}
                required
              />
              {full && <p className={`text-red-500`}>Room is Full</p>}
            </div>
            <button
              type="submit"
              className="tracking-tighter bg-slate-300 hover:bg-slate-400 transition py-2 text-xl rounded-md hover:text-white"
            >
              Create Custom Room
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="text-3xl">Room Name: ({roomName})</h1>
            {opponentDisconnected && (
              <p className="text-red-500 text-xl">Opponent Disconnected</p>
            )}
            <p className="text-xl">Waiting For Opponent...</p>
            <button
              type="button"
              onClick={() => {
                socket.emit("leaveRoom", roomName);
              }}
              className="leave-btn"
            >
              Leave Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRoom;

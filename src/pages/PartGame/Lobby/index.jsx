import React from "react";

const Lobby = ({ user }) => {
  return (
    <div>
      <h3>Hi: {user.name}</h3>
      <p>等待其他人的加入</p>
    </div>
  );
};

export default Lobby;

import React from "react";
import ChatMessage from "./Message";

export default ({ me, chats }) => (
  <ul className="list-unstyled">
    {chats.map((chat, idx) => <ChatMessage key={idx} chat={chat} me={me} />)}
  </ul>
);

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useGetPrivateChatHistoryQuery } from "../services/backendApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const RealtimeChatModal = ({ isOpen, onClose, astrologer, userId, onInsufficientBalance = null }) => {
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const astrologerId = astrologer?._id;
  const { data: history = [] } = useGetPrivateChatHistoryQuery(
    { userId, astrologerId },
    { skip: !isOpen || !userId || !astrologerId }
  );

  const mergedMessages = useMemo(() => {
    const base = Array.isArray(history) ? history : [];
    if (!liveMessages.length) return base;
    const seen = new Set(base.map((m) => String(m?._id)));
    const extra = liveMessages.filter((m) => !m?._id || !seen.has(String(m._id)));
    return [...base, ...extra];
  }, [history, liveMessages]);

  const orderedMessages = useMemo(
    () => [...mergedMessages].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)),
    [mergedMessages]
  );

  useEffect(() => {
    if (!isOpen || !userId || !astrologerId) return undefined;
    const socket = io(SOCKET_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));

    socket.emit("joinChat", { userId, astrologerId });
    socket.on("receiveMessage", (incoming) => {
      setLiveMessages((prev) => {
        const id = String(incoming?._id || "");
        if (id && prev.some((item) => String(item?._id) === id)) {
          return prev;
        }
        return [...prev, incoming];
      });
    });
    socket.on("chatError", (err) => {
      const msg = err?.message || "Chat send failed";
      if (/insufficient/i.test(String(msg)) && typeof onInsufficientBalance === "function") {
        onInsufficientBalance();
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setLiveMessages([]);
      setIsSocketConnected(false);
    };
  }, [isOpen, userId, astrologerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [orderedMessages]);

  if (!isOpen || !astrologer) return null;

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || !socketRef.current?.connected) return;

    const payload = {
      userId,
      astrologerId,
      senderId: userId,
      senderType: "user",
      message: trimmed,
    };

    socketRef.current.emit("sendMessage", payload);
    setMessage("");
  };

  return (
    <div className="rt-chat-overlay" onClick={onClose}>
      <div className="rt-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rt-chat-header">
          <div>
            <strong>{astrologer.name}</strong>
            <p>Live chat</p>
          </div>
          <button className="rt-chat-close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="rt-chat-messages">
          {orderedMessages.map((m, idx) => (
            <div key={m._id || idx} className={`rt-msg ${String(m.senderId) === String(userId) ? "user" : "astro"}`}>
              {m.message}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="rt-chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message..."
          />
          <button onClick={sendMessage} disabled={!message.trim() || !isSocketConnected}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimeChatModal;

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatSection.module.css";
import { io } from "socket.io-client";
import {
  useGetAstrologerChatThreadsQuery,
  useGetPrivateChatHistoryQuery,
} from "../../services/backendApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const ChatSection = ({ astrologerId }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const socketRef = useRef(null);

  const { data: threads = [], isLoading: isThreadsLoading, refetch: refetchThreads } =
    useGetAstrologerChatThreadsQuery(astrologerId, {
      skip: !astrologerId,
    });

  const selectedThread = useMemo(
    () => threads.find((t) => String(t.userId) === String(selectedUserId)) || threads[0],
    [threads, selectedUserId]
  );

  const { data: history = [], isLoading: isMessagesLoading } =
    useGetPrivateChatHistoryQuery(
      { userId: selectedThread?.userId, astrologerId },
      { skip: !selectedThread?.userId || !astrologerId }
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
    if (!selectedUserId && threads.length > 0) {
      setSelectedUserId(threads[0].userId);
    }
  }, [threads, selectedUserId]);

  useEffect(() => {
    if (!astrologerId) return undefined;
    const socket = io(SOCKET_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => setIsSocketConnected(true));
    socket.on("disconnect", () => setIsSocketConnected(false));

    socket.emit("joinUserRoom", { userId: astrologerId });
    if (selectedThread?.userId) {
      socket.emit("joinChat", { userId: selectedThread.userId, astrologerId });
    }

    socket.on("threadUpdated", () => {
      refetchThreads();
    });

    socket.on("receiveMessage", (incoming) => {
      const senderId = String(incoming?.senderId || "");
      const receiverId = String(incoming?.receiverId || "");
      const activeUserId = String(selectedThread?.userId || "");
      const astroId = String(astrologerId || "");
      const isActiveThread =
        (senderId === activeUserId && receiverId === astroId) ||
        (senderId === astroId && receiverId === activeUserId);

      if (isActiveThread) {
        setLiveMessages((prev) => [...prev, incoming]);
      }
      refetchThreads();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setLiveMessages([]);
      setIsSocketConnected(false);
    };
  }, [astrologerId, refetchThreads, selectedThread?.userId]);

  useEffect(() => {
    setLiveMessages([]);
  }, [selectedThread?.userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread?.userId || !socketRef.current?.connected) return;

    const payload = {
      userId: selectedThread.userId,
      astrologerId,
      senderId: astrologerId,
      senderType: "astrologer",
      message: newMessage.trim(),
    };

    socketRef.current.emit("sendMessage", payload);

    setNewMessage("");
  };

  if (!astrologerId) {
    return <div className={styles.chatContainer}>Please login as astrologer.</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.customerList}>
        <div className={styles.searchBox}>
          <input type="text" value="" readOnly placeholder="User chats" />
        </div>
        {isThreadsLoading ? <p>Loading chats...</p> : null}
        {!isThreadsLoading && threads.length === 0 ? <p>No chats found yet.</p> : null}
        {threads.map((thread) => (
          <div
            key={thread.userId}
            className={`${styles.customerItem} ${selectedThread?.userId === thread.userId ? styles.active : ""}`}
            onClick={() => setSelectedUserId(thread.userId)}
          >
            <div className={styles.customerAvatar}>
              <div className={styles.avatarCircle}>{(thread.userName || "U").charAt(0)}</div>
            </div>
            <div className={styles.customerInfo}>
              <h4>{thread.userName || "User"}</h4>
              <p>{thread.lastMessage || ""}</p>
            </div>
            <div className={styles.customerMeta}>
              <span className={styles.time}>
                {thread.lastMessageAt
                  ? new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <div className={styles.customerDetails}>
            <div className={styles.avatarCircle}>{(selectedThread?.userName || "U").charAt(0)}</div>
            <div>
              <h3>{selectedThread?.userName || "Select a user"}</h3>
              <p>{selectedThread?.userMobile || ""}</p>
            </div>
          </div>
        </div>

        <div className={styles.messagesContainer}>
          {isMessagesLoading ? <p>Loading messages...</p> : null}
          {!isMessagesLoading &&
            orderedMessages.map((chatMessage) => {
              const isAstro = chatMessage.senderType === "astrologer";
              return (
                <div key={chatMessage._id} className={`${styles.message} ${isAstro ? styles.sent : styles.received}`}>
                  <div className={styles.messageContent}>
                    <p>{chatMessage.message}</p>
                    <span className={styles.messageTime}>
                      {new Date(chatMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <form className={styles.messageInput} onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendBtn} disabled={!isSocketConnected}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;

"use client";
import { useEffect, useState } from "react";
import { fetchImportLogs } from "../utils/api";
import ImportLogTable from "./components/ImportLogTable";
import { io } from "socket.io-client";

export default function HomePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    async function loadLogs() {
      try {
        const data = await fetchImportLogs();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();

    // Setup Socket.IO connection
    const socket = io("http://localhost:3005"); // Match your Express server

    socket.on("connect", () => {
      console.log("📡 Connected to Socket.IO server");
    });

    socket.on("newImportLog", (log) => {
      console.log("🔄 New import log received", log);
      setLogs((prevLogs) => [log, ...prevLogs]); // Prepend new log
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
    });

    return () => socket.disconnect(); // Clean up
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Job Import Logs (Real-Time)</h1>
      {loading ? <p>Loading...</p> : <ImportLogTable logs={logs} />}
    </div>
  );
}

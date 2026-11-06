"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function SocketTestPage() {
    const [status, setStatus] = useState("Disconnected");

    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("connect", () => {
            setStatus("Connected");
            console.log("Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
            setStatus("Disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Pulse Socket.IO Test</h1>
            <p>Status: {status}</p>
        </div>
    );
}
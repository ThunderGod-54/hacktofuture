import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  BrainCircuit,
  Square,
  Circle,
  MessageSquare,
  Mic,
  MicOff,
  Share2,
  Crown,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import Notification from "../components/Notification"; // Import the notification component

const Playground = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isHost = location.search.includes("host=true");
  const [activeTool, setActiveTool] = useState("select");
  const [micActive, setMicActive] = useState(true);
  const [notification, setNotification] = useState(null); // State for notification

  const canvasParentRef = useRef(null);
  const voiceContainerRef = useRef(null);

  // Tool button style generator with theme
  const getToolButtonStyle = (toolKey) => ({
    background: activeTool === toolKey ? theme.bgSecondary : "transparent",
    color: activeTool === toolKey ? theme.accent : theme.textSecondary,
    border: `1px solid ${activeTool === toolKey ? theme.accent : theme.border}`,
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  // Updated copy function with custom notification
  const copyInviteLink = async () => {
    const inviteLink = window.location.href;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setNotification({
        type: "success",
        message: `Invite link: ${inviteLink}`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to copy link. Please try again.",
      });
    }
  };

  // Function to close notification
  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    // 1. Initialize Sockets & Konva Stage in canvasParentRef.current
    // 2. Initialize ZegoCloud Voice in voiceContainerRef.current
  }, [roomId]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: theme.bg,
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "280px",
          borderRight: `1px solid ${theme.border}`,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          background: theme.bgSecondary,
          transition: "all 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
              fontWeight: 700,
              color: theme.text,
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard")}
          >
            <BrainCircuit size={20} style={{ color: theme.accent }} />
            Synapse <span style={{ color: theme.textSecondary, fontWeight: 400 }}>Beta</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={toggleTheme}
              style={{
                background: "transparent",
                border: `1px solid ${theme.border}`,
                color: theme.text,
                cursor: "pointer",
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme.isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {isHost && (
              <Crown size={18} style={{ color: "#F59E0B" }} title="Host" />
            )}
          </div>
        </div>

        {/* Tools Section */}
        <section style={{ marginBottom: "40px" }}>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: theme.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
            }}
          >
            Tools
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            {[
              { key: "select", icon: Users, label: "Select" },
              { key: "rect", icon: Square, label: "Rectangle" },
              { key: "circle", icon: Circle, label: "Circle" },
              { key: "comment", icon: MessageSquare, label: "Comment" },
            ].map((tool) => (
              <button
                key={tool.key}
                style={getToolButtonStyle(tool.key)}
                onClick={() => setActiveTool(tool.key)}
                title={tool.label}
              >
                <tool.icon size={22} />
              </button>
            ))}
          </div>
        </section>

        {/* Voice Section */}
        <section style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: theme.textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Voice Sync
            </h3>
            <button
              onClick={() => setMicActive(!micActive)}
              style={{
                background: micActive ? "#15803d" : "#991b1b",
                border: "none",
                color: "white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {micActive ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>

          <div
            ref={voiceContainerRef}
            id="voice-container"
            style={{
              flex: 1,
              background: theme.bg,
              borderRadius: "12px",
              border: `1px solid ${theme.border}`,
              padding: "16px",
              color: theme.textSecondary,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            <span>🎙️ Voice SDK connects here...</span>
          </div>
        </section>

        {/* Share Button */}
        <button
          onClick={copyInviteLink}
          style={{
            marginTop: "20px",
            width: "100%",
            background: theme.accent,
            color: "#ffffff",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Share2 size={18} /> Copy Invite Link
        </button>
      </aside>

      {/* Main Canvas Area */}
      <main
        ref={canvasParentRef}
        style={{
          flex: 1,
          position: "relative",
          background: theme.bg,
          cursor: activeTool === "select" ? "default" : "crosshair",
          transition: "all 0.3s ease",
        }}
      >
        {/* Canvas Placeholder */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.textSecondary,
            fontSize: "14px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <BrainCircuit size={48} style={{ color: theme.accent, marginBottom: "16px", opacity: 0.5 }} />
            <p>Konva Stage will go here</p>
            <p style={{ fontSize: "12px", marginTop: "8px" }}>Room ID: {roomId}</p>
          </div>
        </div>

        {/* Floating Tool Indicator */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: theme.bgSecondary,
            color: theme.textSecondary,
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            border: `1px solid ${theme.border}`,
            pointerEvents: "none",
            backdropFilter: "blur(10px)",
          }}
        >
          🎨 Room: {roomId} | Active Tool: {activeTool.toUpperCase()}
        </div>
      </main>

      {/* Notification Component */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
          theme={theme}
        />
      )}
    </div>
  );
};

export default Playground;
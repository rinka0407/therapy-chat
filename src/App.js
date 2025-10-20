import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const listRef = useRef(null);

  const handleSend = async (newMessages) => {
    setMessages(newMessages);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ エラー: 応答が得られませんでした。" }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ エラー: 通信に失敗しました。" }]);
    }
    setInput("");
  };

  useEffect(() => {
    const initialMessages = [
      {
        role: "system",
        content:
          "あなたは共感的で丁寧な心理カウンセラーです。直近1週間であった嫌なことについて語られるので、相手の語りを引き出す質問をしてください。話しすぎることは避けて、感情の整理を手伝ってください。",
      },
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowDeleteButton(true), 120000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserSend = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userInput }];
    await handleSend(newMessages);
  };

  // ✅ IME（日本語入力）中はEnterで送信しない
  const handleKeyDown = (e) => {
    const isEnter = e.key === "Enter";
    const isComposing = e.isComposing || (e.nativeEvent && e.nativeEvent.isComposing);
    // Android等のIME端末でEnterが229になるケースも考慮
    const isIMEKeyCode = e.keyCode === 229;

    if (isEnter) {
      if (e.shiftKey) return; // Shift+Enter は改行
      if (isComposing || isIMEKeyCode) {
        // 変換中は送信せず通常の確定/改行処理に委ねる
        return;
      }
      e.preventDefault();
      handleUserSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    try { window.close(); } catch {}
  };

  // —— Light Theme ——
  const theme = {
    bg: "#f9fafb",
    panel: "#ffffff",
    border: "#e2e8f0",
    text: "#1e293b",
    sub: "#64748b",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    userBubble: "#e2e8f0",
    asstBubble: "#f1f5f9",
  };

  const styles = {
    app: {
      minHeight: "100svh",
      display: "grid",
      placeItems: "center",
      background: theme.bg,
      color: theme.text,
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Helvetica, Arial",
      padding: "24px",
    },
    card: {
      width: "min(820px, 100%)",
      background: theme.panel,
      border: `1px solid ${theme.border}`,
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,.08)",
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      overflow: "hidden",
    },
    header: {
      padding: "18px 20px",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex",
      gap: "12px",
      alignItems: "center",
      background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))",
    },
    logo: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: `linear-gradient(135deg, ${theme.accent}, #60a5fa)`,
      display: "grid",
      placeItems: "center",
      fontWeight: 700,
      color: "white",
    },
    title: { fontSize: 18, fontWeight: 700 },
    subtitle: { fontSize: 13, color: theme.sub, marginTop: 2 },
    list: {
      height: 460,
      overflowY: "auto",
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    bubbleRow: { display: "flex" },
    bubbleUser: {
      marginLeft: "auto",
      maxWidth: "80%",
      background: theme.userBubble,
      border: `1px solid ${theme.border}`,
      padding: "10px 14px",
      borderRadius: "14px",
      borderTopRightRadius: 4,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    bubbleAsst: {
      marginRight: "auto",
      maxWidth: "80%",
      background: theme.asstBubble,
      border: `1px solid ${theme.border}`,
      padding: "10px 14px",
      borderRadius: "14px",
      borderTopLeftRadius: 4,
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
    footer: {
      borderTop: `1px solid ${theme.border}`,
      padding: 12,
      display: "grid",
      gap: 8,
      background: "rgba(255,255,255,.6)",
    },
    inputRow: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 8,
    },
    input: {
      width: "100%",
      fontSize: 15,
      color: theme.text,
      background: theme.panel,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: "12px 14px",
      outline: "none",
    },
    sendBtn: {
      padding: "0 16px",
      borderRadius: 12,
      border: `1px solid ${theme.accent}`,
      background: theme.accent,
      color: "white",
      fontWeight: 700,
      cursor: "pointer",
      transition: "transform .03s ease, background .2s",
    },
    auxRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    hint: { color: theme.sub, fontSize: 12 },
    deleteBtn: {
      marginLeft: "auto",
      background: "transparent",
      border: `1px solid ${theme.border}`,
      color: theme.sub,
      padding: "6px 10px",
      borderRadius: 10,
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.app}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>💬</div>
          <div>
            <div style={styles.title}>セラピストとの会話</div>
            <div style={styles.subtitle}>「こんにちは」と挨拶を送って入室を知らせてください。</div>
          </div>
        </div>

        <div ref={listRef} style={styles.list}>
          {messages.filter((m) => m.role !== "system").map((m, i) => (
            <div key={i} style={styles.bubbleRow}>
              <div style={m.role === "user" ? styles.bubbleUser : styles.bubbleAsst}>
                <strong style={{ opacity: 0.7, fontSize: 12, display: "block", marginBottom: 4 }}>
                  {m.role === "user" ? "あなた" : "セラピスト"}
                </strong>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div style={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力"
              style={styles.input}
            />
            <button
              onClick={handleUserSend}
              style={{ ...styles.sendBtn, opacity: input.trim() ? 1 : 0.6 }}
              disabled={!input.trim()}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              送信
            </button>
          </div>
          <div style={styles.auxRow}>
            <span style={styles.hint}>Enterで送信 / Shift+Enterで改行 / 2分後にチャット内容削除ボタンが表示されます</span>
            {showDeleteButton && (
              <button onClick={handleClear} style={styles.deleteBtn}>チャット内容を削除する</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
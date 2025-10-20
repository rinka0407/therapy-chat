import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // ← あなたのAPIキーに置き換え

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
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ エラー: 応答が得られませんでした。" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ エラー: 通信に失敗しました。" },
      ]);
    }
    setInput("")
  };

  useEffect(() => {
    // GPTの人格設定
    const initialMessages = [
      {
        role: "system",
        content:
          "あなたは共感的で丁寧な心理カウンセラーです。直近1週間であった嫌なことについて語られるので、相手の語りを引き出す質問をしてください。話しすぎることは避けて、感情の整理を手伝ってください。",
      },
    ];
    setMessages(initialMessages);
  }, []);

  const handleUserSend = async () => {
    if (!input.trim()) return;
    const userInput = input;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userInput }];
    await handleSend(newMessages);
  };

  const handleClear = () => {
    setMessages([]);
    window.close();
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* タイトル部分 */}
      <div style={{ marginBottom: "15px" }}>
        <h2 style={{ marginBottom: "5px" }}>AIセラピストとの会話</h2>
        <p style={{ fontSize: "20px", color: "#000", marginTop: "0" }}>「こんにちは」と挨拶を送って入室を知らせてください。
        </p>
      </div>

      {/* メッセージエリア */}
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages
          .filter((msg) => msg.role !== "system")
          .map((msg, i) => (
            <div key={i}>
              <strong>{msg.role === "user" ? "あなた" : "AIセラピスト"}:</strong> {msg.content}
            </div>
          ))}
      </div>

      {/* 入力エリア */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleUserSend();
            setInput("");
          }
        }}
        placeholder="メッセージを入力"
        style={{ width: "80%", marginRight: "10px" }}
      />
      <button onClick={handleUserSend}>送信</button>
      <br />
      <button onClick={handleClear} style={{ marginTop: "10px" }}>
        チャット内容を削除する
      </button>
    </div>
  );
}

export default App;

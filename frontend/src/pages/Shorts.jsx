import { useState, useRef } from "react";

const shorts = [
  { id: 1, title: "10 CSS tricks you didn't know", channel: "DevByte", views: "2.3M", likes: "142K", duration: "58s", thumb: "https://picsum.photos/seed/s1/400/700", avatar: "D" },
  { id: 2, title: "Morning routine that changed my life", channel: "LifeHacks", views: "5.1M", likes: "380K", duration: "45s", thumb: "https://picsum.photos/seed/s2/400/700", avatar: "L" },
  { id: 3, title: "Cooking pasta in 60 seconds flat", channel: "QuickChef", views: "890K", likes: "67K", duration: "60s", thumb: "https://picsum.photos/seed/s3/400/700", avatar: "Q" },
  { id: 4, title: "How to fold a shirt in 2 seconds", channel: "LifeTips", views: "12M", likes: "920K", duration: "30s", thumb: "https://picsum.photos/seed/s4/400/700", avatar: "L" },
  { id: 5, title: "JavaScript in 60 seconds explained", channel: "CodeSnap", views: "3.4M", likes: "210K", duration: "55s", thumb: "https://picsum.photos/seed/s5/400/700", avatar: "C" },
];

const colors = ["#FF0000", "#0077FF", "#00C853", "#FF6D00", "#AA00FF"];

function ActionBtn({ icon, label }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => icon === "👍" && setLiked(!liked)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 4, color: liked && icon === "👍" ? "#FF0000" : "#fff",
        transition: "transform 0.15s", padding: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}>{icon}</div>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function ShortCard({ short, index, active, onClick }) {
  const avatarColor = colors[index % colors.length];
  return (
    <div
      onClick={onClick}
      style={{
        flex: "0 0 auto",
        width: 200,
        height: 356,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        border: active ? "2.5px solid #FF0000" : "2.5px solid transparent",
        transition: "border 0.2s, transform 0.2s",
        transform: active ? "scale(1.04)" : "scale(1)",
        boxShadow: active ? "0 8px 32px rgba(255,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      <img src={short.thumb} alt={short.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 40%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", top: 10, right: 10,
        background: "rgba(0,0,0,0.6)", color: "#fff",
        fontSize: 11, fontWeight: 700, padding: "2px 8px",
        borderRadius: 6, fontFamily: "monospace",
      }}>{short.duration}</div>
      <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: avatarColor, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff",
            flexShrink: 0,
          }}>{short.avatar}</div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{short.channel}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>{short.title}</p>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 4, display: "block" }}>{short.views} views</span>
      </div>
    </div>
  );
}

export default function ShortsPage() {
  const [active, setActive] = useState(0);
  const current = shorts[active];
  const avatarColor = colors[active % colors.length];

  return (
    <div style={{ minHeight: "100vh", background: "#91c7f3", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: "#FF0000" }}>■</span> Shorts
        </span>
        <span style={{ fontSize: 12, background: "#FF0000", color: "#fff", borderRadius: 6,
          padding: "2px 8px", fontWeight: 700, marginLeft: 4 }}>NEW</span>
      </div>

      {/* Main viewer */}
      <div style={{ display: "flex", gap: 40, padding: "28px 32px", alignItems: "flex-start" }}>
        {/* Short player */}
        <div style={{ flex: "0 0 340px", position: "relative" }}>
          <div style={{
            width: 340, height: 604, borderRadius: 20, overflow: "hidden",
            position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <img src={current.thumb} alt={current.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 35%, transparent 65%)",
            }} />
            {/* Play indicator */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>▶</div>
            {/* Duration badge */}
            <div style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 12,
              fontWeight: 700, padding: "3px 10px", borderRadius: 8, fontFamily: "monospace",
            }}>{current.duration}</div>
            {/* Bottom info */}
            <div style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: avatarColor, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff",
                }}>{current.avatar}</div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{current.channel}</span>
                <button style={{
                  marginLeft: "auto", background: "#fff", color: "#000",
                  border: "none", borderRadius: 20, padding: "4px 14px",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>Follow</button>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{current.title}</p>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, display: "block" }}>
                {current.views} views · {current.likes} likes
              </span>
            </div>
          </div>

          {/* Nav arrows */}
          <button onClick={() => setActive(Math.max(0, active - 1))}
            style={{
              position: "absolute", top: "50%", left: -20, transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
              width: 36, height: 36, color: "#fff", fontSize: 16, cursor: "pointer",
              display: active === 0 ? "none" : "flex", alignItems: "center", justifyContent: "center",
            }}>↑</button>
          <button onClick={() => setActive(Math.min(shorts.length - 1, active + 1))}
            style={{
              position: "absolute", top: "50%", right: -20, transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.12)", border: "none", borderRadius: "50%",
              width: 36, height: 36, color: "#fff", fontSize: 16, cursor: "pointer",
              display: active === shorts.length - 1 ? "none" : "flex", alignItems: "center", justifyContent: "center",
            }}>↓</button>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 200 }}>
          <ActionBtn icon="👍" label={current.likes} />
          <ActionBtn icon="👎" label="Dislike" />
          <ActionBtn icon="💬" label="Comment" />
          <ActionBtn icon="↗" label="Share" />
          <ActionBtn icon="⋯" label="More" />
        </div>

        {/* Up next queue */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, marginTop: 0 }}>Up next</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {shorts.map((s, i) => (
              <ShortCard key={s.id} short={s} index={i} active={i === active} onClick={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
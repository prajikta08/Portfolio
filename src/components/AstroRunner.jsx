import React, { useRef, useEffect, useState, useCallback } from "react";

/**
 * AstroRunner — a Chrome-Dino-style mini game reskinned for a space portfolio.
 * A little astronaut jumps over drifting asteroids across a starfield.
 *
 * Drop this component anywhere below your hero section:
 *   import AstroRunner from "./AstroRunner";
 *   ...
 *   <AstroRunner />
 *
 * No external deps. Pure canvas + React. Colors match the site's
 * navy background (#0a0e27) and warm-star yellow (#f5d76e) accent.
 */

const COLORS = {
  bg: "#0a0e27",
  bgPanel: "#0a0e27",
  border: "#f5d76e33",
  borderStrong: "#f5d76e",
  text: "#e8e8f0",
  textDim: "#8b8fa8",
  accent: "#f5d76e",
  ground: "#f5d76e55",
  obstacle: "#f5d76e",
  obstacleGlow: "#f5d76e88",
  player: "#f2f2f7",
  playerVisor: "#2a2145",
  visorShine: "rgba(255,255,255,0.22)",
  faceMark: "#f2f2f7",
  chestBadge: "#6fc3ff",
  chestBadgeCore: "#eaf6ff",
  tear: "#9fd3ff",
};

const GAME_W = 700;
const GAME_H = 150;
const GROUND_Y = 105;
const GRAVITY = 0.62;
const JUMP_V = -11.5;
const START_SPEED = 5.2;
const PLAYER_SCALE = 0.78; // shrinks the astronaut sprite

export default function AstroRunner() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const initState = useCallback(() => {
    stateRef.current = {
      player: { x: 70, y: GROUND_Y, vy: 0, jumping: false, duckFrame: 0 },
      obstacles: [],
      stars: Array.from({ length: 40 }, () => ({
        x: Math.random() * GAME_W,
        y: Math.random() * (GROUND_Y - 10),
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
      })),
      speed: START_SPEED,
      frame: 0,
      spawnTimer: 0,
      score: 0,
      tears: [],
      splashes: [],
      tearTimer: 0,
    };
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    if (phase === "idle" || phase === "over") {
      startGame();
      return;
    }
    if (!s.player.jumping) {
      s.player.vy = JUMP_V;
      s.player.jumping = true;
    }
  }, [phase]);

  const startGame = useCallback(() => {
    initState();
    setScore(0);
    setPhase("playing");
  }, [initState]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    if (phase !== "playing") {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      const s = stateRef.current;
      s.frame++;
      s.spawnTimer--;

      // difficulty ramp
      s.speed = START_SPEED + Math.min(s.frame / 900, 4.5);

      // spawn obstacles
      if (s.spawnTimer <= 0) {
        const gap = 55 + Math.random() * 55 - Math.min(s.frame / 60, 25);
        s.spawnTimer = Math.max(38, gap);
        const kind = Math.random() < 0.22 ? "double" : "single";
        const size = 16 + Math.random() * 10;
        s.obstacles.push({
          x: GAME_W + 10,
          size,
          kind,
          passed: false,
        });
      }

      // physics
      const p = s.player;
      p.vy += GRAVITY;
      p.y += p.vy;
      if (p.y > GROUND_Y) {
        p.y = GROUND_Y;
        p.vy = 0;
        p.jumping = false;
      }

      // move obstacles
      s.obstacles.forEach((o) => (o.x -= s.speed));
      s.obstacles = s.obstacles.filter((o) => o.x > -40);

      // scoring
      s.obstacles.forEach((o) => {
        if (!o.passed && o.x + o.size < p.x) {
          o.passed = true;
          s.score += 1;
        }
      });
      setScore(s.score);

      // collision (simple circle/box overlap, forgiving hitbox)
      const px = p.x, py = p.y - 12;
      for (const o of s.obstacles) {
        const ox = o.x, oy = GROUND_Y - o.size + 6;
        const dx = Math.abs(px - ox);
        const dy = Math.abs(py - oy);
        if (dx < o.size * 0.55 && dy < o.size * 0.7) {
          setPhase("over");
          setBest((b) => Math.max(b, s.score));
          return;
        }
      }

      draw(ctx, s, p);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // animate the idle "pick me!" pose and the game-over crying pose
  useEffect(() => {
    if (phase === "playing") return;
    if (!stateRef.current) initState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const loop = () => {
      const s = stateRef.current;
      if (phase === "over") updateTears(s);
      draw(ctx, s, s.player);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, initState]);

  function updateTears(s) {
    const p = s.player;
    s.tearTimer--;
    if (s.tearTimer <= 0) {
      s.tearTimer = 16 + Math.random() * 14;
      const eye = Math.random() < 0.5 ? { x: -1, y: -40 } : { x: 5, y: -40 };
      s.tears.push({
        x: p.x + eye.x * PLAYER_SCALE,
        y: p.y + eye.y * PLAYER_SCALE,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.6 + Math.random() * 0.5,
        size: 2 + Math.random() * 1.4,
      });
    }

    s.tears.forEach((t) => {
      t.vy += 0.16;
      t.x += t.vx;
      t.y += t.vy;
      if (t.y >= GROUND_Y + 14 && !t.splashed) {
        t.splashed = true;
        for (let i = 0; i < 6; i++) {
          const ang = Math.PI + Math.random() * Math.PI; // spray upward
          s.splashes.push({
            x: t.x,
            y: GROUND_Y + 14,
            vx: Math.cos(ang) * (1 + Math.random() * 1.4),
            vy: Math.sin(ang) * (1.2 + Math.random() * 1.2),
            life: 16 + Math.random() * 8,
            maxLife: 24,
          });
        }
      }
    });
    s.tears = s.tears.filter((t) => !t.splashed);

    s.splashes.forEach((sp) => {
      sp.vy += 0.14;
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life--;
    });
    s.splashes = s.splashes.filter((sp) => sp.life > 0);
  }

  function draw(ctx, s, p) {
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    // background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // stars
    s.stars.forEach((st) => {
      st.tw += 0.02;
      const alpha = 0.4 + Math.sin(st.tw) * 0.35;
      ctx.fillStyle = `rgba(232,232,240,${Math.max(0.1, alpha)})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
      if (s === stateRef.current && p) st.x -= 0.3; // slow parallax
    });
    s.stars.forEach((st) => {
      if (st.x < 0) st.x = GAME_W;
    });

    // ground line
    ctx.strokeStyle = COLORS.ground;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 14);
    ctx.lineTo(GAME_W, GROUND_Y + 14);
    ctx.stroke();

    // obstacles (asteroids)
    s.obstacles.forEach((o) => {
      const cx = o.x;
      const cy = GROUND_Y - o.size + 20;
      ctx.save();
      ctx.shadowColor = COLORS.obstacleGlow;
      ctx.shadowBlur = 8;
      ctx.fillStyle = COLORS.obstacle;
      drawAsteroid(ctx, cx, cy, o.size * 0.5);
      if (o.kind === "double") {
        drawAsteroid(ctx, cx + o.size * 0.75, cy + 4, o.size * 0.35);
      }
      ctx.restore();
    });

    // player (astronaut)
    const mode =
      phase === "idle" ? "idle" : phase === "over" ? "sad" : "running";
    drawAstronaut(ctx, p.x, p.y, p.jumping, mode);

    // tears + splashes (drawn in world space, on top of the astronaut)
    s.tears.forEach((t) => {
      ctx.fillStyle = COLORS.tear;
      ctx.beginPath();
      ctx.ellipse(t.x, t.y, t.size * 0.6, t.size, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    s.splashes.forEach((sp) => {
      ctx.globalAlpha = Math.max(0, sp.life / sp.maxLife);
      ctx.fillStyle = COLORS.tear;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (phase !== "playing") {
      ctx.fillStyle = "rgba(10,14,39,0.55)";
      ctx.fillRect(0, 0, GAME_W, GAME_H);
    }
  }

  function drawAsteroid(ctx, cx, cy, r) {
    ctx.beginPath();
    const pts = 8;
    for (let i = 0; i < pts; i++) {
      const ang = (i / pts) * Math.PI * 2;
      const rr = r * (0.8 + (i % 3 === 0 ? 0.25 : 0));
      const x = cx + Math.cos(ang) * rr;
      const y = cy + Math.sin(ang) * rr;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawRocket(ctx, t) {
    const flicker = 0.75 + Math.sin(t * 30) * 0.25;

    // flame
    ctx.fillStyle = "#ffe27a";
    ctx.beginPath();
    ctx.ellipse(-24, -6, 6 * flicker, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff9c3d";
    ctx.beginPath();
    ctx.ellipse(-27, -6, 8 * flicker, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ff5a45";
    ctx.beginPath();
    ctx.ellipse(-31, -6, 5.5 * flicker, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // fins
    ctx.fillStyle = "#e0475c";
    ctx.beginPath();
    ctx.moveTo(-21, -12);
    ctx.lineTo(-11, -12);
    ctx.lineTo(-19, -19);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-21, 0);
    ctx.lineTo(-11, 0);
    ctx.lineTo(-19, 7);
    ctx.closePath();
    ctx.fill();

    // body
    ctx.fillStyle = "#e7e9f2";
    roundRect(ctx, -22, -12, 34, 12, 6);
    ctx.fill();

    // nose cone
    ctx.fillStyle = "#e0475c";
    ctx.beginPath();
    ctx.moveTo(12, -12);
    ctx.lineTo(23, -6);
    ctx.lineTo(12, 0);
    ctx.closePath();
    ctx.fill();

    // window
    ctx.fillStyle = "#2ea8e0";
    ctx.beginPath();
    ctx.arc(-1, -6, 4.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c9ccd8";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(-2.3, -7.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawAstronaut(ctx, x, y, jumping, mode) {
    const t = Date.now() / 1000;
    // excited little hop on the idle "pick me!" screen
    const bounce = mode === "idle" ? Math.abs(Math.sin(t * 3)) * 7 : 0;

    ctx.save();
    ctx.translate(x, y - bounce);

    let rotation = 0;
    if (jumping) {
      rotation = -0.06;
    } else if (mode === "running") {
      // lean into the run, toward the incoming asteroids, with a light bounce
      rotation = 0.16 + Math.sin(t * 10) * 0.035;
    }
    if (rotation) ctx.rotate(rotation);

    ctx.scale(PLAYER_SCALE, PLAYER_SCALE);

    const legPhase =
      mode === "idle"
        ? (Math.sin(t * 3) + 1) / 2
        : jumping
        ? 0.5
        : (Math.sin(Date.now() / 80) + 1) / 2;

    const riding = mode === "running";

    if (riding) {
      // --- rocket (astronaut rides it instead of running on foot) ---
      drawRocket(ctx, t);
    } else {
      // --- boots ---
      ctx.fillStyle = COLORS.player;
      roundRect(ctx, -9 - legPhase * 3, -2, 8, 7, 3);
      ctx.fill();
      roundRect(ctx, 1 + (1 - legPhase) * 3, -2, 8, 7, 3);
      ctx.fill();

      // --- legs (shortened) ---
      roundRect(ctx, -7 - legPhase * 2, -11, 6, 9, 3);
      ctx.fill();
      roundRect(ctx, 1 + (1 - legPhase) * 2, -11, 6, 9, 3);
      ctx.fill();
    }

    // --- torso ---
    ctx.fillStyle = COLORS.player;
    roundRect(ctx, -11, -33, 22, 20, 9);
    ctx.fill();

    // --- shoulder pads ---
    roundRect(ctx, -16, -31, 7, 9, 3);
    ctx.fill();
    roundRect(ctx, 9, -31, 7, 9, 3);
    ctx.fill();

    // --- arms + mitten hands ---
    ctx.strokeStyle = COLORS.player;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    let leftHand = { x: -17, y: -19 };
    let rightHand = { x: 17, y: -19 };

    if (riding) {
      // both hands gripping the rocket, kept close to the body
      const grip = Math.sin(t * 10) * 1;
      leftHand = { x: -5, y: -19 + grip };
      rightHand = { x: 6, y: -16 + grip };
    } else if (mode === "idle") {
      // left arm raised in a cheer, right arm waves (short reach)
      leftHand = { x: -17, y: -31 };
      const waveAngle = -0.95 + Math.sin(t * 5.5) * 0.35;
      rightHand = {
        x: 14 + Math.cos(waveAngle) * 9,
        y: -26 + Math.sin(waveAngle) * 9,
      };
    } else if (mode === "sad") {
      // arms droop, close to the body
      leftHand = { x: -14, y: -17 };
      rightHand = { x: 14, y: -17 };
    }

    ctx.beginPath();
    ctx.moveTo(-13, -26);
    ctx.lineTo(leftHand.x, leftHand.y);
    ctx.moveTo(13, -26);
    ctx.lineTo(rightHand.x, rightHand.y);
    ctx.stroke();

    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(leftHand.x, leftHand.y, 3.6, 0, Math.PI * 2);
    ctx.arc(rightHand.x, rightHand.y, 3.6, 0, Math.PI * 2);
    ctx.fill();

    // --- chest badge ---
    ctx.fillStyle = COLORS.chestBadge;
    ctx.beginPath();
    ctx.arc(0, -19, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.chestBadgeCore;
    ctx.beginPath();
    ctx.arc(-0.8, -19.8, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // --- helmet ---
    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(0, -41, 12, 0, Math.PI * 2);
    ctx.fill();

    // visor
    ctx.fillStyle = COLORS.playerVisor;
    ctx.beginPath();
    ctx.arc(0.5, -41, 9.6, 0, Math.PI * 2);
    ctx.fill();

    // glass shine
    ctx.fillStyle = COLORS.visorShine;
    ctx.beginPath();
    ctx.ellipse(-3.2, -45, 4.4, 2.6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3.5, -37, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // face marks (light, drawn on the dark visor)
    ctx.strokeStyle = COLORS.faceMark;
    ctx.fillStyle = COLORS.faceMark;
    ctx.lineWidth = 1.3;
    ctx.lineCap = "round";

    if (mode === "sad") {
      // scrunched, closed crying eyes (^ ^) — tears do the rest
      ctx.beginPath();
      ctx.moveTo(-2.8, -43);
      ctx.quadraticCurveTo(-1.3, -44.6, 0.2, -43);
      ctx.moveTo(3.2, -43);
      ctx.quadraticCurveTo(4.7, -44.6, 6.2, -43);
      ctx.stroke();
    } else if (mode === "idle") {
      // happy round eyes
      ctx.beginPath();
      ctx.arc(-1.5, -43, 1.2, 0, Math.PI * 2);
      ctx.arc(4.5, -43, 1.2, 0, Math.PI * 2);
      ctx.fill();
      // big smile
      ctx.beginPath();
      ctx.moveTo(-2, -36);
      ctx.quadraticCurveTo(1.5, -32, 5, -36);
      ctx.stroke();
    } else if (mode === "running") {
      // angled, determined eyebrows...
      ctx.beginPath();
      ctx.moveTo(-3.6, -45.5);
      ctx.lineTo(0, -44);
      ctx.moveTo(7, -44);
      ctx.lineTo(3.4, -45.5);
      ctx.stroke();
      // ...small focused eyes...
      ctx.beginPath();
      ctx.arc(-1.5, -42.5, 1.1, 0, Math.PI * 2);
      ctx.arc(4.5, -42.5, 1.1, 0, Math.PI * 2);
      ctx.fill();
      // ...but still grinning — game face
      ctx.beginPath();
      ctx.moveTo(-1.5, -36);
      ctx.quadraticCurveTo(1.5, -33, 4.5, -36);
      ctx.stroke();
    }

    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
        margin: "60px 0",
        padding: "0 40px",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            color: COLORS.text,
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Bored? Take a spacewalk.
        </h2>
        <div style={{ color: COLORS.textDim, fontSize: 13 }}>
          space / ↑ to jump
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={GAME_W}
          height={GAME_H}
          onClick={jump}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 8,
            cursor: "pointer",
          }}
        />

        {/* HUD */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            color: COLORS.accent,
            fontVariantNumeric: "tabular-nums",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          {String(score).padStart(5, "0")}
          {best > 0 && (
            <span style={{ color: COLORS.textDim, marginLeft: 10 }}>
              best {String(best).padStart(5, "0")}
            </span>
          )}
        </div>

        {phase !== "playing" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                color: COLORS.text,
                fontSize: 18,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {phase === "idle" ? "Astro Runner" : "You hit an asteroid"}
            </div>
            <div style={{ color: COLORS.textDim, fontSize: 12 }}>
              tap, click, or press space to play
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
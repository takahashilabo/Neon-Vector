# Neon Vector

**A Geometry Wars-like Shooter** — browser-based twin-stick shooter built with vanilla JavaScript, HTML5 Canvas 2D, and WebGL.  
No build step, no dependencies — open a single HTML file and play.

🎮 **Play now:** https://takahashilabo.github.io/Neon-Vector/

---

## Controls

| Input | Action |
|-------|--------|
| `WASD` | Move (ship rotates to face movement direction) |
| Arrow keys | Aim and shoot (independent of movement) |
| Mouse move | Aim |
| Left click / hold | Shoot |
| `M` | Mute / unmute |

> Twin-stick layout: left hand moves, right hand aims — or use mouse for precision aiming.

---

## Features

### Event System
Every 11–22 seconds a named event spawns a themed enemy wave:

| Event | Description |
|-------|-------------|
| **SWARM** | Dense pack of bouncing Geoms floods from one side |
| **BLACK HOLE** | A gravity well that bends your bullets and pulls the grid |
| **SERPENTS** | Multiple snake chains that chase you across the arena |
| **ONSLAUGHT** | All enemy types at once |
| **KAMIKAZE** | High-speed diving enemies (unlocks after 60 s) |

### Enemy Roster
- **Geom** — bounces off walls, fast, easy to kill
- **Seeker** — locks onto you and chases with a turning radius
- **Pinwheel** — orbits at medium range, fires 4-way cross bursts
- **Snake** — head + body chain; body segments die with the head
- **Shooter** — orbits at a preferred distance, fires 3-way spread every 2–3 s
- **Black Hole** — multi-HP gravity well, requires 6 hits; pulls grid lines inward
- **Kamikaze Seeker** — faster and more aggressive version of Seeker

### Score & Multiplier
Kill streak multiplier climbs to ×20 — kill as many enemies as possible without dying to maximize score.

### Audio
- Procedural BGM: 132 BPM electronic beat (kick / snare / hat + sawtooth bass + C-minor arpeggio)
- SFX: shoot, enemy fire, explosions (small / large), player death, event announcement

---

## Technical Notes

### Rendering Architecture
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Background grid | Canvas 2D (batched) | Spring-physics deformation grid |
| Game entities | Canvas 2D | Enemies, bullets, player |
| Particles | **WebGL** (`GL_POINTS`) | Explosion effects (single draw call) |

**WebGL particle renderer** — all particles are rendered in one `gl.drawArrays()` call with a radial glow fragment shader (`pow(1−d, 2)` falloff). Compared to Canvas 2D `arc()` calls this reduces particle rendering cost from ~10–20 ms/frame down to ~0.02 ms/frame.

**No `shadowBlur` in gameplay** — all glow effects on game entities use layered multi-stroke (wide faint → narrow bright) instead of `ctx.shadowBlur`, which is expensive on large canvases.

### World & Camera
- World size: **1936 × 1100 px** (44 × 25 grid cells at 44 px spacing)
- Camera follows the player with gentle motion-direction lead
- Minimap always visible in the top-right corner

---

## License

MIT — feel free to fork, modify, and ship.

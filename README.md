# Geometry Wars — Browser Game

A browser-based **Geometry Wars**-style twin-stick shooter built with vanilla JavaScript, HTML5 Canvas 2D, and WebGL.  
No build step, no dependencies — open a single HTML file and play.

---

## Play

### Option A — Local server (recommended)
```bash
python3 -m http.server 8765
# then open http://localhost:8765/geometry_wars.html
```

### Option B — Direct file
Open `geometry_wars.html` directly in your browser.  
(Some browsers restrict WebGL on `file://` URLs; use a local server if particles don't appear.)

---

## Controls

| Input | Action |
|-------|--------|
| `WASD` | Move (ship rotates to face movement direction) |
| Arrow keys | Aim and shoot (independent of movement) |
| Mouse move | Aim |
| Left click / hold | Shoot |

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

---

## Technical Notes

### Rendering Architecture
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Background grid | Canvas 2D (batched) | Spring-physics deformation grid |
| Game entities | Canvas 2D | Enemies, bullets, player |
| Particles | **WebGL** (`GL_POINTS`) | Explosion effects (single draw call) |

**WebGL particle renderer** — all particles are rendered in one `gl.drawArrays()` call with a radial glow fragment shader (`pow(1−d, 2)` falloff). Compared to Canvas 2D `arc()` calls this reduces particle rendering cost from ~10–20 ms/frame down to ~0.02 ms/frame.

**Grid batching** — the 44×25 spring-physics grid segments are sorted into 8 displacement bins and drawn with one `stroke()` per bin (16 calls total vs 4 000+ previously), eliminating the main fullscreen bottleneck.

**No `shadowBlur` in gameplay** — all glow effects on game entities use layered multi-stroke (wide faint → narrow bright) instead of `ctx.shadowBlur`, which is notoriously expensive on large canvases.

### World & Camera
- World size: **1936 × 1100 px** (44 × 25 grid cells at 44 px spacing)
- Camera follows the player with gentle motion-direction lead
- Minimap always visible in the top-right corner

---

## Screenshot

> Start screen  
> ![menu](https://github.com/user-attachments/assets/placeholder)

---

## License

MIT — feel free to fork, modify, and ship.

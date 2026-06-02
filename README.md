<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/dccf9896-8a18-4ef8-925b-cbee9c358314

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Simulation Details

This project includes a WebGL-based fluid simulation used as a cursor/overlay (`FluidCursor` component). The simulation is powered by `webgl-fluid` and exposes a small set of runtime configuration options so you can tune visuals and performance.

- **Where it lives:** The visual engine is implemented in [src/components/FluidCursor.tsx](src/components/FluidCursor.tsx). The app mounts the simulation via the `FluidCursor` component in [src/App.tsx](src/App.tsx).

- **How it runs:** `FluidCursor` creates a full-screen canvas and initializes `WebGLFluid` with the provided config. Interactions (hover/click) spawn splats that perturb the fluid and emit color/velocity.

- **Main configuration options:** (exposed in the UI and via the component `config` prop)
   - `TRIGGER`: `'hover' | 'click'` — how splats are generated.
   - `IMMEDIATE`: `boolean` — start the engine immediately.
   - `SPLAT_RADIUS`: `number` — radius of splats (typical 0.05–1.0).
   - `SPLAT_FORCE`: `number` — strength of splats (typical 1000–10000).
   - `CURL`: `number` — curl amount for vorticity (affects swirl).
   - `DENSITY_DISSIPATION`, `VELOCITY_DISSIPATION`: `number` — how fast dye/velocity fade (lower = longer lasting).
   - `COLORFUL`: `boolean` — whether the engine cycles colors automatically.
   - `SPLAT_COLOR`: `{r,g,b}` — fixed splat color (disables `COLORFUL` when set).
   - `BLOOM`, `SUNRAYS`: `boolean` — post-processing effects for glow and light rays.

- **Programmatic usage:** Pass a `config` object to `FluidCursor`:

```tsx
<FluidCursor config={{ TRANSPARENT: true, SPLAT_FORCE: 6000, SPLAT_RADIUS: 0.25 }} />
```

- **Performance tips:**
   - Reduce `SPLAT_FORCE`/`SPLAT_COUNT` or lower simulation resolutions for slower devices.
   - Disable heavy post-processing (`BLOOM`, `SUNRAYS`) to improve FPS.
   - Use `TRANSPARENT: true` to keep the canvas lightweight when layering over content.

- **Development notes:**
   - The UI controls in `src/App.tsx` map directly to the configuration object passed to the engine; changing UI values updates the `FluidCursor` instance when you apply settings.
   - If you need type support for external libs, consider adding local `.d.ts` declarations or installing `@types/...` packages for those libraries.

If you'd like, I can add a dedicated `SIMULATION.md` with examples, or add quick presets (Low/Medium/High) to the UI. Which would you prefer?

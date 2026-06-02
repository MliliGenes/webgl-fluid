# Fluid Cursor App

This project is a small React + Vite app built around the `webgl-fluid` engine. It renders a full-screen fluid simulation behind the UI and lets you tune the effect from a control panel or by passing props directly to the `FluidCursor` component.

## What the App Does

The app has three main pieces:

1. A full-screen canvas handled by `FluidCursor`.
2. A sidebar of controls in `src/App.tsx` for adjusting the simulation in real time.
3. An integration modal that shows how to copy the component into another app.

When you press **Apply Settings**, the current draft config is applied to the live simulation and the WebGL engine is remounted with the new values.

## How the Simulation Works

The simulation is powered by `webgl-fluid`, which runs a fluid solver on a canvas using WebGL. Pointer movement or clicks generate splats that inject velocity and color into the fluid field. The result is the smoke-like motion effect you see across the screen.

Internally, the component does this:

- creates a full-screen `<canvas>`
- passes the canvas into `WebGLFluid(...)`
- merges your config with `TRANSPARENT: true`
- lets the engine handle pointer interaction, bloom, sun rays, splats, and decay

## Project Structure

- `src/App.tsx` contains the control panel, color picker, sliders, and the apply button.
- `src/components/FluidCursor.tsx` contains the reusable `FluidCursor` wrapper and its TypeScript prop types.
- `src/index.css` contains the Tailwind setup and custom scrollbar styles.

## `FluidCursor` Props

`FluidCursor` accepts one optional prop:

```ts
config?: FluidCursorConfig
```

The config is passed directly to `webgl-fluid` after the app forces `TRANSPARENT: true`.

### Supported Props

The current `FluidCursorConfig` type includes these options:

- `TRIGGER?: 'hover' | 'click'` - how splats are created.
- `IMMEDIATE?: boolean` - whether the simulation starts immediately.
- `AUTO?: boolean` - auto-trigger behavior.
- `INTERVAL?: number` - auto trigger interval.
- `SIM_RESOLUTION?: number` - simulation resolution.
- `DYE_RESOLUTION?: number` - dye resolution.
- `CAPTURE_RESOLUTION?: number` - capture resolution.
- `DENSITY_DISSIPATION?: number` - how fast color fades.
- `VELOCITY_DISSIPATION?: number` - how fast motion fades.
- `PRESSURE?: number` - pressure strength.
- `PRESSURE_ITERATIONS?: number` - pressure solver iterations.
- `CURL?: number` - swirl intensity.
- `SPLAT_RADIUS?: number` - splat size.
- `SPLAT_FORCE?: number` - splat intensity.
- `SPLAT_COUNT?: number` - number of splats.
- `SPLAT_COLOR?: { r: number; g: number; b: number }` - fixed splat color.
- `SHADING?: boolean` - shading on/off.
- `COLORFUL?: boolean` - cycle colors automatically.
- `COLOR_UPDATE_SPEED?: number` - speed of color cycling.
- `PAUSED?: boolean` - pause the simulation.
- `BACK_COLOR?: { r: number; g: number; b: number }` - background color.
- `TRANSPARENT?: boolean` - transparent canvas background.
- `BLOOM?: boolean` - bloom post-processing.
- `BLOOM_ITERATIONS?: number` - bloom blur iterations.
- `BLOOM_RESOLUTION?: number` - bloom render resolution.
- `BLOOM_INTENSITY?: number` - bloom brightness.
- `BLOOM_THRESHOLD?: number` - bloom cutoff threshold.
- `BLOOM_SOFT_KNEE?: number` - bloom falloff softness.
- `SUNRAYS?: boolean` - sun ray effect.
- `SUNRAYS_RESOLUTION?: number` - sun ray render resolution.
- `SUNRAYS_WEIGHT?: number` - sun ray strength.

## Manual Configuration

You can set the simulation props by creating a config object and passing it to `FluidCursor`.

```tsx
import { FluidCursor } from './components/FluidCursor';

export default function App() {
	return (
		<div className="relative min-h-screen bg-black">
			<FluidCursor
				config={{
					TRIGGER: 'hover',
					IMMEDIATE: false,
					SPLAT_RADIUS: 0.25,
					SPLAT_FORCE: 6000,
					CURL: 30,
					DENSITY_DISSIPATION: 2.5,
					VELOCITY_DISSIPATION: 0.5,
					COLORFUL: true,
					BLOOM: true,
					SUNRAYS: true,
				}}
			/>
		</div>
	);
}
```

If you want a fixed color instead of color cycling, set `COLORFUL` to `false` and provide `SPLAT_COLOR`.

```tsx
<FluidCursor
	config={{
		COLORFUL: false,
		SPLAT_COLOR: { r: 0.2, g: 0.8, b: 1 },
	}}
/>
```

## App Behavior

The control panel in `src/App.tsx` mirrors the config object and updates the live simulation when you apply changes.

- **Colorful Mode** toggles automatic hue cycling.
- **Bloom** enables the glow pass.
- **God Rays** enables the sun ray post-process.
- **Immediate Start** tells the engine to start right away.
- The **color wheel** sets `SPLAT_COLOR` manually and disables `COLORFUL`.
- The **sliders** adjust the physical behavior of the fluid.

The app keeps a draft config and an applied config so you can experiment first and then commit changes in one action.

## Suggested Tuning

- Increase `SPLAT_FORCE` for more dramatic bursts.
- Increase `CURL` for stronger swirls.
- Raise `DENSITY_DISSIPATION` and `VELOCITY_DISSIPATION` for faster fade-out.
- Lower `SIM_RESOLUTION` or `DYE_RESOLUTION` if you need better performance.
- Turn off `BLOOM` and `SUNRAYS` on slower devices.

## Run Locally

```bash
npm install
npm run dev
```

## Notes

- The app is set up for browser use only; the fluid engine needs a canvas and WebGL support.
- `TRANSPARENT: true` is always applied by the wrapper so the fluid layer can sit over the rest of the UI.
- The current UI is built for experimentation, but the `FluidCursor` component can be reused in other React apps as a drop-in overlay.

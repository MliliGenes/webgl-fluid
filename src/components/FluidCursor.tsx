import { useEffect, useRef } from 'react';
import WebGLFluid from 'webgl-fluid';

export interface FluidCursorConfig {
  TRIGGER?: 'hover' | 'click';
  IMMEDIATE?: boolean;
  AUTO?: boolean;
  INTERVAL?: number;
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SPLAT_COUNT?: number;
  SPLAT_COLOR?: { r: number; g: number; b: number } | undefined;
  SHADING?: boolean;
  COLORFUL?: boolean;
  COLOR_UPDATE_SPEED?: number;
  PAUSED?: boolean;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
  BLOOM?: boolean;
  BLOOM_ITERATIONS?: number;
  BLOOM_RESOLUTION?: number;
  BLOOM_INTENSITY?: number;
  BLOOM_THRESHOLD?: number;
  BLOOM_SOFT_KNEE?: number;
  SUNRAYS?: boolean;
  SUNRAYS_RESOLUTION?: number;
  SUNRAYS_WEIGHT?: number;
}

export interface FluidCursorProps {
  config?: FluidCursorConfig;
}

export function FluidCursor({ config }: FluidCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // We only mount WebGLFluid once per canvas instance
    try {
      WebGLFluid(canvasRef.current, {
        TRANSPARENT: true,
        ...config,
      });
    } catch (e) {
      console.error("WebGLFluid initialization failed", e);
    }
  }, [config]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="block pointer-events-auto bg-transparent object-cover"
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
}

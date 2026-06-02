import { useState } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { hsvaToHex } from '@uiw/color-convert';
import { FluidCursor, FluidCursorConfig } from './components/FluidCursor';
import { Droplets, Sun, Activity, Zap, Palette, Power, Code, Copy, Check, X } from 'lucide-react';

const INITIAL_CONFIG: FluidCursorConfig = {
  TRIGGER: 'hover',
  IMMEDIATE: false,
  COLORFUL: true,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
  CURL: 30,
  DENSITY_DISSIPATION: 2.5,
  VELOCITY_DISSIPATION: 0.5,
  BLOOM: true,
  SUNRAYS: true,
  TRANSPARENT: true,
  SPLAT_COLOR: undefined,
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

function rgbToHex(rgb: {r: number, g: number, b: number}) {
  const r = Math.round(rgb.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(rgb.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(rgb.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export default function App() {
  const [draftConfig, setDraftConfig] = useState<FluidCursorConfig>(INITIAL_CONFIG);
  const [appliedConfig, setAppliedConfig] = useState<FluidCursorConfig>(INITIAL_CONFIG);
  const [engineKey, setEngineKey] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 100, a: 1 });

  const handleApply = () => {
    setAppliedConfig(draftConfig);
    setEngineKey((k) => k + 1);
  };

  const updateConfig = (key: keyof FluidCursorConfig, value: any) => {
    setDraftConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleColorSelect = (rgb: {r: number, g: number, b: number}) => {
    setDraftConfig((prev) => ({ ...prev, SPLAT_COLOR: rgb, COLORFUL: false }));
  };

  const activeColorHex = draftConfig.SPLAT_COLOR 
    ? rgbToHex(draftConfig.SPLAT_COLOR)
    : null;

  return (
    <div className="relative min-h-screen bg-black font-sans text-slate-100 overflow-hidden">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Fluid Canvas overlay */}
      <FluidCursor key={engineKey} config={appliedConfig} />

      {/* Sidebar Controls */}
      <div className="absolute left-0 top-0 bottom-0 w-80 sm:w-96 bg-black/70 backdrop-blur-2xl border-r border-white/10 z-20 flex flex-col pointer-events-auto">
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex flex-shrink-0 items-center justify-center border border-white/20">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight text-white drop-shadow-md">Fluid Cursor</h1>
              <p className="text-xs text-slate-400">Simulation settings</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div className="grid grid-cols-2 gap-3">
            <ToggleCard 
              icon={<Palette className="w-5 h-5" />}
              title="Colorful Mode" 
              active={!!draftConfig.COLORFUL} 
              onChange={(v) => {
                const next = { ...draftConfig, COLORFUL: v };
                if (v) next.SPLAT_COLOR = undefined;
                setDraftConfig(next);
              }} 
            />
            
            <ToggleCard 
              icon={<Sun className="w-5 h-5" />}
              title="Bloom" 
              active={!!draftConfig.BLOOM} 
              onChange={(v) => updateConfig('BLOOM', v)} 
            />
            <ToggleCard 
              icon={<Activity className="w-5 h-5" />}
              title="God Rays" 
              active={!!draftConfig.SUNRAYS} 
              onChange={(v) => updateConfig('SUNRAYS', v)} 
            />
            <ToggleCard 
              icon={<Zap className="w-5 h-5" />}
              title="Immediate Start" 
              active={!!draftConfig.IMMEDIATE} 
              onChange={(v) => updateConfig('IMMEDIATE', v)} 
            />
          </div>

          <div className="p-4 rounded-xl border bg-white/[0.02] border-transparent flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-200">Fluid Color</h3>
            </div>
            <div className="relative flex justify-center w-full pb-4">
              <Wheel 
                color={hsva}
                onChange={(color) => {
                  setHsva({ ...hsva, ...color.hsva });
                  const hex = hsvaToHex(color.hsva);
                  const rgb = hexToRgb(hex);
                  if (rgb) {
                    setDraftConfig((prev) => ({ ...prev, SPLAT_COLOR: rgb, COLORFUL: false }));
                  }
                }} 
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Physics Engine</h3>
            <SliderControl 
              label="Splat Radius" 
              value={draftConfig.SPLAT_RADIUS!} 
              min={0.05} max={1.0} step={0.05} 
              onChange={(v) => updateConfig('SPLAT_RADIUS', v)} 
            />
            <SliderControl 
              label="Splat Force" 
              value={draftConfig.SPLAT_FORCE!} 
              min={1000} max={10000} step={500} 
              onChange={(v) => updateConfig('SPLAT_FORCE', v)} 
            />
            <SliderControl 
              label="Simulation Curl" 
              value={draftConfig.CURL!} 
              min={0} max={50} step={1} 
              onChange={(v) => updateConfig('CURL', v)} 
            />
            <SliderControl 
              label="Density Dissipation" 
              value={draftConfig.DENSITY_DISSIPATION!} 
              min={0.1} max={5.0} step={0.1} 
              onChange={(v) => updateConfig('DENSITY_DISSIPATION', v)} 
            />
            <SliderControl 
              label="Velocity Dissipation" 
              value={draftConfig.VELOCITY_DISSIPATION!} 
              min={0.1} max={3.0} step={0.1} 
              onChange={(v) => updateConfig('VELOCITY_DISSIPATION', v)} 
            />
          </div>
        </div>

        <div className="flex-shrink-0 p-6 border-t border-white/5 bg-black/40 flex items-center gap-3">
          <button 
            onClick={() => setShowCode(true)}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-300 hover:text-white"
            title="Export JSX Component"
          >
            <Code className="w-5 h-5" />
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 h-12 rounded-xl bg-white hover:bg-slate-200 text-black font-medium flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
          >
            <Power className="w-4 h-4" />
            Apply Settings
          </button>
        </div>
      </div>

      {showCode && (
        <CodeModal config={appliedConfig} onClose={() => setShowCode(false)} />
      )}
    </div>
  );
}

function CodeModal({ config, onClose }: { config: FluidCursorConfig, onClose: () => void }) {
  const [copiedApp, setCopiedApp] = useState(false);
  const [copiedComp, setCopiedComp] = useState(false);
  
  const componentCode = `import { useEffect, useRef } from 'react';
import WebGLFluid from 'webgl-fluid';

export function FluidCursor({ config }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      WebGLFluid(canvasRef.current, {
        TRANSPARENT: true,
        ...config,
      });
    } catch (e) {
      console.error(e);
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
}`;

  const usageCode = `import { FluidCursor } from './components/FluidCursor';

export default function App() {
  return (
    <div className="relative min-h-screen bg-black">
      <FluidCursor 
        config={${JSON.stringify(config, null, 2).replace(/\n/g, '\n        ')}}
      />
      {/* Your app content here */}
      <div className="relative z-10 pointer-events-none">
        <h1 className="text-white">Hello Fluid Cursor</h1>
      </div>
    </div>
  )
}`;

  const copyCode = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-white" />
            Integration Code
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">1. Install dependency</span>
              </div>
              <div className="bg-black/60 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 flex justify-between items-center">
                <code>npm install webgl-fluid</code>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">2. Usage (App.tsx)</span>
                <button 
                  onClick={() => copyCode(usageCode, setCopiedApp)} 
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                >
                  {copiedApp ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                  {copiedApp ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-black/60 border border-slate-800 rounded-xl p-4 overflow-x-auto relative">
                <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                  <code>{usageCode}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">3. Component (FluidCursor.tsx)</span>
              <button 
                onClick={() => copyCode(componentCode, setCopiedComp)} 
                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
              >
                {copiedComp ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                {copiedComp ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-black/60 border border-slate-800 rounded-xl p-4 overflow-x-auto relative h-[calc(100%-2rem)]">
              <pre className="text-xs text-slate-300 font-mono leading-relaxed">
                <code>{componentCode}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ToggleCard({ 
  icon, title, active, onChange 
}: { 
  icon: React.ReactNode, title: string, active: boolean, onChange: (v: boolean) => void 
}) {
  return (
    <button 
      onClick={() => onChange(!active)}
      title={title}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 ${
        active 
          ? 'bg-white/10 border-white/20 text-white' 
          : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05] text-slate-400'
      }`}
    >
      <div className={`p-2 rounded-lg flex-shrink-0 ${active ? 'bg-white/20' : 'bg-white/5'}`}>
        {icon}
      </div>
    </button>
  );
}

function SliderControl({
  label, value, min, max, step, onChange
}: {
  label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-xs font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
          {Number(value).toFixed(step < 1 ? 2 : 0)}
        </span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white hover:accent-slate-200 transition-all"
      />
    </div>
  );
}


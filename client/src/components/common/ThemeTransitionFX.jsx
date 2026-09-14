import { Sun, Moon, Shirt, Watch, ShoppingBag, Glasses, Footprints, Gem } from 'lucide-react';

const ORBIT_ICONS = [Shirt, Watch, ShoppingBag, Glasses, Footprints, Gem];
const RADIUS = 84;

export default function ThemeTransitionFX({ fx }) {
  if (!fx) return null;
  const isDark = fx.targetTheme === 'dark';
  const CenterIcon = isDark ? Moon : Sun;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center">
        {ORBIT_ICONS.map((Icon, i) => {
          const angle = (i / ORBIT_ICONS.length) * 2 * Math.PI - Math.PI / 2;
          const ox = Math.cos(angle) * RADIUS;
          const oy = Math.sin(angle) * RADIUS;
          return (
            <div
              key={i}
              className="orbit-icon absolute flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg dark:bg-navy-dark/90 dark:text-white"
              style={{
                '--ox': `${ox}px`,
                '--oy': `${oy}px`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <Icon size={16} />
            </div>
          );
        })}

        <div
          className="orbit-emblem flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border border-white/30 bg-white/20 shadow-2xl backdrop-blur-xl"
          style={{ animationDelay: '80ms' }}
        >
          <CenterIcon size={26} className={isDark ? 'text-indigo-100' : 'text-amber'} />
          <span className="text-[9px] font-semibold uppercase tracking-wide text-white/90">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </div>
      </div>
    </div>
  );
}

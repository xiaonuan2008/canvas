import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, position = 'bottom' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), 400);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1',
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div className={`absolute z-50 px-2 py-1 text-[11px] text-white bg-[#1c2128] border border-[#30363d] rounded shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}>
          {content}
          <div className={`absolute w-1.5 h-1.5 bg-[#1c2128] border-[#30363d] rotate-45 ${
            position === 'bottom' ? '-top-0.5 left-1/2 -translate-x-1/2 border-t border-l' :
            position === 'top' ? '-bottom-0.5 left-1/2 -translate-x-1/2 border-b border-r' :
            position === 'right' ? '-left-0.5 top-1/2 -translate-y-1/2 border-t border-l' :
            '-right-0.5 top-1/2 -translate-y-1/2 border-b border-r'
          }`} />
        </div>
      )}
    </div>
  );
}

import * as React from 'react';

interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  clickable?: boolean;
}

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ content, children, clickable }) => {
  const [visible, setVisible] = React.useState(false);
  const timeout = React.useRef<number | undefined>();

  const show = () => {
    timeout.current = window.setTimeout(() => setVisible(true), 100);
  };
  const hide = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setVisible(false);
  };
  const toggle = () => setVisible(v => !v);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
      {...(clickable ? { onClick: toggle } : {})}
    >
      {children}
      {visible && (
        <div style={{
          position: 'absolute',
          zIndex: 100,
          top: '110%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#222',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'pre-line',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {content}
        </div>
      )}
    </span>
  );
};

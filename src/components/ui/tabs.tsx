import * as React from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, value: valueProp, onValueChange, className, children }) => {
  const [activeInternal, setActiveInternal] = React.useState(defaultValue || '');
  // Determine controlled or uncontrolled active value
  const active = valueProp !== undefined ? valueProp : activeInternal;
  // Wrapper to update active and propagate change
  const setActive = (val: string) => {
    if (valueProp === undefined) {
      setActiveInternal(val);
    }
    onValueChange?.(val);
  };
  // Find all triggers and set first as default if not set
  React.useEffect(() => {
    if (!active) {
      const triggers = React.Children.toArray(children).filter(
        (child: any) => React.isValidElement(child) && child.type && (child.type as any).displayName === 'TabsTrigger'
      );
      if (triggers.length > 0 && React.isValidElement(triggers[0])) setActive(triggers[0].props.value);
    }
  }, [children, active]);
  // Provide context
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}
export const TabsList: React.FC<TabsListProps> = ({ className, children }) => (
  <div className={className}>{children}</div>
);

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}
export const TabsContext = React.createContext<any>(null);
export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const ctx = React.useContext(TabsContext);
  return (
    <button
      type="button"
      className={`px-3 py-1 rounded font-medium text-sm whitespace-nowrap transition-colors border-2 ${ctx.active === value ? 'border-primary bg-primary/10 text-primary' : 'border-transparent hover:bg-muted/50'}`}
      onClick={() => ctx.setActive(value)}
      style={{ borderLeftWidth: '4px' }}
    >
      {children}
    </button>
  );
};
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}
export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const ctx = React.useContext(TabsContext);
  if (ctx.active !== value) return null;
  return <div>{children}</div>;
};

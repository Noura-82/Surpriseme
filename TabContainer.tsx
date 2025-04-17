import { ReactNode } from "react";

interface TabContainerProps {
  id: string;
  activeTab: string;
  children: ReactNode;
}

export default function TabContainer({ id, activeTab, children }: TabContainerProps) {
  if (activeTab !== id) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}

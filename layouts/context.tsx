import {
  MouseEventHandler,
  ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";
import { Config } from "@/constants/config";

export const LayoutContext = createContext<{
  toggleDrawer: MouseEventHandler<HTMLButtonElement>;
  isDrawerCollapsed: boolean;
}>({
  toggleDrawer: () => {},
  isDrawerCollapsed: false,
});

export default function LayoutContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

  useEffect(() => {
    const drawerKey = localStorage.getItem(Config.localDrawerKey);
    setIsDrawerCollapsed(drawerKey == "true" ? true : false);
  }, []);

  const toggleDrawer = () => {
    localStorage.setItem(
      Config.localDrawerKey,
      (!isDrawerCollapsed).toString()
    );
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  return (
    <LayoutContext.Provider
      value={{
        isDrawerCollapsed,
        toggleDrawer,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

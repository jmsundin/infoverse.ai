import { createContext, useEffect, useState } from "react";
import Graph from "graphology";

interface AppContextType {
  graphData: Graph | null;
  setGraphData: (graphData: Graph | null) => void;
  queryFormInitialPosition: boolean;
  setQueryFormInitialPosition: (position: boolean) => void;
  splitPaneView: boolean;
  setSplitPaneView: (isVisible: boolean) => void;
  wikipediaPageUrl: string;
  setWikipediaPageUrl: (value: string) => void;
}

const defaultAppContext: AppContextType = {
  graphData: null,
  setGraphData: () => {},
  queryFormInitialPosition: true,
  setQueryFormInitialPosition: () => {},
  splitPaneView: false,
  setSplitPaneView: () => {},
  wikipediaPageUrl: "",
  setWikipediaPageUrl: () => {},
};

export const AppContext = createContext<AppContextType>(defaultAppContext);

function AppContextProvider({ children }) {
  const [graphData, setGraphData] = useState<Graph | null>(null);
  const [queryFormInitialPosition, setQueryFormInitialPosition] = useState(true);
  const [splitPaneView, setSplitPaneView] = useState(false);
  const [wikipediaPageUrl, setWikipediaPageUrl] = useState("");

  const appContext = {
    graphData,
    setGraphData,
    queryFormInitialPosition,
    setQueryFormInitialPosition,
    splitPaneView,
    setSplitPaneView,
    wikipediaPageUrl,
    setWikipediaPageUrl
  };

  return (
    <AppContext.Provider value={appContext}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;

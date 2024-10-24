import { useRouter } from "next/navigation";
import { createContext, useState } from "react";

import SPARQLQueryDispatcher from "@/lib/SPARQLQueryDispatcher";
import { endpointUrl, sparqlQuery } from "@/data/sparqlQueryParams";
import { parseWikidata } from "@/lib/parseWikidata";

import { initialGraphData, data } from "@/data/suggestedTopics";

import { hierarchy } from "d3-hierarchy";
import { mergeSubgraph } from "@/lib/graph-utils";

export const GraphDataContext = createContext();

function GraphDataProvider({ children }) {
  // const [graph, setGraph] = useState(new Graph());

  const initialRoot = hierarchy(data);
  const initialNodes = initialRoot.descendants();
  const initialLinks = initialRoot.links();

  const [root, setRoot] = useState(initialRoot);
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [previousRoot, setPreviousRoot] = useState(initialRoot);
  const [previousNodes, setPreviousNodes] = useState(initialNodes);
  const [previousLinks, setPreviousLinks] = useState(initialLinks);
  const [inspiration, setInspiration] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [graphVisible, setGraphVisible] = useState(false);
  const [splitPaneView, setSplitPaneView] = useState(false);

  const [topicQID, setTopicQID] = useState("Q35120");

  const router = useRouter();

  if (router.pathname === "/") {
    if (inspiration) setGraphVisible(true);
    else setGraphVisible(false);
  }

  if (previousRoot !== root) {
    setPreviousRoot(root);
  }

  if (previousNodes !== nodes) {
    setPreviousNodes(nodes);
  }

  if (previousLinks !== links) {
    setPreviousLinks(links);
  }

  async function fetchGraphData(
    topicQID,
    createNewGraph = true,
    addAsSubgraph = false
  ) {
    const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
    const query = sparqlQuery.replaceAll("Q21198", topicQID);
    const jsonResponse = await queryDispatcher.query(query);
    const graphData = await parseWikidata(jsonResponse);
    if (graphData === null || graphData === undefined) return;
    setFetching(false);

    const newRoot = hierarchy(graphData);
    const newNodes = newRoot.descendants();
    const newLinks = newRoot.links();

    if (createNewGraph) {
      setRoot(newRoot);
      setNodes(newNodes);
      setLinks(newLinks);
    } else if (addAsSubgraph) {
      const { nodes, links } = mergeSubgraph(
        newRoot,
        newNodes,
        newLinks,
        previousRoot,
        previousNodes
      );
      setRoot(newRoot);
      setNodes(nodes);
      setLinks(links);
    }
  }

  const graphContext = {
    inspiration: inspiration,
    setInspiration: setInspiration,
    fetching: fetching,
    setFetching: setFetching,
    setGraphData: setRoot,
    fetchGraphData: fetchGraphData,
    graphVisible: graphVisible,
    setGraphVisible: setGraphVisible,
    splitPaneView: splitPaneView,
    setSplitPaneView: setSplitPaneView,
    topicQID: topicQID,
    setTopicQID: setTopicQID,
    root: root,
    nodes: nodes,
    links: links,
    prevRoot: previousRoot,
    prevNodes: previousNodes,
    prevLinks: previousLinks,
  };

  return (
    <GraphDataContext.Provider value={graphContext}>
      {children}
    </GraphDataContext.Provider>
  );
}

export default GraphDataProvider;

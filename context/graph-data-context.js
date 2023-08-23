import { useRouter } from "next/navigation";
import { createContext, useState } from "react";

import SPARQLQueryDispatcher from "@/lib/SPARQLQueryDispatcher";
import { endpointUrl, sparqlQuery } from "@/data/sparqlQueryParams";
import { parseWikidata } from "@/lib/parseWikidata";

import { initialGraphData, data } from "@/data/suggestedTopics";

import { hierarchy } from "d3-hierarchy";

export const GraphDataContext = createContext();

function GraphDataProvider({ children }) {
  const initialRoot = hierarchy(data);
  const initialNodes = initialRoot.descendants();
  const initialLinks = initialRoot.links();

  const [root, setRoot] = useState(initialRoot);
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [prevRoot, setPrevRoot] = useState(initialRoot);
  const [prevNodes, setPrevNodes] = useState(initialNodes);
  const [prevLinks, setPrevLinks] = useState(initialLinks);
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

  if (prevRoot !== root) {
    setPrevRoot(root);
  }

  if (prevNodes !== nodes) {
    setPrevNodes(nodes);
  }

  if (prevLinks !== links) {
    setPrevLinks(links);
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
      addSubgraph(newRoot, newNodes, newLinks);
    }
  }

  function addSubgraph(newRoot, newNodes, newLinks) {
    console.log("newRoot:", newRoot);
    console.log("newNodes:", newNodes);
    console.log("newLinks:", newLinks);

    const prevRoot = root;
    const prevNodes = nodes;
    console.log("prevNodes:", prevNodes);

    const prevNodeQIDs = prevNodes.map((node) => node.data.qid);
    const uniqueNewNodes = newNodes.filter(
      (node) => !prevNodeQIDs.includes(node.data.qid)
    );

    console.log("number of new nodes:", newNodes.length);
    console.log("unique new nodes:", uniqueNewNodes);

    const updatedPrevNodesWithChildren =
      prevNodes.length === 0
        ? uniqueNewNodes
        : prevNodes.map((node) => {
            uniqueNewNodes.forEach((uniqueNewNode) => {
              if (uniqueNewNode.depth !== 0) {
                if (uniqueNewNode.parent.data.qid === node.data.qid) {
                  if (node.children === undefined) node.children = [];
                  node.children.push(uniqueNewNode);
                  node.data.children.push(uniqueNewNode);
                  return node;
                }
              }
            });
            return node;
          });

    console.log(
      "updated prev nodes with children:",
      updatedPrevNodesWithChildren
    );
    const updatedGraphData = updatedPrevNodesWithChildren;

    const updatedRoot = hierarchy(updatedGraphData);
    console.log("updated root:", updatedRoot);
    const updatedNodes = updatedRoot.descendants();
    const updatedLinks = updatedRoot.links();
    setRoot(updatedRoot);
    setNodes(updatedNodes);
    setLinks(updatedLinks);
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
    prevRoot: prevRoot,
    prevNodes: prevNodes,
    prevLinks: prevLinks,
  };

  return (
    <GraphDataContext.Provider value={graphContext}>
      {children}
    </GraphDataContext.Provider>
  );
}

export default GraphDataProvider;

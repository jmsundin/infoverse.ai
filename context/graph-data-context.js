import { createContext, useState, useEffect } from "react";

import SPARQLQueryDispatcher from "@/lib/SPARQLQueryDispatcher";
import { endpointUrl, sparqlQuery } from "@/data/sparqlQueryParams";
import { parseWikidata } from "@/lib/utils";

import createGraphWithSuggestedTopics from "@/data/suggestedTopics";

import { hierarchy } from "d3-hierarchy";

export const GraphDataContext = createContext();

function GraphDataProvider({ children }) {
  // const [suggestedTopicsGraphData, setSuggestedTopicsGraphData] =
  //   useState(null);

  // if (suggestedTopicsGraphData === null) {
  //   var suggestedTopicsRoot = getSuggestedTopicsGraphData();
  //   var suggestedTopicsNodes = suggestedTopicsRoot.descendants();
  //   var suggestedTopicsLinks = suggestedTopicsRoot.links();
  // }

  const initialGraphData = {
    label: "Human",
    qid: "Q5",
    description: "human being, person",
    children: [
      {
        label: "Animal",
        qid: "Q729",
        description: "multicellular organism that is eukaryotic",
        children: [
          {
            label: "Bird",
            qid: "Q5113",
            description: "class of vertebrates",
            children: [],
          },
          {
            label: "Fish",
            qid: "Q133836",
            description: "vertebrate that lives in water",
            children: [],
          },
          {
            label: "Insect",
            qid: "Q12078",
            description: "class of invertebrates",
            children: [],
          },
        ],
      },
      {
        label: "Person",
        qid: "Q215627",
        description: "human being",
        children: [
          {
            label: "Politician",
            qid: "Q82955",
            description: "person who is involved in politics for a profession",
            children: [],
          },
          {
            label: "Scientist",
            qid: "Q901",
            description: "person who engages in science",
            children: [],
          },
          {
            label: "Writer",
            qid: "Q36180",
            description: "person who uses written words to communicate ideas",
            children: [],
          },
        ],
      },
      {
        label: "Organism",
        qid: "Q7239",
        description: "any contiguous living system",
        children: [
          {
            label: "Plant",
            qid: "Q756",
            description: "living organism of the kingdom Plantae",
            children: [],
          },
          {
            label: "Fungus",
            qid: "Q8447",
            description: "organism that is classified in the kingdom Fungi",
            children: [],
          },
          {
            label: "Bacteria",
            qid: "Q10876",
            description: "type of biological cell",
            children: [],
          },
        ],
      },
    ],
  };
  const initialRoot = hierarchy(initialGraphData);
  const initialNodes = initialRoot.descendants();
  const initialLinks = initialRoot.links();

  const [root, setRoot] = useState(initialRoot);
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [prevRoot, setPrevRoot] = useState(initialRoot);
  const [prevNodes, setPrevNodes] = useState(initialNodes);
  const [prevLinks, setPrevLinks] = useState(initialLinks);

  const [topicQID, setTopicQID] = useState("Q5");

  if (prevRoot !== root) {
    setPrevRoot(root);
  }

  if (prevNodes !== nodes) {
    setPrevNodes(nodes);
  }

  if (prevLinks !== links) {
    setPrevLinks(links);
  }

  let i = 0;
  // let randomTopicQID = "Q" + Math.floor(Math.random() * 100);
  // console.log(randomTopicQID);

  // if (i === 0) {
  //   fetchGraphData("Q215627");
  //   i++;
  // }

  // function getSuggestedTopicsGraphData() {
  //   const suggestedItemsGraphData = createGraphWithSuggestedTopics();
  //   if (suggestedItemsGraphData?.children.length > 0) {
  //     const root = hierarchy(suggestedItemsGraphData);
  //     setSuggestedTopicsGraphData(root);
  //     return root;
  //   }

  //   const root = hierarchy({
  //     name: "No suggested topics",
  //     children: [],
  //   });
  //   return root;
  // }

  async function fetchGraphData(topicQID) {
    const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
    // console.log(topicQID);
    const query = sparqlQuery.replaceAll("Q21198", topicQID);
    const jsonResponse = await queryDispatcher.query(query);
    console.log(jsonResponse);
    const graphData = await parseWikidata(jsonResponse);
    console.log(graphData);
    const newRoot = hierarchy(graphData);
    console.log("root:", newRoot);

    // console.log("new root:", newRoot);
    setRoot(newRoot);
    setNodes(newRoot.descendants());
    setLinks(newRoot.links());

    if (typeof nodes === "object") return;
    const prevNodes = nodes;
    // console.log("new nodes:", newNodes);
    // console.log("prev nodes:", prevNodes);
    const prevNodeQIDs = prevNodes.map((node) => node.data.qid);
    const uniqueNodes = newNodes.filter(
      (node) => !prevNodeQIDs.includes(node.data.qid)
    );

    // find parent of unique node in prevGraphData
    uniqueNodes.forEach((node) => {
      if (node.depth !== 0) {
        node.children = [];
        return node;
      }
      return node;
    });

    const updatedGraphData = uniqueNodes.map((node) => {
      const parent = prevNodes.find((prevNode) => {
        if (prevNode.data.qid === node.parent.data.qid) {
          if (prevNode.depth !== 0) prevNode.children = [];
          prevNode.children.push(node);
          prevNode.data.children.push(node);
          return prevNode;
        }
      });
      if (parent === null) return node;
      return parent;
    });

    console.log("updated graph data:", updatedGraphData);
    setRoot(updatedGraphData);
    setNodes([...prevNodes, ...uniqueNodes]);
    const newLinks = newRoot.links();
    setLinks([...prevLinks, ...newLinks]);

    if (root !== prevRoot) {
      setPrevRoot(root);
    }

    if (nodes !== prevNodes) {
      setPrevNodes(nodes);
    }

    if (links !== prevLinks) {
      setPrevLinks(links);
    }
  }

  const graphContext = {
    topicQID: topicQID,
    setTopicQID: setTopicQID,
    root: root,
    nodes: nodes,
    links: links,
    prevRoot: prevRoot,
    prevNodes: prevNodes,
    prevLinks: prevLinks,
    setGraphData: setRoot,
    fetchGraphData: fetchGraphData,
  };

  return (
    <GraphDataContext.Provider value={graphContext}>
      {children}
    </GraphDataContext.Provider>
  );
}

export default GraphDataProvider;

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
    qid: "Q35120",
    label: "entity",
    value: "entity",
    description: "anything that can be considered, discussed, or observed",
    aliases: ["thing", "entity", "entities"],
    uri: "http://www.wikidata.org/entity/Q35120",
    url: "http://www.wikidata.org/wiki/Q35120",
    repository: "wikidata",
    children: [
      {
        qid: "Q215627",
        label: "Person",
        value: "Person",
        description: "human being",
        aliases: [
          "person",
          "people",
          "human",
          "humans",
          "human being",
          "human beings",
        ],
        uri: "http://www.wikidata.org/entity/Q215627",
        url: "http://www.wikidata.org/wiki/Q215627",
        repository: "wikidata",
        children: [
          {
            qid: "Q82955",
            label: "Politician",
            value: "Politician",
            description: "person who is involved in politics for a profession",
            aliases: ["politician", "politicians"],
            uri: "http://www.wikidata.org/entity/Q82955",
            url: "http://www.wikidata.org/wiki/Q82955",
            repository: "wikidata",
            children: [],
          },
          {
            qid: "Q901",
            label: "Scientist",
            value: "Scientist",
            description: "person who engages in science",
            aliases: ["scientist", "scientists"],
            uri: "http://www.wikidata.org/entity/Q901",
            url: "http://www.wikidata.org/wiki/Q901",
            repository: "wikidata",
            children: [],
          },
          {
            qid: "Q36180",
            label: "Writer",
            value: "Writer",
            description: "person who uses written words to communicate ideas",
            aliases: ["writer", "writers"],
            uri: "http://www.wikidata.org/entity/Q36180",
            url: "http://www.wikidata.org/wiki/Q36180",
            repository: "wikidata",
            children: [],
          },
        ],
      },
      {
        qid: "Q729",
        label: "Animal",
        value: "Animal",
        description: "multicellular organism that is eukaryotic",
        aliases: ["animals", "animal", "beast", "beasts"],
        uri: "http://www.wikidata.org/entity/Q729",
        url: "http://www.wikidata.org/wiki/Q729",
        repository: "wikidata",
        children: [
          {
            qid: "Q5113",
            label: "Bird",
            value: "Bird",
            description: "class of vertebrates",
            aliases: ["birds", "bird"],
            uri: "http://www.wikidata.org/entity/Q5113",
            url: "http://www.wikidata.org/wiki/Q5113",
            repository: "wikidata",
            children: [],
          },
          {
            qid: "Q133836",
            label: "Fish",
            value: "Fish",
            description: "vertebrate that lives in water",
            aliases: ["fish", "fishes"],
            uri: "http://www.wikidata.org/entity/Q133836",
            url: "http://www.wikidata.org/wiki/Q133836",
            repository: "wikidata",
            children: [],
          },
          {
            qid: "Q12078",
            label: "Insect",
            value: "Insect",
            description: "class of invertebrates",
            aliases: ["insect", "insects"],
            uri: "http://www.wikidata.org/entity/Q12078",
            url: "http://www.wikidata.org/wiki/Q12078",
            repository: "wikidata",
            children: [],
          },
        ],
      },
      {
        qid: "Q7239",
        label: "Organism",
        value: "Organism",
        description: "any contiguous living system",
        aliases: ["organism", "organisms"],
        uri: "http://www.wikidata.org/entity/Q7239",
        url: "http://www.wikidata.org/wiki/Q7239",
        repository: "wikidata",
        children: [
          {
            qid: "Q756",
            label: "Plant",
            value: "Plant",
            description: "living organism of the kingdom Plantae",
            aliases: ["plant", "plants"],
            uri: "http://www.wikidata.org/entity/Q756",
            url: "http://www.wikidata.org/wiki/Q756",
            repository: "wikidata",
            children: [],
          },
          {
            qid: "Q8447",
            label: "Fungus",
            value: "Fungus",
            description: "organism that is classified in the kingdom Fungi",
            aliases: ["fungus", "fungi"],
            uri: "http://www.wikidata.org/entity/Q8447",
            url: "http://www.wikidata.org/wiki/Q8447",
            repository: "wikidata",
            children: [],
          },
          {
            qid: "Q10876",
            label: "Bacteria",
            value: "Bacteria",
            description: "type of biological cell",
            aliases: ["bacteria", "bacterium"],
            uri: "http://www.wikidata.org/entity/Q10876",
            url: "http://www.wikidata.org/wiki/Q10876",
            repository: "wikidata",
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

  const [topicQID, setTopicQID] = useState("Q35120");

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

    console.log("updated prev nodes with children:", updatedPrevNodesWithChildren);
    const updatedGraphData = updatedPrevNodesWithChildren;

    const updatedRoot = hierarchy(updatedGraphData);
    console.log("updated root:", updatedRoot)
    const updatedNodes = updatedRoot.descendants();
    const updatedLinks = updatedRoot.links();
    setRoot(updatedRoot);
    setNodes(updatedNodes);
    setLinks(updatedLinks);
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

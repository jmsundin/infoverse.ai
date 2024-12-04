import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  SearchOptions,
  WikidataSearchResponse,
  SparqlResults,
  NodeAttributes,
  EdgeAttributes,
} from "./types";
import Graph from "graphology";

import SPARQLQueryDispatcher from "@/lib/SPARQLQueryDispatcher";
import {
  endpointUrl,
  sparqlQuery,
  popularQids,
} from "@/data/sparqlQueryParams";

import { WikidataBinding, SparqlQueryResult } from "../lib/types";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getRandomQid(): string {
  const min = 1;
  const max = 10000;

  const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  return "Q" + randomId;
}

export function popularTopicQid(): string {
  return popularQids[Math.floor(Math.random() * popularQids.length)];
}

function getLastUrlSegment(url) {
  // Remove trailing slash if present
  url = url.replace(/\/$/, "");

  // Split on / and get last element
  return url.split("/").pop();
}

function createGraphFromBindings(bindings: WikidataBinding[]): Graph {
  const graph = new Graph({
    type: "directed",
    allowSelfLoops: true,
    multi: true,
  });

  bindings.forEach((binding) => {
    const subjectId: string = getLastUrlSegment(binding.subject.value);
    const objectId: string = getLastUrlSegment(binding.object.value);

    // Add subject node if it doesn't exist
    if (!graph.hasNode(subjectId)) {
      graph.addNode(subjectId, {
        label: binding.subjectLabel.value,
        description: binding.subjectDescription?.value,
        lang: binding.subjectLabel["xml:lang"],
        type: "subject",
      } as NodeAttributes);
    }

    // Add object node if it doesn't exist
    if (!graph.hasNode(objectId)) {
      graph.addNode(objectId, {
        label: binding.objectLabel.value,
        description: binding.objectDescription?.value,
        lang: binding.objectLabel["xml:lang"],
        type: "object",
      } as NodeAttributes);
    }

    // Add edge between subject and object
    graph.addEdge(subjectId, objectId, {
      label: binding.predicateEntityIriLabel.value,
      predicateEntity: binding.predicateEntity.value,
      lang: binding.predicateEntityIriLabel["xml:lang"],
    } as EdgeAttributes);
  });
  return graph;
}

export async function fetchGraphData(topicQid: string): Promise<Graph | null> {
  const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  const query = sparqlQuery.replaceAll("Q1", topicQid);

  try {
    const jsonResponse: SparqlQueryResult = await queryDispatcher.query(query);
    if (!jsonResponse) {
      console.error("No response from SPARQL query");
      return null;
    }
    return createGraphFromBindings(jsonResponse.results.bindings);
  } catch (error) {
    console.error("Error in fetchGraphData:", error);
    return null;
  }
}

export async function getSearchOptions(
  inputValue
): Promise<WikidataSearchResponse | null> {
  const searchOptionsEndpoint =
    `https://www.wikidata.org/w/api.php?` +
    `action=wbsearchentities` +
    `&format=json` +
    `&origin=*` +
    `&language=en` +
    `&limit=10` +
    `&search=` +
    inputValue;

  let response = null;

  try {
    const response = await fetch(searchOptionsEndpoint);
    if (response.status == 200) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
  }
  return response;
}

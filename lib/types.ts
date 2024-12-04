// lib/types.ts

export interface Variable {
  name: string;
}

export interface UriValue {
  type: "uri";
  value: string;
}

export interface LiteralValue {
  type: "literal";
  value: string;
  "xml:lang"?: string;
}

export interface WikidataBinding {
  subject: UriValue;
  subjectLabel: LiteralValue;
  subjectDescription: LiteralValue;
  predicateLabel: LiteralValue;
  predicateEntity: LiteralValue;
  predicateEntityIriLabel: LiteralValue;
  object: UriValue;
  objectLabel: LiteralValue;
  objectDescription: LiteralValue;
}

export interface SparqlHead {
  variables: string[];
}

export interface SparqlResults {
  bindings: WikidataBinding[];
}

export interface SparqlQueryResult {
  head: SparqlHead;
  results: SparqlResults;
}

export interface GraphologyNode {
  id: string;
  attributes: NodeAttributes;
}

export interface GraphologyEdge {
  source: string;
  target: string;
  attributes: EdgeAttributes;
}

export interface NodeAttributes {
  label: string;
  description?: string;
  lang?: string;
  type: "subject" | "object";
}

export interface EdgeAttributes {
  label: string;
  predicateEntity: string;
  lang?: string;
}

export interface ColaNode {
  id: string;
  attributes: NodeAttributes;
  x: number;
  y: number;
  index?: number;
  fixed?: number;
  height?: number;
  width?: number;
}

export interface ColaLink {
  id: string;
  source: ColaNode;
  target: ColaNode;
  attributes: EdgeAttributes;
  length?: number;
  weight?: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Bounds extends Position {
  X: number;
  Y: number;
}

export interface Variable {
  desiredPosition: number;
  weight: number;
  scale: number;
  offset: number;
  index: number;
}

export interface D3ColaGraphologyNode {
  id: string;
  label: string;
  description: string;
  lang: string;
  type: string;
  index: number;
  x: number;
  y: number;
  variable: Variable;
  bounds: Bounds;
}

export interface SearchOptions {
  qid: string;
  title: string; // qid
  pageid: number;
  concepturi: string;
  repository: string;
  url: string;
  display: {
    label: {
      value: string;
      language: string;
    };
    description: {
      value: string;
      language: string;
    };
  };
  label: string;
  description: string;
  match: {
    type: string;
    language: string;
    text: string;
  };
}

/*
{"searchinfo": {
    "search": "computer science"
  },
  "search": [
    {
      "id": "Q21198",
      "title": "Q21198",
      "pageid": 24532,
      "concepturi": "http://www.wikidata.org/entity/Q21198",
      "repository": "wikidata",
      "url": "//www.wikidata.org/wiki/Q21198",
      "display": {
        "label": {
          "value": "computer science",
          "language": "en"
        },
        "description": {
          "value": "study of computation",
          "language": "en"
        }
      },
      "label": "computer science",
      "description": "study of computation",
      "match": {
        "type": "label",
        "language": "en",
        "text": "computer science"
      }
    }
}
*/

export interface WikidataSearchResponse {
  searchinfo: {
    search: string;
  };
  search: SearchOptions[];
}

export default class SPARQLQueryDispatcher {
  private endpoint: string;

  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async query(sparqlQuery: string): Promise<any> {
    const fullUrl = this.endpoint + "?query=" + encodeURIComponent(sparqlQuery);
    const headers = { Accept: "application/sparql-results+json" };

    try {
      const response = await fetch(fullUrl, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching SPARQL query:", error);
      return null;
    }
  }
}

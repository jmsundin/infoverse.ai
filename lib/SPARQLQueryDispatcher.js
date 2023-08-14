export default class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	async query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return await fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}
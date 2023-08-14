
const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT DISTINCT ?subject ?subjectLabel ?subjectDescription ?predicateLabel ?predicateEntity ?predicateEntityIriLabel ?object ?objectLabel ?objectDescription
    WHERE {
      VALUES ?object { wd:Q21198 }
      VALUES ?predicate { 
        wdt:P31 wdt:P279 # subclass of
                wdt:P361 # part of
                wdt:P527 # has parts
                wdt:P460 # said to be the same
                wdt:P1382 # partially coincident with
                wdt:P1889 # different from
                wdt:P2184 # history of topic
                wdt:P1344 # partipant in
                wdt:P2283 # uses
                wdt:P1542 # has effect
                wdt:P3095 # practiced by 
      }
      
      { ?subject ?predicate ?object. }
      OPTIONAL {
        ?object ?predicate ?subject.
      }

      BIND( REPLACE( STR(?predicate), "prop/direct/", "entity/" ) AS ?predicateEntity ).
      BIND( IRI(STR(?predicateEntity)) AS ?predicateEntityIri ).


      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY ?subject
    LIMIT 50`;


export { endpointUrl, sparqlQuery };
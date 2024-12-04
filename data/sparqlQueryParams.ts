// TODO: use this list of properties:
// https://www.wikidata.org/w/index.php?title=Special:ListProperties/wikibase-item

const endpointUrl = "https://query.wikidata.org/sparql";
const sparqlQuery = `PREFIX wd: <http://www.wikidata.org/entity/>
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
    SELECT DISTINCT ?subject ?subjectLabel ?subjectDescription ?predicateLabel ?predicateEntity ?predicateEntityIriLabel ?object ?objectLabel ?objectDescription
    WHERE {
      VALUES ?object { wd:Q1 }
      VALUES ?predicate { 
        wdt:P31 wdt:P279 wdt:P361 wdt:P527    # Classification & Structure
        wdt:P355 wdt:P749 wdt:P171 wdt:P1151   # Parent-Child Relations
        wdt:P2670 wdt:P527 wdt:P2283 wdt:P737  # Composition
        wdt:P921 wdt:P1269 wdt:P1557 wdt:P5125 # Topic Relations
        wdt:P1535 wdt:P2283 wdt:P1889 wdt:P1382 # Dependencies
        wdt:P155 wdt:P156 wdt:P2184            # Temporal Relations
        wdt:P1629 wdt:P1542 wdt:P3095 wdt:P1344 # Conceptual Relations
      }
      
      { ?subject ?predicate ?object }
      UNION
      { ?object ?predicate ?subject }

      BIND(REPLACE(STR(?predicate), "prop/direct/", "entity/") AS ?predicateEntity)
      BIND(IRI(?predicateEntity) AS ?predicateEntityIri)

      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "en".
        ?subject rdfs:label ?subjectLabel.
        ?object rdfs:label ?objectLabel.
        ?predicateEntityIri rdfs:label ?predicateEntityIriLabel.
      }
    }
    ORDER BY ?subject
    LIMIT 20`;

const popularQids = [
  "Q5", // human
  "Q7747", // Albert Einstein
  "Q91", // Abraham Lincoln
  "Q712", // William Shakespeare
  "Q30", // United States
  "Q142", // France
  "Q84", // London
  "Q60", // New York City
  "Q336", // Internet
  "Q7397", // Computer
  "Q11344", // Chemical element
  "Q395", // Mathematics
  "Q11424", // Film
  "Q638", // Music
  "Q7889", // Video game
  "Q3305213", // Netflix
  "Q8134", // Economics
  "Q21198", // Psychology
  "Q9418", // Philosophy
  "Q36442", // Biology
  "Q17", // Japan
  "Q148", // China
  "Q668", // India
  "Q414", // Argentina
  "Q183", // Germany
  "Q408", // Australia
  "Q145", // United Kingdom
  "Q515", // City
  "Q373", // Planet
  "Q46", // Europe
  "Q48", // Asia
  "Q15", // Africa
  "Q27", // Ireland
  "Q408", // Australia
  "Q213", // Czech Republic
  "Q2", // Earth
  "Q405", // Universe
  "Q1454", // Psychology
  "Q7377", // Artificial Intelligence
  "Q309", // History
  "Q849", // Christianity
  "Q432", // Islam
  "Q9559", // Democracy
  "Q8072", // Human rights
  "Q11042", // Climate change
  "Q35120", // DNA
  "Q7366", // Medicine
  "Q11190", // Religion
  "Q121416", // Quantum mechanics
  "Q36906", // Biology
  "Q395", // Mathematics
  "Q7315", // Philosophy
  "Q8458", // Art
  "Q735", // Arts
  "Q11660", // Education
  "Q8275", // Crime
  "Q7163", // Politics
  "Q8134", // Economics
  "Q11023", // Chemistry
  "Q413", // Physics
  "Q7725", // Chemistry
  "Q11471", // Astronomy
  "Q7892", // Architecture
  "Q188451", // Sociology
  "Q36442", // Biology
  "Q21198", // Psychology
  "Q8366", // Literature
  "Q11424", // Film
  "Q638", // Music
  "Q349", // Sport
  "Q7889", // Video game
  "Q11016", // Computer science
  "Q9143", // Programming
  "Q80993", // Blockchain
  "Q12483", // JavaScript
  "Q2539", // Machine learning
  "Q9492", // Cloud computing
  "Q8513", // Democracy
  "Q7748", // World War II
  "Q362", // World War I
  "Q5292", // Peace
  "Q11025", // Engineering
  "Q131436", // Social media
  "Q309", // History
  "Q11042", // Climate change
  "Q7377", // Artificial intelligence
  "Q12483", // JavaScript
  "Q80993", // Blockchain
  "Q184843", // Environmental science
  "Q11660", // Education
  "Q11023", // Chemistry
  "Q395", // Mathematics
  "Q413", // Physics
  "Q7366", // Medicine
  "Q8072", // Human rights
  "Q9143", // Programming
  "Q121416", // Quantum mechanics
  "Q35120", // DNA
  "Q11190", // Religion
  "Q8458", // Art
  "Q188451", // Sociology
  "Q8366", // Literature
  "Q349", // Sport
  "Q11016", // Computer science
  "Q2539", // Machine learning
  "Q9492", // Cloud computing
  "Q131436", // Social media
  "Q184843", // Environmental science
  "Q7748", // World War II
  "Q362", // World War I
  "Q5292", // Peace
  "Q11025", // Engineering
  "Q849", // Christianity
  "Q432", // Islam
  "Q9559", // Democracy
  "Q8513", // Democracy
  "Q7163", // Politics
  "Q8134", // Economics
  "Q7725", // Chemistry
  "Q11471", // Astronomy
  "Q7892", // Architecture
  "Q735", // Arts
  "Q8275", // Crime
  "Q7315", // Philosophy
  "Q36906", // Biology
  "Q11660", // Education
  "Q8458", // Art
];

const qidMappings = {
  human: "Q5",
  "Albert Einstein": "Q7747",
  "Abraham Lincoln": "Q91",
  "William Shakespeare": "Q712",
  "United States": "Q30",
  France: "Q142",
  London: "Q84",
  "New York City": "Q60",
  Internet: "Q336",
  Computer: "Q7397",
  "Chemical element": "Q11344",
  Mathematics: "Q395",
  Film: "Q11424",
  Music: "Q638",
  "Video game": "Q7889",
  Netflix: "Q3305213",
  Economics: "Q8134",
  Psychology: "Q21198",
  Philosophy: "Q9418",
  Biology: "Q36442",
  Japan: "Q17",
  China: "Q148",
  India: "Q668",
  Argentina: "Q414",
  Germany: "Q183",
  Australia: "Q408",
  "United Kingdom": "Q145",
  City: "Q515",
  Planet: "Q373",
  Europe: "Q46",
  Asia: "Q48",
  Africa: "Q15",
  Ireland: "Q27",
  "Czech Republic": "Q213",
  Earth: "Q2",
  Universe: "Q405",
  "Artificial Intelligence": "Q7377",
  History: "Q309",
  Christianity: "Q849",
  Islam: "Q432",
  Democracy: "Q9559",
  "Human rights": "Q8072",
  "Climate change": "Q11042",
  DNA: "Q35120",
  Medicine: "Q7366",
  Religion: "Q11190",
  "Quantum mechanics": "Q121416",
  Art: "Q8458",
  Arts: "Q735",
  Education: "Q11660",
  Crime: "Q8275",
  Politics: "Q7163",
  Chemistry: "Q11023",
  Physics: "Q413",
  Astronomy: "Q11471",
  Architecture: "Q7892",
  Sociology: "Q188451",
  Literature: "Q8366",
  Sport: "Q349",
  "Computer science": "Q11016",
  Programming: "Q9143",
  Blockchain: "Q80993",
  JavaScript: "Q12483",
  "Machine learning": "Q2539",
  "Cloud computing": "Q9492",
  "World War II": "Q7748",
  "World War I": "Q362",
  Peace: "Q5292",
  Engineering: "Q11025",
  "Social media": "Q131436",
  "Environmental science": "Q184843",
} as const;

// Type for the mapping
type QidKey = keyof typeof qidMappings;
type QidValue = (typeof qidMappings)[QidKey];

export { qidMappings, type QidKey, type QidValue };
export { endpointUrl, sparqlQuery, popularQids };

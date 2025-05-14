export const createPublishedBookQuery = (publcationDate: number = 2020) => {
  return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbc: <http://dbpedia.org/resource/Category:>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?category ?categoryLabel (COUNT(DISTINCT ?book) AS ?numberOfBooksPublishedIn${publcationDate})
    WHERE {
    ?book rdf:type dbo:Book .
    ?book dbo:publicationDate ?publicationDate .

    FILTER (
        (DATATYPE(?publicationDate) = xsd:date && YEAR(?publicationDate) = ${publcationDate}) ||
        (DATATYPE(?publicationDate) = xsd:gYear && STR(?publicationDate) = "${publcationDate}") ||
        (STRSTARTS(STR(?publicationDate), "${publcationDate}") && (STRLEN(STR(?publicationDate)) = 4 || SUBSTR(STR(?publicationDate), 5, 1) = "-"))
    )

    ?book dct:subject ?category .
    FILTER STRSTARTS(STR(?category), STR(dbc:))

    ?category rdfs:label ?categoryLabel .
    FILTER(LANGMATCHES(LANG(?categoryLabel), "pl") || LANGMATCHES(LANG(?categoryLabel), "en"))
    }
    GROUP BY ?category ?categoryLabel
    ORDER BY DESC(?numberOfBooksPublishedIn${publcationDate})
`;
};

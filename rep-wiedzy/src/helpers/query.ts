export const createPublishedBookQuery = (publcationDate: number = 2020) => {
  return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbc: <http://dbpedia.org/resource/Category:>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?category ?categoryLabel (COUNT(DISTINCT ?book) AS ?bookData)
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
    ORDER BY DESC(?bookData)
`;
};

export const createBookListForCategoryQuery = (categoryUrl: string) => {
  return `
  PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  SELECT DISTINCT ?book ?bookLabel (GROUP_CONCAT(DISTINCT ?authorName; SEPARATOR=", ") AS ?authors) ?thumbnail
  WHERE {
    BIND(<${categoryUrl}> AS ?categoryUri)

    ?book rdf:type dbo:Book .
    ?book dct:subject ?categoryUri .

    ?book rdfs:label ?bookLabel .
    FILTER(LANGMATCHES(LANG(?bookLabel), "pl") || LANGMATCHES(LANG(?bookLabel), "en"))

    OPTIONAL {
      ?book dbo:author ?authorResource .
      ?authorResource rdfs:label ?authorName .
      FILTER(LANGMATCHES(LANG(?authorName), "pl") || LANGMATCHES(LANG(?authorName), "en"))
    }

    OPTIONAL {
      ?book dbo:thumbnail ?thumbnail .
    }
  }
  GROUP BY ?book ?bookLabel ?thumbnail
  ORDER BY ?bookLabel
  `;
};

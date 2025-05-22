// Typy dla danych wejściowych (na podstawie dostarczonego przykładu)
interface SparqlUriBinding {
  type: "uri";
  value: string;
}

interface SparqlLiteralBinding {
  type: "literal";
  "xml:lang": string; // W przykładzie zawsze 'en'
  value: string;
}

interface SparqlTypedLiteralBinding {
  type: "typed-literal";
  datatype: string;
  value: string;
}

interface InputItem {
  category: SparqlUriBinding;
  categoryLabel: SparqlLiteralBinding;
  bookData: SparqlTypedLiteralBinding;
}

// Typy dla danych wyjściowych
interface OutputNode {
  id: string;
  name: string;
  val: number;
}

interface OutputLink {
  source: string; // Odnosi się do OutputNode.id
  target: string; // Odnosi się do OutputNode.id
}

interface OutputGraph {
  nodes: OutputNode[];
  links: OutputLink[];
}

export function transformDataToGraph(data: any[]): any {
  // Tworzenie węzłów (nodes)
  // Każdy element z tablicy wejściowej jest mapowany na jeden węzeł.
  // - 'id' jest generowane sekwencyjnie (np. "id1", "id2", ...).
  // - 'name' pochodzi z 'categoryLabel.value'.
  // - 'val' pochodzi z 'bookData.value' (konwertowane na liczbę).
  const nodes: OutputNode[] = data.map((item, index) => {
    const nodeId = `id${index + 1}`; // Generowanie ID w formacie "id1", "id2", ...

    return {
      id: nodeId,
      name: item.categoryLabel.value,
      val: parseInt(item.bookData.value, 10), // Konwersja wartości 'bookData' na liczbę
    };
  });

  // Tworzenie połączeń (links)
  const links: OutputLink[] = [];

  // Logika tworzenia połączeń:
  // W dostarczonym przykładzie struktury wyjściowej widnieje przykładowe połączenie:
  // { "source": "id1", "target": "id2" }
  // Funkcja ta tworzy jedno połączenie między pierwszym a drugim wygenerowanym węzłem,
  // jeśli istnieje co najmniej dwa węzły. Jest to interpretacja mająca na celu
  // dopasowanie do przykładowej struktury wyjściowej.
  // Jeśli wymagana jest bardziej złożona lub specyficzna logika tworzenia połączeń
  // (np. na podstawie wspólnych właściwości węzłów, wartości 'val' itp.),
  // należałoby ją zaimplementować w tym miejscu.
  if (nodes.length >= 2) {
    // Zakładamy, że "id1" odpowiada nodes[0].id, a "id2" odpowiada nodes[1].id
    links.push({ source: nodes[0].id, target: nodes[1].id });
  }

  return {
    nodes,
    links,
  };
}

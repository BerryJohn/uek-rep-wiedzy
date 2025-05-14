export interface DBPediaQueryType {
  head: Head;
  results: Results;
}

export interface Head {
  link: any[];
  vars: string[];
}

export interface Results {
  distinct: boolean;
  ordered: boolean;
  bindings: Binding[];
}

export interface Binding {
  category: Category;
  categoryLabel: CategoryLabel;
  numberOfBooksPublishedIn2020: NumberOfBooksPublishedIn2020;
}

export interface Category {
  type: string;
  value: string;
}

export interface CategoryLabel {
  type: string;
  "xml:lang": string;
  value: string;
}

export interface NumberOfBooksPublishedIn2020 {
  type: string;
  datatype: string;
  value: string;
}

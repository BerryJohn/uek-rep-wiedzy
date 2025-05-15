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
  bookData: bookData; // xD
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

export interface bookData {
  type: string;
  datatype: string;
  value: string;
}

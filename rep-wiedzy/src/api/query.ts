import axios from "axios";
import type { Binding } from "./query.types";

const endpoint = "https://dbpedia.org/sparql";

export const getQuery = async (query: string): Promise<Binding[]> => {
  const uri = new URL(endpoint);

  uri.searchParams.append("default-graph-uri", "http://dbpedia.org");
  uri.searchParams.append("query", query);
  uri.searchParams.append("format", "application/sparql-results+json");
  uri.searchParams.append("timeout", "30000");
  uri.searchParams.append("signal_void", "on");
  uri.searchParams.append("signal_unconnected", "on");

  const res = await axios.get(uri.toString(), {
    headers: {
      Accept: "application/sparql-results+json",
    },
  });
  return res.data.results.bindings;
};

import { useState } from "react";
import "./App.css";
import { getQuery } from "./api/query";
import TopBar from "./components/TopBar";
import YearSlider from "./components/YearSlider";
import {
  createBookListForCategoryQuery,
  createPublishedBookQuery,
} from "./helpers/query";
import { debounce } from "./helpers/utils";
import type { Binding } from "./api/query.types";
import { generateGraphData, Graph } from "./components/Graph";

function App() {
  const [booksData, setBooksData] = useState<Binding[]>([]);

  const handleYearChange = debounce(async (year: number) => {
    const query = createPublishedBookQuery(year);

    const data = await getQuery(query);

    setBooksData(data);
  }, 1000);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-white to-blue-50">
      <TopBar />
      <main className="flex flex-col items-stretch justify-center flex-1 bg-white shadow-xl w-full border border-gray-200 px-6">
        <div className="text-center">
          {booksData?.length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[70vh] border-0 rounded-lg shadow-lg bg-white/50 backdrop-blur-md border-gray-200">
              <div className="w-full h-full">
                {/* Replace this with your actual Graph component */}
                <Graph books={booksData} />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">
                Welcome to <span className="text-blue-600">BookPol</span>
              </h2>
              <p className="text-gray-500 text-lg mb-6">
                Your knowledge repository for books
              </p>
            </>
          )}
          <div className="flex flex-col items-center gap-1 w-full flex-1">
            <label
              htmlFor="year-slider"
              className="font-semibold text-gray-700 text-lg "
            >
              Select publication year
            </label>
            <YearSlider handleYearChange={handleYearChange} />
          </div>
        </div>
      </main>
      <footer className="mt-auto py-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-gray-100 text-center text-sm shadow-inner border-t border-blue-900/20">
        &copy; 2025 UEK Kraków &mdash;{" "}
        <span className="font-semibold">Jan Bąk</span>,{" "}
        <span className="font-semibold">Jarosław Myjak</span>
      </footer>
    </div>
  );
}

export default App;

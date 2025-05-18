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
    <div
      style={{
        height: "100vh",
        backgroundColor: "green",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          id="threejs-container"
          style={{
            // backgroundColor: "black",
            width: "100%",
            flex: 1,
            maxHeight: "calc(100vh - 56px - 100px)",
            overflow: "scroll",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {booksData.length > 0 && (
            <Graph graphData={generateGraphData(booksData)} />
          )}
          {/* {booksData.map((book) => (
            <div
              key={book.category.value}
              style={{
                border: "1px solid white",
                padding: 10,
                margin: 5,
                borderRadius: 5,
              }}
            >
              <div>{book.categoryLabel.value}</div>
              <button
                onClick={() => {
                  const query = createBookListForCategoryQuery(
                    book.category.value
                  );
                  getQuery(query).then((data) => {
                    console.log(
                      "Books in category",
                      book.categoryLabel.value,
                      data
                    );
                  });
                }}
              >
                Show books
              </button>
            </div>
          ))} */}
        </div>

        <YearSlider handleYearChange={handleYearChange} />
      </div>
      <footer
        style={{
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          padding: 10,
          fontSize: 14,
        }}
      >
        &copy; 2025 UEK Kraków - Jan Bąk, Jarosław Myjak
      </footer>
    </div>
  );
}

export default App;

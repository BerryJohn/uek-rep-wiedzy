import "./App.css";
import { getQuery } from "./api/query";
import TopBar from "./components/TopBar";
import YearSlider from "./components/YearSlider";
import { createPublishedBookQuery } from "./helpers/query";
import { debounce } from "./helpers/utils";

function App() {
  const handleYearChange = debounce((year: number) => {
    const query = createPublishedBookQuery(year);

    getQuery(query);
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
          style={{ backgroundColor: "black", width: "100%", flex: 1 }}
        />
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

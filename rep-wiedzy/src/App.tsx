import { useRef, useState } from "react";
import "./App.css";
import { getQuery } from "./api/query";
import TopBar from "./components/TopBar";
import YearSlider from "./components/YearSlider";
import {
  createBookListForCategoryQuery,
  createPublishedBookQuery,
} from "./helpers/query";
import { debounce } from "./helpers/utils";
import type { Binding, Book } from "./api/query.types";
import { Graph } from "./components/Graph";
import BookListDialog from "./components/BookListDialog";
import Loader from "./components/Loader";
import Footer from "./components/Footer";

const App = () => {
  const [publishedBooksCategoryData, setPublishedBooksCategoryData] = useState<
    Binding[]
  >([]);
  const selectedCategory = useRef<string | null>(null);

  const [bookList, setBookList] = useState<Book[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);

  const handleYearChange = debounce(async (year: number) => {
    setIsLoadingCategories(true);
    const query = createPublishedBookQuery(year);
    const data = await getQuery<Binding>(query);
    setPublishedBooksCategoryData(data);
    setIsLoadingCategories(false);
  }, 1000);

  const handlePublishedBooksCategoryClick = async (
    category: string,
    categoryName: string
  ) => {
    setIsLoadingBooks(true);
    selectedCategory.current = categoryName;
    const query = createBookListForCategoryQuery(category);
    const data = await getQuery<Book>(query);
    setBookList(data);
    setIsDialogOpen(true);
    setIsLoadingBooks(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 via-white to-blue-50">
      <TopBar />
      <main className="flex flex-col items-stretch justify-center flex-1 bg-white shadow-xl w-full border border-gray-200 px-6">
        <div className="text-center">
          {isLoadingCategories ? (
            <Loader />
          ) : publishedBooksCategoryData?.length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[70vh] border-0 rounded-lg shadow-lg bg-white/50 backdrop-blur-md border-gray-200">
              <div className="w-full h-full">
                <Graph
                  publishedCategoriesData={publishedBooksCategoryData}
                  handlePublishedBooksCategoryClick={
                    handlePublishedBooksCategoryClick
                  }
                />
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
      <BookListDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`Books in "${selectedCategory.current}"`}
        books={bookList}
        loading={isLoadingBooks}
      />
      <Footer />
    </div>
  );
};

export default App;

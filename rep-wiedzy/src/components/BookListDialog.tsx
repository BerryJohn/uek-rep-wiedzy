import React from "react";
import type { Book } from "../api/query.types";
import Loader from "./Loader";

interface BookListDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  books?: Book[];
  loading?: boolean;
}

const BookListDialog: React.FC<BookListDialogProps> = ({
  open,
  onClose,
  title = "Book List",
  books = [],
  loading = false,
}) => {
  if (!open) return null;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{title}</h2>
        <div className="max-h-80 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {books?.map((book, id) => (
              <li
                key={`book-${id}-${book.bookLabel.type}`}
                className="flex items-center gap-4 py-3"
              >
                <img
                  src={`https://placehold.co/48x64?text=B`}
                  alt={book.bookLabel.value}
                  className="w-12 h-16 rounded shadow border border-gray-200 bg-gray-50 object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-800">
                    {book.bookLabel.value}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {book.authors.value || "Unknown Author"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookListDialog;

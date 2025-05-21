import React from "react";

const TopBar: React.FC = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-40 ">
      <h1 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
        <span className="inline-block w-6 h-6 bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-400 rounded mr-2 shadow-sm" />
        BookPol
      </h1>
    </header>
  );
};

export default TopBar;

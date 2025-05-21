import React, { useState } from "react";

const MIN_YEAR = 1950;
const MAX_YEAR = 2024;

const YearSlider = ({
  handleYearChange,
}: {
  handleYearChange(newYear: number): void;
}) => {
  const [year, setYear] = useState<number>(2025);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setYear(newYear);
    handleYearChange(newYear);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 font-medium">{MIN_YEAR}</span>
        <span className="text-base font-semibold text-blue-700">
          Year: {year}
        </span>
        <span className="text-sm text-gray-500 font-medium">{MAX_YEAR}</span>
      </div>
      <input
        type="range"
        min={MIN_YEAR}
        max={MAX_YEAR}
        step={1}
        value={year}
        onChange={handleChange}
        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600 transition"
      />
    </div>
  );
};

export default YearSlider;

import React, { useState } from "react";

const MIN_YEAR = 1950;
const MAX_YEAR = 2024;

const YearSlider = ({
  handleYearChange,
}: {
  handleYearChange(newYear: number): void;
}) => {
  const [year, setYear] = useState<number>(2024);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    setYear(newYear);
    handleYearChange(newYear);
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        margin: "40px auto",
        marginTop: 0,
        backgroundColor: "blue",
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 18 }}>
        Select Year: {year}
      </div>
      <div>
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={year}
          // defaultValue={year}
          onChange={handleChange}
          style={{ width: "100%" }}
          // onMouseUp={(e) => {
          //   // e.stopPropagation();
          //   // e.preventDefault();
          //   console.log("onMouseUp");
          // }}
        />
      </div>
    </div>
  );
};

export default YearSlider;

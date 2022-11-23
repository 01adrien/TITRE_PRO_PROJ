import React, { useState, useEffect } from "react";
import { getMenuItems } from "../../api";
import { Link } from "react-router-dom";

export default function DropdownMenu() {
  const width = "150";
  const [items, setItems] = useState({});
  const [dropdownStyle, setDropdownStyle] = useState(
    "dropdown inline-block z-10"
  );
  useEffect(() => {
    getMenuItems().then(setItems);
  }, []);
  return (
    <div id="dropdown" className={`${dropdownStyle}`}>
      <button
        onMouseEnter={() => setDropdownStyle("dropdown inline-block z-10")}
        className={`bg-main_color text-white font-semibold w-[150px] py-2 inline-flex justlfy-center`}
      >
        <svg
          className="pl-1 w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
        <span className="pl-3">Instruments</span>
      </button>
      <ul
        className={`dropdown-content cursor-pointer absolute hidden text-gray-700 w-[${width}px] bg-white  border border-slate-200`}
      >
        {items &&
          Object.keys(items).map((item) => {
            return (
              <li key={item} className="dropdown">
                <Link to={`/instrument-family/${item}`}>
                  <span
                    onClick={() => setDropdownStyle("")}
                    className="hover:bg-slate-100 cursor-pointer py-2 px-4 block whitespace-no-wrap border bg-white border-slate-200"
                  >
                    {item}
                  </span>
                </Link>
                <ul
                  className={`dropdown-content cursor-pointer absolute hidden bg-white text-gray-700 ml-[${width}px] -mt-10 w-[${width}px]`}
                >
                  {items[item].map((i) => {
                    return (
                      <li key={i}>
                        <Link to={`/instrument-type/${i}`}>
                          <span
                            onClick={() => setDropdownStyle("")}
                            className="hover:text-main_color cursor-pointer bg-white py-2  w-[200px] px-4 block whitespace-no-wrap border border-slate-200"
                          >
                            {i}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

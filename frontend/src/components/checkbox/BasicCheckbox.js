import React from 'react';

export default function BasicCheckbox({ label, style }) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          value=""
          className="w-3 h-3 focus:ring-0 cursor-pointer bg-gray-50 rounded border border-gray-300"
          required=""
        />
      </div>
      <label
        className={`${style} ml-2 text-sm text-gray-900 dark:text-gray-300`}
      >
        {label}
      </label>
    </div>
  );
}

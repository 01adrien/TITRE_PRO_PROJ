import React from 'react';

export default function SelectAddInstrument({
  label,
  data,
  type,
  value,
  setValue,
  disabled,
}) {
  const handleChange = (e) =>
    setValue((prev) => ({ ...prev, [type]: e.target.value }));

  return (
    <div className={`flex flex-col justify-center items-start`}>
      <label className="text-xs mb-1">{label}</label>
      <select
        onChange={handleChange}
        className={`rounded-md border-main_color focus:border-none ${
          disabled && 'opacity-30'
        }`}
        value={value}
        disabled={disabled}
      >
        <option value="">select..</option>
        {data &&
          data.map((d) => {
            return (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            );
          })}
      </select>
    </div>
  );
}
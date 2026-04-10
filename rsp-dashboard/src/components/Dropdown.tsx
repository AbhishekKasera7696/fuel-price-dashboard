interface Props {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

const Dropdown = ({ label, options, value, onChange }: Props) => {
  return (
    <div style={{ marginRight: "20px" }}>
      <label>{label}</label>
      <br />
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt, index) => (
          <option key={`${opt}-${index}`} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
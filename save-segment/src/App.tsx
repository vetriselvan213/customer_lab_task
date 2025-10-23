import { useState } from "react";
import "./App.css";

interface SchemaOption {
  label: string;
  value: string;
}

const schemaOptions: SchemaOption[] = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState<string[]>([]);
  const [currentSchema, setCurrentSchema] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setSegmentName("");
    setSelectedSchemas([]);
    setCurrentSchema("");
    setError("");
  };

  const handleSchemaChange = (index: number, value: string) => {
    const updated = [...selectedSchemas];
    updated[index] = value;
    setSelectedSchemas(updated);
    setError("");
  };

  const handleRemoveSchema = (index: number) => {
    const updated = [...selectedSchemas];
    updated.splice(index, 1);
    setSelectedSchemas(updated);
    setError("");
  };

  const handleAddSchema = () => {
    if (currentSchema && !selectedSchemas.includes(currentSchema)) {
      setSelectedSchemas([...selectedSchemas, currentSchema]);
      setCurrentSchema("");
      setError("");
    }
  };

  const handleSaveSegment = async () => {
    if (!segmentName.trim()) {
      setError("Segment name is required.");
      return;
    }
    if (selectedSchemas.length === 0) {
      setError("Please add at least one schema.");
      return;
    }

    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema) => {
        const option = schemaOptions.find((opt) => opt.value === schema);
        return { [schema]: option?.label || schema };
      }),
    };

    console.log("Payload:", payload);

    try {
      await fetch("http://localhost:4000/api/save-segment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Segment saved successfully!");
      setShowPopup(false);
      resetForm();
    } catch (error) {
      console.error("Error saving segment:", error);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    resetForm();
  };

  const availableOptions = schemaOptions.filter(
    (opt) => !selectedSchemas.includes(opt.value)
  );

  return (
    <div className="App">
      <button onClick={() => setShowPopup(true)}>Save segment</button>

  
      {showPopup && <div className="backdrop" onClick={handleCancel} />}

 
      <div className={`drawer right ${showPopup ? "open" : ""}`}>
        
        <div
          className="drawer-header"
          style={{
            background: "skyblue",
            display: "flex",
            alignItems: "center",
            padding:"20px 10px"
          }}
        >
          <h2 style={{ display: "flex", alignItems: "center", margin: 0, color:"white" }}>
            Saving Segment
          </h2>
        </div>


        <div className="drawer-content">
          <p>Enter the Name of the Segment</p>
          <input
            type="text"
            placeholder="Enter segment name"
            value={segmentName}
            onChange={(e) => {
              setSegmentName(e.target.value);
              if (error) setError("");
            }}
          />

          <p style={{ color: "black" }}>
            To save your segment, you need to add the schemas to build the
            query.
          </p>

          {selectedSchemas.map((schema, index) => (
            <div key={`${schema}-${index}`} className="schema-row">
              <select
                value={schema}
                onChange={(e) => handleSchemaChange(index, e.target.value)}
              >
                {schemaOptions
                  .filter(
                    (opt) =>
                      opt.value === schema ||
                      !selectedSchemas.includes(opt.value)
                  )
                  .map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveSchema(index)}
                aria-label="Remove schema"
                title="Remove schema"
              >
                −
              </button>
            </div>
          ))}

          <select
            value={currentSchema}
            onChange={(e) => setCurrentSchema(e.target.value)}
          >
            <option value="">Add schema to segment</option>
            {availableOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <p
            style={{
              color: "blue",
              borderBottom: "1px solid blue",
              width: "fit-content",
              cursor: currentSchema ? "pointer" : "not-allowed",
            }}
            className={`add-link ${!currentSchema ? "disabled" : ""}`}
            onClick={() => {
              if (currentSchema) handleAddSchema();
            }}
          >
            + Add new schema
          </p>

          {error && <p className="error">{error}</p>}
        </div>


        <div className="drawer-footer">
          <button
            style={{ backgroundColor: "green", color: "white" }}
            onClick={handleSaveSegment}
          >
            Save the segment
          </button>
          <button style={{color:"tomato"}} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default App;

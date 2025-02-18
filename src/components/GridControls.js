import React, { useState } from "react";
import { ControlsContainer, Label, Input, ColorSet, ColorInput, Button, SettingsHeader } from "./ThumbnailGrid.styled";

const presetAspectRatios = [
  { label: "16:9", value: 16/9 },
  { label: "4:3", value: 4/3 },
  { label: "Square", value: 1 },
  { label: "Custom", value: "custom" },
];

const GridControls = ({
  rows,
  setRows,
  columns,
  setColumns,
  gap,
  setGap,
  radius,
  setRadius,
  setColor,
  aspectRatio,
  setAspectRatio,
	onLoadIdentifiers,
	copiedIdentifier,
}) => {
  // Local state for the custom ratio and mode.
  const [customRatio, setCustomRatio] = useState(aspectRatio);
  // Determine initial mode: if aspectRatio exactly matches a preset, use "preset", otherwise "custom"
  const initialMode = presetAspectRatios.some(
    (p) => typeof p.value === "number" && Math.abs(p.value - aspectRatio) < 0.01
  )
    ? "preset"
    : "custom";
  const [aspectMode, setAspectMode] = useState(initialMode);

  const handleAspectChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setAspectMode("custom");
      // Keep the current customRatio; update aspectRatio to customRatio
      setAspectRatio(customRatio);
    } else {
      const ratio = Number(val);
      setAspectMode("preset");
      setAspectRatio(ratio);
      // Also update customRatio so that if user later switches to custom, the value matches
      setCustomRatio(ratio);
    }
  };

	// NEW local state for pasted identifiers.
  const [identifierList, setIdentifierList] = useState("");
	const handleLoadIdentifiers = () => {
    if (onLoadIdentifiers) {
      onLoadIdentifiers(identifierList);
    }
  };


  return (
    <ControlsContainer>
		<SettingsHeader>Settings</SettingsHeader>
      <Label>
        Rows:
        <Input
          type="number"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
        />
      </Label>
      <Label>
        Columns:
        <Input
          type="number"
          value={columns}
          onChange={(e) => setColumns(Number(e.target.value))}
        />
      </Label>
      <Label>
        Gap (px):
        <Input
          type="number"
          value={gap}
          onChange={(e) => setGap(Number(e.target.value))}
          step="8"
        />
      </Label>
      <Label>
        Border Radius (px):
        <Input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          step="1"
        />
      </Label>
			<Label>Aspect Ratio:</Label>
      <select onChange={handleAspectChange} value={aspectMode === "custom" ? "custom" : String(aspectRatio)}>
        {presetAspectRatios.map((preset) => (
          <option key={preset.label} value={preset.value}>
            {preset.label}
          </option>
        ))}
      </select>
      {aspectMode === "custom" && (
        <Input
          type="number"
          value={customRatio}
          onChange={(e) => {
            const num = Number(e.target.value);
            setCustomRatio(num);
            setAspectRatio(num);
          }}
          step="0.1"
          min="0.1"
          placeholder="Enter ratio (e.g., 1.5)"
        />
      )}
      <Label>Grid Color:</Label>
      <ColorSet>
        {["#101010", "#fffcef", "#e52600", "#ffff00", "#3814a5"].map((preset) => (
          <ColorInput
            key={preset}
            onClick={() => setColor(preset)}
            title={preset}
          />
        ))}
      </ColorSet>
			<Label>Copied Identifier:</Label>
      <textarea
				value={copiedIdentifier}
				readOnly
				style={{ width: "100%", height: "100px", resize: "none" }}
			/>
      <Label>Load Identifiers:</Label>
      <textarea
        value={identifierList}
        onChange={(e) => setIdentifierList(e.target.value)}
        placeholder="Paste one identifier per line"
        style={{ width: "100%", height: "100px", resize: "none" }}
      />
      <Button onClick={handleLoadIdentifiers}>Load Grid from Identifiers</Button>
    </ControlsContainer>
  );
};

export default GridControls;

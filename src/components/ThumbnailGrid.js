import React, { useState, useRef } from "react";
import { useThumbnails } from "../hooks/useThumbnails";
import { fetchFullRecordsByIds } from "../utils/airtableFull";
import { Container, GridContainer, SidebarContainer, ToggleButton, RefreshButton } from "./ThumbnailGrid.styled";
import GridControls from "./GridControls";
import GridItem from "./GridItem";

const ThumbnailGrid = ({recordIds}) => {
  const [rows, setRows] = useState(4);
  const [columns, setColumns] = useState(5);
  const [gap, setGap] = useState(4);
  const [radius, setRadius] = useState(4);
  const [color, setColor] = useState('#101010');
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [loadingCustom] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedIdentifier, setCopiedIdentifier] = useState("");
  const [customRecords, setCustomRecords] = useState(null);
  const requiredCount = rows * columns;
  const gridRef = useRef(null);
  const { thumbnails, loading, rerollThumbnail, rerollAll } = useThumbnails(requiredCount);

  // Handler for loading grid from pasted identifiers.
  const handleLoadIdentifiers = async (text) => {
    // Split the pasted text into an array (one per line)
    const idList = text.split("\n").map(str => str.trim()).filter(str => str !== "");
    // Fetch full records by the "Identifier" field.
    const records = await fetchFullRecordsByIds(idList);
    if (records.length === 0) {
      console.error("No records found for provided identifiers.");
      return;
    }
    // If there are fewer records than required, fill by cycling.
    let newGrid = [];
    for (let i = 0; i < requiredCount; i++) {
      newGrid.push(records[i % records.length]);
    }
    setCustomRecords(newGrid);
  };
  // Use customRecords if available; otherwise, use the hook's thumbnails.
  const gridData = customRecords ? customRecords : thumbnails;
  // const isCustom = Boolean(customRecords);

  // const finalThumbnails = recordIds ? customGridRecords : thumbnails;
  const finalLoading = recordIds ? loadingCustom : loading;

  if (finalLoading) return <p>Loading thumbnails...</p>;

  // Export grid function
  const exportGrid = async (format = "png") => {
    const html2canvas = (await import("html2canvas")).default;
    await html2canvas(gridRef.current, { useCORS: true }).then(canvas => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `grid.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, `image/${format}`);
    });
  };

  return (
    <Container>
      <SidebarContainer $isOpen={sidebarOpen}>
        {sidebarOpen && (
          <ToggleButton onClick={() => setSidebarOpen(false)}>
            Hide Controls
          </ToggleButton>
        )}
        <GridControls
          rows={rows}
          setRows={setRows}
          columns={columns}
          setColumns={setColumns}
          gap={gap}
          setGap={setGap}
          radius={radius}
          setRadius={setRadius}
          color={color}
          setColor={setColor}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onRerollAll={rerollAll}
          onLoadIdentifiers={handleLoadIdentifiers}
          copiedIdentifier={copiedIdentifier}
        />
      </SidebarContainer>
      {!sidebarOpen && (
        <ToggleButton
          title="Settings"
          onClick={() => setSidebarOpen(true)}
          style={{ position: "fixed", top: 20, right: 20, zIndex: 1100 }}
        >
          &#9776;
        </ToggleButton>
      )}
      <GridContainer
        ref={gridRef}
        $columns={columns}
        $gap={gap}
        $bgColor={color}
        $radius={radius}
        >
        {gridData.map((item, index) => (
          <GridItem
            key={item.id}
            $id={item.id}
            $imageUrl={item.imageUrl}
            $identifier={item.identifier}
            $columns={columns}
            $radius={radius}
            $orientation={item.orientation}
            aspectRatio={aspectRatio}
            onReroll={() => rerollThumbnail(index)}
            onCopy={(text) => setCopiedIdentifier(prev => prev ? prev + "\n" + text : text)}
            />
        ))}
      </GridContainer>
      <RefreshButton onClick={rerollAll}>Refresh All</RefreshButton>
      <RefreshButton onClick={() => exportGrid("jpeg")}>Export</RefreshButton>
    </Container>
  );
};

export default ThumbnailGrid;

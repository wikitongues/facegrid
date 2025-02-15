import React, { useState } from "react";
import { useThumbnails } from "../hooks/useThumbnails";
import { Container, GridContainer, SidebarContainer, ToggleButton } from "./ThumbnailGrid.styled";
import GridControls from "./GridControls";
import GridItem from "./GridItem";

const ThumbnailGrid = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(4);
  const [gap, setGap] = useState(4);
  const [radius, setRadius] = useState(4);
  const [color, setColor] = useState('#101010');
  const [aspectRatio, setAspectRatio] = useState(16/9); // default 16:9
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const requiredCount = rows * columns;
  const { thumbnails, loading, rerollThumbnail, rerollAll } = useThumbnails(requiredCount);

  if (loading) {
    return <p>Loading thumbnails...</p>;
  }

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
        />
      </SidebarContainer>
      {!sidebarOpen && (
        <ToggleButton
          onClick={() => setSidebarOpen(true)}
          style={{ position: "fixed", top: 20, right: 20, zIndex: 1100 }}
        >
          Show Controls
        </ToggleButton>
      )}
      <GridContainer
        $columns={columns}
        $gap={gap}
        $bgColor={color}
        $radius={radius}
        >
        {thumbnails.map((item, index) => (
          <GridItem
            key={item.id}
            $id={item.id}
            $imageUrl={item.imageUrl}
            $identifier={item.identifier}
            $columns={columns}
            $radius={radius}
            $orientation={item.orientation}
            aspectRatio={aspectRatio}  // Pass aspect ratio to GridItem
            onReroll={() => rerollThumbnail(index)} />
        ))}
      </GridContainer>
      <button onClick={rerollAll}>Next Page</button>
    </Container>
  );
};

export default ThumbnailGrid;

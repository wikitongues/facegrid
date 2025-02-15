import React from "react";
import ThumbnailGrid from "./components/ThumbnailGrid";

function App() {
  return (
    <ThumbnailGrid rows={5} columns={4} gap={5} gapColor="#101010" />
  );
}

export default App;

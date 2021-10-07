import React from "react";
import "./App.css";
import SplitPane from "react-split-pane";
import BlockCard from "./components/BlockCard"

function App() {
  return (
    <SplitPane split="vertical" defaultSize="33%">
        <BlockCard name={"Klaytn"}></BlockCard>
        <SplitPane split="vertical" defaultSize="50%">
          <BlockCard name={"Cosmos"}></BlockCard>
          <BlockCard name={"LINK"}></BlockCard>
        </SplitPane>
    </SplitPane>
  );
}

export default App;

import Fetch from "./Fetch";
import { initializeApp } from "firebase/app";
function App() {
  return (
    <>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1>Team Chetak</h1> <br />
        <p>Yaar tera chetak pe chaale, Tanney chaska Red-Ferrari ka</p>
        <h3>
          {" "}
          <u> Cold Supply Storage</u>
        </h3>
      </div>
      <Fetch />
    </>
  );
}

// const App = initializeApp(app);
export default App;

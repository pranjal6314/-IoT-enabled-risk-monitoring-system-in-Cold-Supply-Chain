import { getDatabase, ref, onValue } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
// import firebase from "firebase/compat/app";
import axios from "axios";

import "./fetch.css";
const firebaseConfig = {
  apiKey: "AIzaSyDMFI6eCzyQgJX06lgL53X1FvaFIHijpzQ",
  authDomain: "smart-cold-storage-controller.firebaseapp.com",
  databaseURL:
    "https://smart-cold-storage-controller-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-cold-storage-controller",
  storageBucket: "smart-cold-storage-controller.appspot.com",
  messagingSenderId: "133394667485",
  appId: "1:133394667485:web:07b601cf7c6911ce8e0834",
  measurementId: "G-BEP4PS71ED",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const source = axios.CancelToken.source();
function Fetch() {
  const [firebaseRealtimeData, setFirebaseRealtimeData] = useState(true);
  const [dataVal, setDataValue] = useState([]);
  const [realtimeData, setRealtimeData] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    goods: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataContainer = document.getElementsByClassName("data-container")[0];
    dataContainer.classList.toggle("hidden");

    // set setDataValue empty array
    setDataValue([]);
    fetch("http://localhost:4000/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFormData({
          from: "",
          to: "",
          goods: "",
        });
      })
      .catch((error) => console.log(error));
  };
  const handleDataChange = (snapshot) => {
    const data = snapshot.val();
    const newData = {
      humidity: data.humidity,
      temperature: data.temperature,
      gassensor: data.gas_sensor,
      timestamp: Date.now(),
    };
    setDataValue((prevData) => [...prevData, newData]);

    if (realtimeData) {
      axios
        .post("http://localhost:4000/makeathon", newData)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
    if (!firebaseRealtimeData) {
      // Stop fetching data from Firebase
      // firebase.database().ref().off();
    }
  };

  const handleRealtimeData = () => {
    setDataValue([]);

    setRealtimeData((prevState) => !prevState);
    setFirebaseRealtimeData((prevState) => !prevState);
    if (firebaseRealtimeData) {
      // Start fetching data from Firebase
      // firebase.database().ref().on("value", handleDataChange);
    }
    console.log(realtimeData);
    // if (!realtimeData) {
    //   axios
    //     .get("http://localhost:4000/realtimeData", {
    //       cancelToken: source.token,
    //     })
    //     .then((res) => {
    //       setDataValue((prevData) => [...prevData, res.data]);
    //     })
    //     .catch((err) => {
    //       if (axios.isCancel(err)) {
    //         console.log("Realtime data fetching cancelled");
    //       } else {
    //         console.log(err);
    //       }
    //     });
    // } else {
    //   source.cancel("Realtime data fetching cancelled");
    // }
  };
  useEffect(() => {
    const postsRef = ref(db, "/");
    const intervalId = setInterval(() => {
      onValue(postsRef, handleDataChange, (errorObject) => {
        console.log("The read failed: " + errorObject.name);
      });
    }, 3000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleFetchData = () => {
    axios
      .get("http://localhost:4000/getData")
      .then((res) => setDataValue(res.data))
      .catch((err) => console.log(err));
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <>
      <div className="container">
        <div
          className="form-container"
          style={{
            padding: "10px",
            alignContent: "center",
            gap: "38px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{ padding: "10px", alignContent: "center", gap: "38px" }}
            >
              <div>
                <label htmlFor="from">From</label>
                <input
                  type="text"
                  name="from"
                  placeholder="Chennai"
                  value={formData.from}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="to">To</label>
                <input
                  type="text"
                  name="to"
                  placeholder="Pune"
                  value={formData.to}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="goods">Good</label>
                <input
                  type="text"
                  name="goods"
                  placeholder="Banana"
                  value={formData.goods}
                  onChange={handleInputChange}
                />
              </div>
              <button style={{ margin: "5px" }}>Submit</button>
              <button>Good delivered</button>
            </div>
          </form>
        </div>
        <div className="data-container hidden" style={{ padding: "10px" }}>
          <h1>Fetching Data...</h1>
          <button onClick={handleRealtimeData} style={{ margin: "20px" }}>
            {realtimeData ? "Stop Realtime Data" : "Start Realtime Data"}
          </button>
          <button onClick={handleFetchData}>Fetch Data from Database</button>
          <table
            style={{
              marginLeft: "50px",
              border: "1px solid black",
              backgroundColor: "lightblue",
            }}
          >
            <thead>
              <tr>
                <th>Humidity</th>
                <th>Temperature</th>
                <th>Gas Sensor</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {dataVal.map((data, index) => (
                <tr key={index}>
                  <td>{data?.humidity ?? "---"}</td>
                  <td>{data?.temperature ?? "---"}</td>
                  <td>{data?.gas_sensor ?? "---"}</td>
                  <td>{new Date(data.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Fetch;

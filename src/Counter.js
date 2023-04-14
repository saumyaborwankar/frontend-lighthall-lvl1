import React, { useEffect, useState } from "react";
import axios from "axios";
const Counter = () => {
  const [tableData, setTableData] = useState([]);
  const [mainCount, setMainCount] = useState();
  const [ip, setIP] = useState("");

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    // console.log(res.data);
    setIP(res.data.ip);
  };
  const processItems = (data) => {
    let totalCount = 0;
    data.forEach((e) => {
      totalCount += e.count;
    });
    // console.log("jooo");
    setMainCount(totalCount);
    // console.log("maincount", mainCount);
    data.sort((a, b) => b.count - a.count);
    data.unshift({ name: "main", count: totalCount });
    setTableData(data);
  };

  async function incrementCounter() {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (res.status === 200) {
      const result = await res.json();
      const { city, country } = result;
      const location = city + " / " + country;
      const locationResult = await axios.post(
        "https://backend-lightall.herokuapp.com/setLocation",
        { location }
      );
      if (locationResult.status === 200) {
        const result = locationResult.data;
        const { message } = result;
        processItems(message);
      } else {
        alert("Uh oh, an error occurred");
      }
    } else {
      const location = "global";
      const locationResult = await axios.post(
        "https://backend-lightall.herokuapp.com/setLocation",
        { location }
      );
      if (locationResult.status === 200) {
        const result = locationResult.data;
        const { message } = result;
        processItems(message);
      } else {
        alert("Uh oh, an error occurred");
      }
    }
  }

  useEffect(() => {
    const fetchInitialData = () => {
      axios
        .get("https://backend-lightall.herokuapp.com/getTableData")
        .then((res) => {
          // console.log(res.data.message);
          const listItems = res.data.message.map((item) => {
            return { name: item.name, count: item.count };
          });
          processItems(listItems);
        });
    };

    fetchInitialData();
    getData();
  }, []);

  return (
    <div>
      <div>{mainCount}</div>
      <button onClick={incrementCounter}>Counter</button>

      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => {
            if (row.name === "main") {
              return (
                <tr key={"main"}>
                  <td>
                    <i>Total Clicks</i>
                  </td>
                  <td>{row.count}</td>
                </tr>
              );
            }
            return (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        The backend is hosted on Heroku and frontend is hosted on Netlify.
        Adding up the latency between these two servers along with the location
        api that I have used there might be some delay in the registering of the
        clicks in far away locations.
      </p>
    </div>
  );
};
export default Counter;

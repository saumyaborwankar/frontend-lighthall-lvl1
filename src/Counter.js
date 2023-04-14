import React, { useEffect, useState } from "react";
import axios from "axios";
const Counter = () => {
  const [tableData, setTableData] = useState([]);

  const processItems = (data) => {
    let totalCount = 0;
    data.forEach((e) => {
      totalCount += e.count;
    });
    data.push({ name: "main", count: totalCount });
    data.sort((a, b) => b.count - a.count);
    setTableData(data);
  };

  async function incrementCounter() {
    const res = await fetch("http://ip-api.com/json/?fields=61439");
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
          console.log(res.data.message);
          const listItems = res.data.message.map((item) => {
            return { name: item.name, count: item.count };
          });
          processItems(listItems);
        });
    };

    fetchInitialData();
  }, []);

  return (
    <div>
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
    </div>
  );
};
export default Counter;

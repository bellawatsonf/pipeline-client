import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesChart = (props) => {
  let initialState = {
    page: 0,
    size: 10,
    totalPage: 0,
    nodes: [],
  };
  const [stateField, setStateField] = useState(initialState);
  // let [datanominal, setData] = useState([]);
  const fetchPipeline = (params) => {
    axios({
      method: "get",
      url: `https://server-pipeline.herokuapp.com/pipeline-dashboard?page=${params.page}&size=100`,
      // levelUser === "admin" || levelUser === "super admin" ? linkAdmin : link,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.listData, "respons");
        setStateField((prevState) => {
          return {
            ...prevState,
            nodes: res.data.listData,
          };
        });
      })
      .catch((e) => {
        console.log(e, "error pipeline");

        // Swal.fire({
        //   icon: "error",
        //   text: e.response.data.message,
        // });
      });
  };

  useEffect(() => {
    fetchPipeline({
      size: stateField.size,
      page: stateField.page,
    });
    // fetchPipeline();
  }, []);

  console.log(stateField, "dtate");
  // console.log(props.stateField.nodes, "dataprops sales");
  console.log(datanominal, "datanominal");

  let datanominal = [];
  stateField.nodes.map((el) => {
    console.log(el, "datael");
    datanominal.push(el.total);
  });

  const chartoptions = {
    series: [
      {
        name: "Nominal Cair",
        data: datanominal,
      },
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.1)",
      },

      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Des",
        ],
      },
    },
  };
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report Per User
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        />
      </CardBody>
    </Card>
  );
};

export default SalesChart;

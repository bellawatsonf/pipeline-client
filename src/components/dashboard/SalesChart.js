import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormatRupiah } from "../helper/formatRupiah";

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
      url: `https://server-pipeline.herokuapp.com/pipeline-dashboardperuser?page=${params.page}&size=100`,
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
            nodes: res.data,
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
  // console.log(datanominal, "datanominal");

  let datanominal = [];
  let databulan = [];
  // let bulan
  stateField.nodes.map((el) => {
    let cekbln = el?.production_to_month.split("-");
    let namabulan = "";
    if (cekbln[1] === "01") {
      namabulan = "Jan";
    } else if (cekbln[1] === "02") {
      namabulan = "Feb";
    } else if (cekbln[1] === "03") {
      namabulan = "March";
    } else if (cekbln[1] === "04") {
      namabulan = "April";
    } else if (cekbln[1] === "05") {
      namabulan = "May";
    } else if (cekbln[1] === "06") {
      namabulan = "Juny";
    } else if (cekbln[1] === "07") {
      namabulan = "July";
    } else if (cekbln[1] === "08") {
      namabulan = "August";
    } else if (cekbln[1] === "09") {
      namabulan = "Sept";
    } else if (cekbln[1] === "10") {
      namabulan = "Oct";
    } else if (cekbln[1] === "11") {
      namabulan = "Nov";
    } else if (cekbln[1] === "12") {
      namabulan = "Dec";
    }
    console.log(cekbln[0], new Date().getFullYear().toString(), "datael");
    if (cekbln[0] === new Date().getFullYear().toString()) {
      console.log(FormatRupiah(el?.total), "total");
      let uangrupiah = FormatRupiah(el?.total);
      console.log(uangrupiah, "totallll");
      datanominal.push(el?.total);
      databulan.push(namabulan);
    }
    // datanominal.push({
    //   nama: namabulan,
    //   total: el.total,
    // });
  });
  console.log(datanominal, "datanominal");
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
        categories:
          // [
          //   "Jan",
          //   "Feb",
          //   "March",
          //   "April",
          //   "May",
          //   "June",
          //   "July",
          //   "Aug",
          //   "Sep",
          //   "Oct",
          //   "Nov",
          //   "Des",
          // ],
          databulan,
      },
    },
  };
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report
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

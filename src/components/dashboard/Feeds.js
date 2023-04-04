import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
  Button,
} from "reactstrap";
import { FormatRupiah } from "../helper/formatRupiah";

const FeedData = [
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    color: "primary",
    date: "6 minute ago",
    id: 1,
  },
  {
    title: "New user registered.",
    icon: "bi bi-person",
    color: "info",
    date: "6 minute ago",
    id: 2,
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    color: "danger",
    date: "6 minute ago",
    id: 3,
  },
  {
    title: "New order received.",
    icon: "bi bi-bag-check",
    color: "success",
    date: "6 minute ago",
    id: 4,
  },
  {
    title: "Cras justo odio",
    icon: "bi bi-bell",
    color: "dark",
    date: "6 minute ago",
    id: 5,
  },
  {
    title: "Server #1 overloaded.",
    icon: "bi bi-hdd",
    color: "warning",
    date: "6 minute ago",
    id: 6,
  },
];

const Feeds = (props) => {
  let initialState = {
    page: 0,
    size: 10,
    totalPage: 0,
    nodes: [],
  };
  const [stateField, setStateField] = useState(initialState);
  const [nilaitotal, settotal] = useState(0);
  const [nilaitotalcb2, settotalcb2] = useState(0);
  const [nilaitotalcb3, settotalcb3] = useState(0);
  const [nilaitotalrcb, settotalrcb] = useState(0);

  let levelUser = "";
  if (typeof window !== "undefined") {
    // Perform localStorage action
    levelUser = localStorage.getItem("level");
  }
  let datacards = [
    {
      initial_group: "CB 1",
      total: nilaitotal,
    },
    {
      initial_group: "CB 2",
      total: nilaitotalcb2,
    },
    {
      initial_group: "CB 3",
      total: nilaitotalcb3,
    },
    {
      initial_group: "RCB",
      total: nilaitotalrcb,
    },
  ];
  const fetchPipeline = (params) => {
    console.log(params, "resmasukfetch");
    let link = "";
    if (params.search !== undefined) {
      link = `http://localhost:3000/pipeline-user?page=${params.page}&size=100&nama_nasabah=${params.search}`;
    } else {
      link = `http://localhost:3000/pipeline-user?page=${params.page}&size=100`;
    }

    let linkAdmin = "";
    if (params.search !== undefined) {
      linkAdmin = `http://localhost:3000/pipeline?page=${params.page}&size=100&nama_nasabah=${params.search}`;
    } else {
      linkAdmin = `http://localhost:3000/pipeline?page=${params.page}&size=100`;
    }

    axios({
      method: "get",
      url: `http://localhost:3000/pipeline?page=${
        params.page
      }&size=100&filter_tahun=${new Date()
        .getFullYear()
        .toString()}&waktu_awal=all`,
      // levelUser === "admin" || levelUser === "super admin" ? linkAdmin : link,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.listData, "respontts");
        if (res.data.listData.length > 0 && res.data.listData !== undefined) {
          setStateField((prevState) => {
            return {
              ...prevState,
              nodes: res.data.listData,
            };
          });
        }
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

  console.log(stateField.nodes, "repondt");

  return (
    <Card>
      <CardBody style={{ maxHeight: "485px", overflow: "scroll" }}>
        <CardTitle tag="h5">Sector</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Nominal Cair
        </CardSubtitle>
        <ListGroup flush className="mt-4">
          {stateField.nodes
            .sort((a, b) => b.nominal_cair - a.nominal_cair)
            .map((feed) => (
              <ListGroupItem
                key={feed.id}
                action
                href="/"
                tag="a"
                className="d-flex align-items-center p-3 border-0"
              >
                {/* <Button
                className="rounded-circle me-3"
                size="sm"
                color={feed.color}
              >
                <i className={feed.icon} />
              </Button> */}
                {feed.Sector.nama_sector}
                <small className="ms-auto text-muted text-small">
                  Rp.{FormatRupiah(feed.nominal_cair)},00
                </small>
              </ListGroupItem>
            ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

export default Feeds;

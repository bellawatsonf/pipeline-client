import Head from "next/head";
import { Col, Row } from "reactstrap";
import SalesChart from "../../components/dashboard/SalesChart";
import Feeds from "../../components/dashboard/Feeds";
import ProjectTables from "../../components/dashboard/ProjectTable";
import TopCards from "../../components/dashboard/TopCards";
import Blog from "../../components/dashboard/Blog";
import bg1 from "../../assets/images/bg/bg1.jpg";
import bg2 from "../../assets/images/bg/bg2.jpg";
import bg3 from "../../assets/images/bg/bg3.jpg";
import bg4 from "../../assets/images/bg/bg4.jpg";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormatRupiah } from "../../components/helper/formatRupiah";

const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

export default function Home() {
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
      link = `https://server-pipeline.herokuapp.com/pipeline-user?page=${params.page}&size=100&nama_nasabah=${params.search}`;
    } else {
      link = `https://server-pipeline.herokuapp.com/pipeline-user?page=${params.page}&size=100`;
    }

    let linkAdmin = "";
    if (params.search !== undefined) {
      linkAdmin = `https://server-pipeline.herokuapp.com/pipeline?page=${params.page}&size=100&nama_nasabah=${params.search}`;
    } else {
      linkAdmin = `https://server-pipeline.herokuapp.com/pipeline?page=${params.page}&size=100`;
    }

    axios({
      method: "get",
      url: `https://server-pipeline.herokuapp.com/pipeline-dashboardperuser?page=${params.page}&size=100`,
      // levelUser === "admin" || levelUser === "super admin" ? linkAdmin : link,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.listData, "respontt");
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

  async function fetchpipelinegroup() {
    axios({
      method: "get",
      url: `https://server-pipeline.herokuapp.com/pipeline-group`,
      // levelUser === "admin" || levelUser === "super admin" ? linkAdmin : link,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data, "respondst");
        res.data.map((el) => {
          if (el.initial_group === "CB 1") {
            settotal(el.total);
          } else if (el.initial_group === "CB 2") {
            settotalcb2(el.total);
          } else if (el.initial_group === "CB 3") {
            settotalcb3(el.total);
          } else if (el.initial_group === "RCB") {
            settotalrcb(el.total);
          }
        });
      })

      .catch((e) => {
        console.log(e, "error pipeline");
      });
  }

  useEffect(() => {
    fetchpipelinegroup();
  }, []);

  console.log(datacards, "datass");
  return (
    <div>
      <Head>
        <title>Pipeline Management</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {/***Top Cards***/}
        <Row>
          {datacards.map((el, i) => (
            <Col sm="6" lg="3" key={i}>
              <TopCards
                bg="bg-light-success text-success"
                title="Profit"
                subtitle={el.initial_group}
                earning={`Rp.${FormatRupiah(el.total)},00`}
                icon="bi bi-wallet"
              />
            </Col>
          ))}
          {/* <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-danger text-danger"
              title="Refunds"
              subtitle="CB 2"
              earning="$1k"
              icon="bi bi-coin"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-warning text-warning"
              title="New Project"
              subtitle="Yearly Project"
              earning="456"
              icon="bi bi-basket3"
            />
          </Col>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-info text-into"
              title="Sales"
              subtitle="Weekly Sales"
              earning="210"
              icon="bi bi-bag"
            />
          </Col> */}
        </Row>
        {/***Sales & Feed***/}
        <Row>
          <Col sm="12" lg="6" xl="7" xxl="8">
            <SalesChart stateField={stateField} />
          </Col>
          <Col sm="12" lg="6" xl="5" xxl="4">
            <Feeds />
          </Col>
        </Row>
        {/***Table ***/}
        <Row>
          <Col lg="12" sm="12">
            <ProjectTables />
          </Col>
        </Row>
        {/***Blog Cards***/}
        {/* <Row>
          {BlogData.map((blg) => (
            <Col sm="6" lg="6" xl="3" key={blg.title}>
              <Blog
                image={blg.image}
                title={blg.title}
                subtitle={blg.subtitle}
                text={blg.description}
                color={blg.btnbg}
              />
            </Col>
          ))}
        </Row> */}
      </div>
    </div>
  );
}

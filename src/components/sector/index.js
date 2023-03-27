import { Button, Typography } from "@mui/material";
import styleSector from "./sector.module.css";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";
import React, { useState, useEffect } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/material-ui";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ModalAdd from "./modal-add";
import Swal from "sweetalert2";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/router";

import { LoadingScreen } from "../loading";

export default function SectorComponent() {
  let levelUser = "";
  if (typeof window !== "undefined") {
    // Perform localStorage action
    levelUser = localStorage.getItem("level");
  }
  let router = useRouter();
  let initialState = {
    page: 0,
    size: 10,
    nodes: [],
  };
  const [stateField, setStateField] = useState(initialState);
  // const [data, setData] = useState({ nodes: [] });
  const [open, setOpen] = React.useState(false);
  let [id, setId] = useState("");
  let [statusForm, setStatusForm] = useState("add");
  const [isLoading, setLoading] = useState(false);

  const handleClickOpen = (params, x) => {
    setStatusForm(params);
    setOpen(true);
    setId(x);
  };

  const handleClose = (params, x) => {
    setOpen(false);
  };
  // const materialTheme = getTheme(DEFAULT_OPTIONS);
  const theme = useTheme({
    Table: `
    background:#35363b;
    color:white !important;
    `,

    BaseRow: `
    font-size: 14px;
    color:white
  `,
    HeaderRow: `
    background-color: #eaf5fd;
  `,

    Cell: `background:white !important;
    color: black !important
    `,
    // Cell(hover): `background:grey !important;
    // color: white !important
    // `,
  });

  const sort = useSort(
    stateField,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        margin: "0px",
        iconDefault: <UnfoldMoreIcon fontSize="small" />,
        iconUp: <KeyboardArrowUpIcon fontSize="small" />,
        iconDown: <KeyboardArrowDownIcon fontSize="small" />,
      },
      sortFns: {
        nama_sector: (array) =>
          array.sort((a, b) => a.nama_sector.localeCompare(b.nama_sector)),
      },
    }
  );
  function onSortChange(action, state) {
    console.log(action, state);
  }

  const pagination = usePagination(stateField, {
    state: {
      page: stateField.page,
      size: stateField.size,
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
    console.log(action, state, "paginationstate");
  }

  const fetchSektor = (params) => {
    console.log("resmasukfetch");
    setLoading(true);
    axios({
      method: "get",
      url: `https://server-pipeline.herokuapp.com/sektor?page=${params.page}&size=100`,

      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "respon");
        setLoading(false);
        setStateField((prevState) => {
          return {
            ...prevState,
            nodes: res.data.tutorials,
          };
        });
      })
      .catch((e) => {
        console.log(e, "error");
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        }).then(() => {
          if (e.response.data.message === "Please Login First") {
            // router.push("/login");
            router.push("/");
          }
        });
      });
  };

  function prosesDelete(id) {
    // setLoading(true);
    axios({
      method: "delete",
      url: `https://server-pipeline.herokuapp.com/delete-sektor/${id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "response");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "delete sector successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          // setLoading(false);
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            fetchSektor({ size: stateField.size, page: stateField.page });
          }
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  }
  console.log(stateField.nodes, "datasektor");
  let no = 1;

  useEffect(() => {
    fetchSektor({ size: stateField.size, page: stateField.page });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <div
        style={{
          margin: "10px 0px 20px 0px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => handleClickOpen("add", null)}
        >
          Add Sector <AddIcon sx={{ paddingLeft: "5px" }} />
        </Button>
      </div>
      <div
        className="bg-white"
        // style={{ paddingLeft: "20px", paddingRight: "20px" }}
      >
        <Table
          data={stateField}
          theme={theme}
          sort={sort}
          pagination={pagination}
        >
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Number</HeaderCell>
                  <HeaderCellSort sortKey="nama_sector">
                    Sector Name
                  </HeaderCellSort>
                  <HeaderCell></HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList?.map((item, index) => (
                  <Row key={index}>
                    <Cell>{no++}</Cell>
                    <Cell>{item.nama_sector.toLowerCase()}</Cell>

                    <Cell>
                      <BorderColorIcon
                        onClick={() => handleClickOpen("edit", item.id)}
                      />
                      <DeleteOutlineIcon
                        onClick={() => prosesDelete(item.id)}
                      />
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* <span>
            <span>
              Total Pages: {pagination.state.getTotalPages(stateField.nodes)}
            </span>

            {console.log(pagination, "pagination")}
          </span> */}

          {/* <span> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              margin: "50px 50px",
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                marginTop: "8px",
                marginRight: "5px",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            />
            {pagination.state.getPages(stateField.nodes).map((_, index) => (
              <div
                variant="contained"
                color="success"
                key={index}
                type="button"
                style={{
                  fontWeight:
                    pagination.state.page === index ? "bold" : "normal",
                  margin: "4px 4px 4px 4px",
                  background: "#35363b",
                  justifyContent: "center",
                  width: "40px",
                  borderRadius: "20px",
                  textAlign: "center",
                  color: "white",
                }}
                onClick={() => pagination.fns.onSetPage(index)}
              >
                {index + 1}
              </div>
            ))}
            {/* <NavigateNextIcon sx={{ marginTop: "10px", marginLeft: "10px" }} /> */}
            <ArrowForwardIosIcon
              sx={{
                marginTop: "8px",
                marginLeft: "5px",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            />
          </div>
          {/* </span> */}
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent
            sx={{
              background: "#eef5f9",
              width: "500px",
              height: "100%",
              paddingBottom: "40px",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                fontFamily: "fangsong",
                paddingBottom: "10px",
              }}
            >
              {statusForm === "add" ? "Form Add Sector" : "Form Edit Sector"}
            </Typography>
            <ModalAdd
              fetchSektor={() =>
                fetchSektor({ size: stateField.size, page: stateField.page })
              }
              setOpen={setOpen}
              statusForm={statusForm}
              id={id}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

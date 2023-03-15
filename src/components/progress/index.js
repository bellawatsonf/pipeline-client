import { Button, Typography } from "@mui/material";
import styleProgress from "./progress.module.css";
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
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ModalAdd from "./modal-add";
import Swal from "sweetalert2";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { LoadingScreen } from "../loading";
// import { Loading } from "../loading";

export default function ProgressComponent() {
  let initialState = {
    page: 0,
    size: 10,
    nodes: [],
  };
  const [stateField, setStateField] = useState(initialState);
  const [data, setData] = useState({ nodes: [] });
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
  const theme = useTheme([
    getTheme(),
    {
      Table: `
            --data-table-library_grid-template-columns:  30% repeat(2, minmax(0, 1fr)) 25% 100px;
          `,
      HeaderRow: `th css-1nayq86-HEADER_CELL_CONTAINER_STYLE-HeaderCell: blue`,
    },
  ]);

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
        nama_progress: (array) =>
          array.sort((a, b) => a.nama_progress.localeCompare(b.nama_progress)),
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

  const fetchProgress = (params) => {
    console.log("resmasukfetch");
    setLoading(true);
    axios({
      method: "get",
      url: `http://server-pipeline.herokuapp.com/progress?page=${params.page}&size=100`,

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
            nodes: res.data.listData,
          };
        });
      })
      .catch((e) => {
        console.log(e, "error progress");

        // Swal.fire({
        //   icon: "error",
        //   text: e.response.data.message,
        // });
      });
  };

  function prosesDelete(id) {
    axios({
      method: "delete",
      url: `http://server-pipeline.herokuapp.com/delete-progress/${id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "response");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "delete progress successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            fetchProgress({ size: stateField.size, page: stateField.page });
          }
        });
      })
      .catch((e) => {
        console.log(e, "error progress");
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  }
  console.log(data, "dataprogress");
  let no = 1;

  useEffect(() => {
    fetchProgress({
      size: stateField.size,
      page: stateField.page,
    });
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
          Add progress <AddIcon sx={{ paddingLeft: "5px" }} />
        </Button>
      </div>
      <div className="container bg-white">
        <Table
          data={stateField}
          theme={"theme"}
          sort={sort}
          pagination={pagination}
        >
          {(tableList) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Number</HeaderCell>
                  <HeaderCellSort sortKey="nama_progress">
                    Progress Name
                  </HeaderCellSort>
                  <HeaderCell></HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList?.map((item, index) => (
                  <Row key={index}>
                    <Cell>{no++}</Cell>
                    <Cell>{item.nama_progress.toLowerCase()}</Cell>

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
              sx={{ marginTop: "10px", marginRight: "10px" }}
            />
            {pagination.state.getPages(stateField.nodes).map((_, index) => (
              <Button
                variant="contained"
                color="success"
                key={index}
                type="button"
                sx={{
                  fontWeight:
                    pagination.state.page === index ? "bold" : "normal",
                  margin: "2px",

                  justifyContent: "center",
                  borderRadius: "40px",
                }}
                onClick={() => pagination.fns.onSetPage(index)}
              >
                {index + 1}
              </Button>
            ))}
            {/* <NavigateNextIcon sx={{ marginTop: "10px", marginLeft: "10px" }} /> */}
            <ArrowForwardIosIcon
              sx={{ marginTop: "10px", marginLeft: "10px" }}
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
              {statusForm === "add"
                ? "Form Add progress"
                : "Form Edit progress"}
            </Typography>
            <ModalAdd
              fetchProgress={() =>
                fetchProgress({ size: stateField.size, page: stateField.page })
              }
              setOpen={setOpen}
              statusForm={statusForm}
              id={id}
              dataProgress={stateField.nodes}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

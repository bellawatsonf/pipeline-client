import { Button, TextField, Typography } from "@mui/material";
import stylePegawai from "./pegawai.module.css";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { makeStyles } from "@material-ui/core/styles";
import { LoadingScreen } from "../loading";
const useStyles = makeStyles({
  "& .MuiInputBase-input-MuiOutlinedInput-input": {
    borderRadius: 12,
    backgroundColor: "blue",
  },
});

export default function PegawaiComponent() {
  const classes = useStyles();
  let initialState = {
    page: 0,
    size: 10,
    totalPage: 0,

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
        nip: (array) => array.sort((a, b) => a.nip.localeCompare(b.nip)),
        nama_pegawai: (array) =>
          array.sort((a, b) => a.nama_pegawai.localeCompare(b.nama_pegawai)),
        posisi: (array) =>
          array.sort((a, b) => a.posisi.localeCompare(b.posisi)),
        lokasi: (array) =>
          array.sort((a, b) => a.lokasi.localeCompare(b.lokasi)),
        level: (array) => array.sort((a, b) => a.level.localeCompare(b.level)),
        group_id: (array) =>
          array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
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

  const fetchPegawai = (params) => {
    setLoading(true);
    console.log("resmasukfetch");
    axios({
      method: "get",
      url: `http://localhost:3000/pegawai?page=${params.page}&size=100`,

      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "respon");
        // setData(() => {
        //   return {
        //     nodes: res.data.listData,
        //   };
        // });
        setLoading(false);
        setStateField((prevState) => {
          return {
            ...prevState,
            nodes: res.data.listData,
            totalPage: res.data.totalPages,
          };
        });
      })
      .catch((e) => {
        console.log(e, "error Pegawai");

        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  };

  function prosesDelete(id) {
    axios({
      method: "delete",
      url: `http://localhost:3000/delete-pegawai/${id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "response");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "delete pegawai successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            fetchPegawai({ page: stateField.page, size: stateField.size });
          }
        });
      })
      .catch((e) => {
        console.log(e, "error Pegawai");
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  }
  // console.log(data.totalPages, "dataPegawai");
  let no = 1;

  useEffect(() => {
    fetchPegawai({
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
          Add Pegawai <AddIcon sx={{ paddingLeft: "5px" }} />
        </Button>
      </div>
      <div className="container bg-white">
        {/* <TextField
          id="outlined-basic"
          label="search"
          variant="outlined"
          sx={{ margin: "20px 0px 20px 0px" }}
        /> */}

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
                  <HeaderCellSort sortKey="nip">NIP</HeaderCellSort>
                  <HeaderCellSort sortKey="nama_pegawai">
                    User Name
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="posisi">Occupation</HeaderCellSort>
                  <HeaderCellSort sortKey="lokasi">Location</HeaderCellSort>
                  <HeaderCellSort sortKey="group_id">Group</HeaderCellSort>
                  <HeaderCellSort sortKey="level">Level</HeaderCellSort>
                  <HeaderCell></HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList
                  // ?.filter((el) => el.level !== "super admin")
                  .map((item, index) => (
                    <Row key={index}>
                      <Cell>{item.nip}</Cell>
                      <Cell>{item.nama_pegawai.toLowerCase()}</Cell>
                      <Cell>{item.posisi.toLowerCase()}</Cell>
                      <Cell>{item.lokasi.toLowerCase()}</Cell>
                      <Cell>{item.Group.nama_group.toLowerCase()}</Cell>
                      <Cell>{item.level.toLowerCase()}</Cell>

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
              // paddingBottom: "40px",
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
              {statusForm === "add" ? "Form Add User" : "Form Edit User"}
            </Typography>
            <ModalAdd
              fetchPegawai={() =>
                fetchPegawai({ page: stateField.page, size: stateField.size })
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

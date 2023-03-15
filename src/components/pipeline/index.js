import { Button, Typography, TextField } from "@mui/material";
import stylepipeline from "./pipeline.module.css";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
  useCustom,
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
import { toString } from "../helper/formatDate";
import { LoadingScreen } from "../loading";
import { useRouter } from "next/router";
import { Formik } from "formik";
// import { Loading } from "../loading";

export default function PipelineComponent() {
  let initialState = {
    page: 0,
    size: 10,
    totalPage: 0,

    nodes: [],
    dataAfterArchive: [],
  };
  const [stateField, setStateField] = useState(initialState);
  // const [data, setData] = useState({ nodes: [] });
  const [open, setOpen] = React.useState(false);
  let [id, setId] = useState("");
  let [statusForm, setStatusForm] = useState("add");
  const [isLoading, setLoading] = useState(false);
  let router = useRouter();
  const [search, setSearch] = useState("");
  let levelUser = "";
  if (typeof window !== "undefined") {
    // Perform localStorage action
    levelUser = localStorage.getItem("level");
  }

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
        nama_nasabah: (array) =>
          array.sort((a, b) => a.nama_nasabah.localeCompare(b.nama_nasabah)),
        limit: (array) => array.sort((a, b) => a.limit.localeCompare(b.limit)),
        id_progress: (array) =>
          array.sort((a, b) => a.id_progress.localeCompare(b.id_progress)),
        tgl_RKP_B: (array) =>
          array.sort((a, b) => a.tgl_RKP_B.localeCompare(b.tgl_RKP_B)),
        tgl_RKP_A: (array) =>
          array.sort((a, b) => a.tgl_RKP_A.localeCompare(b.tgl_RKP_A)),
        tgl_cair: (array) =>
          array.sort((a, b) => a.tgl_cair.localeCompare(b.tgl_cair)),
        tgl_proyeksi_cair_rpm: (array) =>
          array.sort((a, b) =>
            a.tgl_proyeksi_cair_rpm.localeCompare(b.tgl_proyeksi_cair_rpm)
          ),
        id_pegawai: (array) =>
          array.sort((a, b) => a.id_pegawai.localeCompare(b.id_pegawai)),
        id_pengajuan: (array) =>
          array.sort((a, b) => a.id_pengajuan.localeCompare(b.id_pengajuan)),
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

  const handleSearch = (event) => {
    // if (resetFilter === false) {
    //   console.log('masuk search if');

    setSearch(event.target.value);
  };

  useCustom("search", stateField, {
    state: { search },
    onChange: onSearchChange,
  });

  const timeout = React.useRef();
  function onSearchChange(action, state) {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(
      () => {
        // console.log('state search: ' + state.search);
        fetchPipeline({
          size: state.size,
          page: pagination.state.page,
          search: state.search,
        });
        // console.log('ke halaman 1');
        // callF(state);
        // pagination.state.page = 1;
        // fetchData({
        //   search: state.search,
        //   searchIndustry,

        //   page: pagination.state.page,
        //   sort: {
        //     sortKey: sort.state.sortKey,
        //     reverse: sort.state.reverse,
        //   },
        //   statusFilter,
        // });
      },

      500
    );
  }
  let timeout2 = React.useRef();
  function fetchPipelineAfterEdit(action, state) {
    if (timeout2.current) clearTimeout(timeout2.current);

    timeout2.current = setTimeout(() => {
      // pagination.state.page = 1;
      // pagination.fns.onSetPage(1);
      fetchPipeline({
        size: 100,
        page: pagination.state.page,
        search,
      });
      // fetchData({
      //   search,
      //   searchIndustry: state.searchIndustry,

      //   page: pagination.state.page,
      //   sort: {
      //     sortKey: sort.state.sortKey,
      //     reverse: sort.state.reverse,
      //   },
      //   statusFilter,
      // });
      // pagination.state.page = 1;
    }, 500);
  }
  const fetchPipeline = (params) => {
    console.log(params, "resmasukfetch");
    let link = "";
    if (params.search !== undefined) {
      link = `http://server-pipeline.herokuapp.com/pipeline-user?page=${params.page}&size=100&nama_nasabah=${params.search}`;
    } else {
      link = `http://server-pipeline.herokuapp.com/pipeline-user?page=${params.page}&size=100`;
    }

    let linkAdmin = "";
    if (params.search !== undefined) {
      linkAdmin = `http://server-pipeline.herokuapp.com/pipeline?page=${params.page}&size=100&nama_nasabah=${params.search}`;
    } else {
      linkAdmin = `http://server-pipeline.herokuapp.com/pipeline?page=${params.page}&size=100`;
    }
    setLoading(true);
    axios({
      method: "get",
      url:
        levelUser === "admin" || levelUser === "super admin" ? linkAdmin : link,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.listData, "respon");
        setStateField((prevState) => {
          return {
            ...prevState,
            nodes: res.data.listData,
          };
        });
        setLoading(false);
      })
      .catch((e) => {
        console.log(e, "error pipeline");

        // Swal.fire({
        //   icon: "error",
        //   text: e.response.data.message,
        // });
      });
  };

  function prosesDelete(id) {
    if (levelUser === "user") {
      console.log("masuk leveluser");
      let input = { status_archive: true };
      setLoading(true);
      axios({
        method: "patch",
        url: `http://server-pipeline.herokuapp.com/delete-pipeline/${id}`,
        data: input,
        headers: {
          token: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          console.log(res, "response");
          setLoading(false);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "delete pipeline successfully",
            confirmButtonText: "Ok",
            // timer: 1500,
          }).then((result) => {
            console.log(result, "result");
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              // fetchPipelineAfterEdit();
              if (res.status === 201) {
                router.reload();
              }
              // fetchPipeline({ size: stateField.size, page: stateField.page });
            }
          });
        })
        .catch((e) => {
          console.log(e, "error pipeline");
          // Swal.fire({
          //   icon: "error",
          //   text: e.response.data.message,
          // });
        });
    } else if (levelUser === "admin" || levelUser === "super admin") {
      setLoading(true);
      axios({
        method: "delete",
        url: `http://server-pipeline.herokuapp.com/delete-pipelineadmin/${id}`,
        headers: {
          token: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          console.log(res, "response");

          setLoading(false);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "delete pipeline successfully",
            confirmButtonText: "Ok",
            // timer: 1500,
          }).then((result) => {
            console.log(result, "result");
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              fetchPipeline({ size: stateField.size, page: stateField.page });
            }
          });
        })
        .catch((e) => {
          console.log(e, "error pipeline");
          // Swal.fire({
          //   icon: "error",
          //   text: e.response.data.message,
          // });
        });
    }
  }
  let no = 1;

  useEffect(() => {
    fetchPipeline({
      size: stateField.size,
      page: stateField.page,
      search: stateField.search,
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log(stateField.nodes, "page");
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
          onClick={() => handleClickOpen("add", "")}
        >
          Add Pipeline <AddIcon sx={{ paddingLeft: "5px" }} />
        </Button>
      </div>
      <div className="container bg-white">
        <TextField
          id="outlined-basic"
          label="search nasabah name"
          variant="outlined"
          sx={{ margin: "20px 0px 20px 0px" }}
          value={search}
          onChange={(e) => {
            handleSearch(e);
          }}
        />

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
                  {/* <HeaderCell>Number</HeaderCell> */}
                  <HeaderCellSort sortKey="nama_nasabah">
                    Customer Name
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="limit">Limit</HeaderCellSort>
                  <HeaderCellSort sortKey="id_pengajuan">
                    Submission Status
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="tgl_RKP_B">RKP B</HeaderCellSort>
                  <HeaderCellSort sortKEy="tgl_RKP_A">RKP A</HeaderCellSort>
                  <HeaderCellSort sortKey="tgl_cair">Cair</HeaderCellSort>
                  <HeaderCellSort sortKey="id_progress">
                    Current Progress
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="tgl_proyeksi_cair_rpm">
                    RpM Date
                  </HeaderCellSort>
                  {levelUser === "admin" || levelUser === "super admin" ? (
                    <HeaderCellSort sortKey="id_pegawai">User</HeaderCellSort>
                  ) : levelUser === "user" ? null : null}

                  <HeaderCell></HeaderCell>
                </HeaderRow>
              </Header>

              {levelUser === "user" ? (
                <Body>
                  {tableList
                    ?.filter((el) => el.status_archive !== true)
                    .map((item, index) => (
                      <Row key={index}>
                        {/* <Cell>{no++}</Cell> */}
                        <Cell>{item.nama_nasabah}</Cell>
                        <Cell>{item.limit}</Cell>
                        <Cell>{item.StatusPengajuan.nama_pengajuan}</Cell>
                        <Cell>{toString(item.tgl_RKP_B)}</Cell>
                        <Cell>{toString(item.tgl_RKP_A)}</Cell>
                        <Cell>{toString(item.tgl_cair)}</Cell>
                        <Cell>{item.Progress.nama_progress}</Cell>
                        <Cell>{toString(item.tgl_proyeksi_cair_rpm)}</Cell>

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
              ) : (
                <Body>
                  {tableList.map((item, index) => (
                    <Row key={index}>
                      {/* <Cell>{no++}</Cell> */}
                      <Cell>{item.nama_nasabah}</Cell>
                      <Cell>{item.limit}</Cell>
                      <Cell>{item.StatusPengajuan.nama_pengajuan}</Cell>
                      <Cell>{item.tgl_RKP_B}</Cell>
                      <Cell>{item.tgl_RKP_A}</Cell>
                      <Cell>{item.tgl_cair}</Cell>
                      <Cell>{item.Progress.nama_progress}</Cell>
                      <Cell>{item.tgl_proyeksi_cair_rpm}</Cell>
                      <Cell>{item.Pegawai.nama_pegawai}</Cell>

                      <Cell>
                        <BorderColorIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClickOpen("edit", item.id)}
                        />
                        <DeleteOutlineIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => prosesDelete(item.id)}
                        />
                      </Cell>
                    </Row>
                  ))}
                </Body>
              )}
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
            {console.log(pagination.state.getPages, "pagination")}
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
                  background: "#2e7d32",
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
              {statusForm === "add"
                ? "Form Add Pipeline"
                : "Form Edit Pipeline"}
            </Typography>
            <ModalAdd
              fetchPipeline={() =>
                fetchPipeline({ size: stateField.size, page: stateField.page })
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

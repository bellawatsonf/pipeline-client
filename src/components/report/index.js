import {
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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
import styleTable from "../tablestyle.module.css";
import * as XLSX from "xlsx";
import { useExcelDownloder } from "react-xls";
import { FormatRupiah } from "../helper/formatRupiah";
import { getMonth } from "date-fns";

// import { Loading } from "../loading";

export default function ReportComponent() {
  const { ExcelDownloder, Type } = useExcelDownloder();
  let initialState = {
    page: 0,
    size: 10,
    totalPage: 0,

    nodes: [],
    dataAfterArchive: [],
    // filter_month: "all",
  };
  const [stateField, setStateField] = useState(initialState);
  // const [data, setData] = useState({ nodes: [] });
  const [open, setOpen] = React.useState(false);
  let [id, setId] = useState("");
  let [statusForm, setStatusForm] = useState("add");
  const [isLoading, setLoading] = useState(false);
  let router = useRouter();
  const [filter_tahun, setYear] = useState(new Date().getFullYear());
  const [filter_month, setMonth] = useState("all");
  const [newFormat, setNew] = useState();
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
  // let formatDataBaru = [];
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

  console.log(new Date().getMonth(), "newdate");

  let month = [
    {
      id: "1",
      name: "January",
    },
    {
      id: "2",

      name: "February",
    },
    {
      id: "3",

      name: "March",
    },
    {
      id: "4",

      name: "April",
    },
    {
      id: "5",

      name: "May",
    },
    {
      id: "6",

      name: "June",
    },
    {
      id: "7",

      name: "July",
    },
    {
      id: "8",

      name: "August",
    },
    {
      id: "9",

      name: "September",
    },
    {
      id: "10",

      name: "Obtober",
    },
    {
      id: "11",

      name: "November",
    },
    {
      id: "12",

      name: "December",
    },
  ];

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
        nominal_cair: (array) =>
          array.sort((a, b) => a.nominal_cair.localeCompare(b.nominal_cair)),
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

    setYear(event.target.value);
  };

  useCustom("filter_tahun", stateField, {
    state: { filter_tahun },
    onChange: onSearchChange,
  });

  const handleChangeSelect = (event) => {
    console.log(event.target.value, "event");
    setMonth(event.target.value);
  };

  useCustom("filter_month", stateField, {
    state: { filter_month },
    onChange: onSearchDate,
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
          filter_tahun: state.filter_tahun,
          filter_month,
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

  const timeout3 = React.useRef();
  function onSearchDate(action, state) {
    console.log(state.filter_month, "filtermonth");
    if (timeout3.current) clearTimeout(timeout.current);

    timeout3.current = setTimeout(
      () => {
        // console.log('state search: ' + state.search);
        fetchPipeline({
          size: state.size,
          page: pagination.state.page,
          filter_tahun,
          waktu_awal: state.filter_month,
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

  const fetchPipeline = (params) => {
    console.log(params, "resmasukfetch");
    let link = "";
    if (params.filter_tahun !== undefined || params.filter_month != undefined) {
      link = `http://localhost:3000/pipeline-user?page=${params.page}&size=100&filter_tahun=${params.filter_tahun}&waktu_awal=${filter_month}`;
    } else {
      link = `http://localhost:3000/pipeline-user?page=${params.page}&size=100`;
    }

    let linkAdmin = "";
    if (params.filter_tahun !== undefined || params.filter_month != undefined) {
      linkAdmin = `http://localhost:3000/pipeline?page=${params.page}&size=100&filter_tahun=${params.filter_tahun}&waktu_awal=${filter_month}`;
    } else {
      linkAdmin = `http://localhost:3000/pipeline?page=${params.page}&size=100`;
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
            nodes: res?.data?.listData,
          };
        });
        setLoading(false);
        console.log(res.data.listData.length, "dataaa");
        if (res?.data?.listData?.length > 0) {
          let formatDataBaru = [];
          console.log("formatttt");
          res?.data?.listData.map((el) => {
            console.log(el, "formattttel");
            formatDataBaru.push({
              "Nama Nasabah": el.nama_nasabah,
              Sector: el.Sector.nama_sector,
              "Status Pengajuan": el.StatusPengajuan.nama_pengajuan,
              Progress: el.Progress.nama_progress,
              "Nama User": el.Pegawai.nama_pegawai,
              Limit: el.limit,
              "RKP B": el.tgl_RKP_B,
              "RKP A": el.tgl_RKP_A,
              "Proyeksi Date": el.tgl_proyeksi,
              "Nominal Cair": el.nominal_cair,
              "Created Date": el.createdAt,
            });
          });
          console.log(formatDataBaru, "dtformatr");
          setNew(formatDataBaru);
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
      filter_tahun: filter_tahun,
      waktu_awal: filter_month,
    });
    // fetchPipeline();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log(newFormat, "newFormat");
  const downloadExcel = (data) => {
    console.log(data, "dataexel");
    const worksheet = XLSX.utils.json_to_sheet(newFormat ?? newFormat);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };

  console.log(filter_month, "page");
  console.log(filter_tahun, "page");

  return (
    <>
      <div
        style={{
          margin: "10px 0px 20px 0px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {/* <Button
          variant="contained"
          color="success"
          onClick={() => handleClickOpen("add", "")}
        >
          Add Pipeline <AddIcon sx={{ paddingLeft: "5px" }} />
        </Button> */}
        <button onClick={(e) => downloadExcel(e)}>Download As Excel</button>
        {/* <ExcelDownloder
          data={stateField}
          filename={"Pipeline"}
          type={Type.Button} // or type={'button'}
        >
          Download the Spreadsheet
        </ExcelDownloder> */}
      </div>
      <div
        className="bg-white"
        style={{ paddingLeft: "20px", paddingRight: "20px" }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <FormControl sx={{ margin: "20px 50px 20px 0px", width: "150px" }}>
            <InputLabel id="demo-simple-select-label">Select Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter_month}
              // label="Month"
              onChange={(e) => handleChangeSelect(e)}
            >
              <MenuItem value="all">All</MenuItem>

              {month.map((el, i) => (
                <MenuItem key={i} value={el.id}>
                  {el.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="outlined-basic"
            label="Insert Year"
            variant="outlined"
            sx={{ margin: "20px 0px 20px 0px" }}
            value={filter_tahun}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </div>

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
                  {/* <HeaderCell>Number</HeaderCell> */}
                  <HeaderCellSort
                    sortKey="nama_nasabah"
                    className={`${styleTable.headerCell}`}
                  >
                    Customer Name
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="limit">Limit</HeaderCellSort>
                  <HeaderCellSort sortKey="id_pengajuan">
                    Submission Status
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="id_pengajuan">Sector</HeaderCellSort>
                  <HeaderCellSort sortKey="tgl_RKP_B">RKP B</HeaderCellSort>
                  <HeaderCellSort sortKEy="tgl_RKP_A">RKP A</HeaderCellSort>
                  <HeaderCellSort sortKey="nominal_cair">
                    Nominal Cair
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="id_progress">
                    Current Progress
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="tgl_proyeksi">
                    Proyeksi Date
                  </HeaderCellSort>
                  {levelUser === "admin" || levelUser === "super admin" ? (
                    <HeaderCellSort sortKey="id_pegawai">User</HeaderCellSort>
                  ) : levelUser === "user" ? null : null}
                  <HeaderCellSort sortKey="created_at">
                    Created At
                  </HeaderCellSort>
                  {/* <HeaderCell></HeaderCell> */}
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
                        <Cell>{FormatRupiah(item.limit)}</Cell>
                        <Cell>{item.StatusPengajuan.nama_pengajuan}</Cell>
                        <Cell>{item.Sector.nama_sector}</Cell>

                        <Cell>{toString(item.tgl_RKP_B)}</Cell>
                        <Cell>{toString(item.tgl_RKP_A)}</Cell>
                        <Cell>
                          {FormatRupiah(item.nominal_cair).toString()}
                        </Cell>
                        <Cell>{item.Progress.nama_progress}</Cell>
                        <Cell>{toString(item.tgl_proyeksi)}</Cell>
                        <Cell>{toString(item.createdAt)}</Cell>
                        {/* <Cell>{toString(item.createdAt)}</Cell> */}

                        {/* <Cell>
                          <BorderColorIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClickOpen("edit", item.id)}
                          />
                          <DeleteOutlineIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => prosesDelete(item.id)}
                          />
                        </Cell> */}
                      </Row>
                    ))}
                </Body>
              ) : (
                <Body>
                  {tableList.map((item, index) => (
                    <Row key={index}>
                      {/* <Cell>{no++}</Cell> */}
                      <Cell>{item.nama_nasabah}</Cell>
                      <Cell>{FormatRupiah(item.limit)}</Cell>
                      <Cell>{item.StatusPengajuan.nama_pengajuan}</Cell>
                      <Cell>{item.Sector.nama_sector}</Cell>
                      <Cell>{toString(item.tgl_RKP_B)}</Cell>
                      <Cell>{toString(item.tgl_RKP_A)}</Cell>
                      <Cell>{FormatRupiah(item.nominal_cair).toString()}</Cell>
                      <Cell>{item.Progress.nama_progress}</Cell>
                      <Cell>{toString(item.tgl_proyeksi)}</Cell>
                      <Cell>{item.Pegawai.nama_pegawai}</Cell>
                      <Cell>{item.createdAt}</Cell>

                      {/* <Cell>
                        <BorderColorIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClickOpen("edit", item.id)}
                        />
                        <DeleteOutlineIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => prosesDelete(item.id)}
                        />
                      </Cell> */}
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
              setLoading={setLoading}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

import { Typography, TextField, Button } from "@mui/material";
import { Formik, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
} from "reactstrap";
import { useRouter } from "next/router";
import { toString } from "../helper/formatDate";
import { FormatRupiah } from "../helper/formatRupiah";
import { DatePicker } from "reactstrap-date-picker";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";

let validationSchema = Yup.object({
  nama: Yup.string().required("sector name must be fill"),
  group: Yup.string().required("group must be fill"),
  level: Yup.string().required("level name must be fill"),
});
export default function ModalAdd(props) {
  let initialValue = {
    nama_nasabah: "",
    id_pengajuan: "",
    tgl_RKP_A: "",
    tgl_RKP_B: "",
    tgl_cair: "",
    tgl_proyeksi_cair_rpm: "",
    id_progress: "",
    id_pegawai: "",
    limit: "",
    data: {},
  };
  let [stateField, setStateField] = useState(initialValue);
  let [dataPengajuan, setDataPengajuan] = useState({ nodes: [] });
  let [dataProgress, setDataProgress] = useState({ nodes: [] });
  let router = useRouter();
  let getIdPegawai = localStorage.getItem("id");
  let [status, setStatus] = useState(props.statusForm);
  const [isLoading, setLoading] = useState(false);

  console.log(props.statusForm, "id");
  const renderError = (message) => (
    <Typography sx={{ color: "red", fontSize: "12px" }} align="right">
      {message}
    </Typography>
  );

  function getOne() {
    axios({
      method: "get",
      url: `http://localhost:3000/pipeline/${props.id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(toString(res.data.data.tgl_cair), "responsegetone");
        setStateField((prevState) => {
          return {
            ...prevState,
            nama_nasabah: res.data.data.nama_nasabah,
            id_pengajuan: res.data.data.id_pengajuan,
            id_progress: res.data.data.id_progress,
            tgl_RKP_A: toString(res.data.data.tgl_RKP_A),
            tgl_RKP_B: toString(res.data.data.tgl_RKP_B),
            tgl_cair: toString(res.data.data.tgl_cair),
            tgl_proyeksi_cair_rpm: toString(
              res.data.data.tgl_proyeksi_cair_rpm
            ),
            id_pegawai: res.data.data.id_pegawai,
            limit: res.data.data.limit,
          };
        });
      })
      .catch((e) => {
        console.log(e, "erorgeid");
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  }
  function prosesSubmit(data) {
    console.log(data, "masuk");
    let uang = FormatRupiah(data.limit);
    console.log(uang, "formatuang");
    let input = {
      nama_nasabah: data.nama_nasabah,
      id_pengajuan: 3,
      tgl_RKP_A: data.tgl_RKP_A,
      tgl_RKP_B: data.tgl_RKP_B,
      tgl_cair: data.tgl_cair,
      id_progress: stateField.id_progress,
      tgl_proyeksi_cair_rpm: data.tgl_proyeksi_cair_rpm,
      id_pegawai: getIdPegawai,
      limit: uang,
      status_archive: false,
    };
    console.log(input, "datainout");
    axios
      .post("http://localhost:3000/add-pipeline", input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        // props.setOpen(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "add user successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            props.fetchPipeline();
          }
        });
      })
      .catch(function (error) {
        // Swal.fire({
        //   icon: "error",
        //   text: e.response.data.message,
        // });
        console.log(error, "eror");
      });
    // router.refresh();
  }

  function prosesEditSubmit(data) {
    console.log(data, "masuk");
    let input = {
      nama_nasabah: data.nama_nasabah,
      id_pengajuan: stateField.id_pengajuan,
      tgl_RKP_A: data.tgl_RKP_A,
      tgl_RKP_B: data.tgl_RKP_B,
      tgl_cair: data.tgl_cair,
      id_progress: stateField.id_progress,
      tgl_proyeksi_cair_rpm: data.tgl_proyeksi_cair_rpm,
      id_pegawai: getIdPegawai,
      limit: data.limit,
      status_archive: false,
    };
    console.log(input, "datainput");
    axios
      .put(`http://localhost:3000/edit-pipeline/${props.id}`, input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        props.setOpen(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "edit user successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            props.fetchPipeline();
          }
        });
      })
      .catch(function (error) {
        console.log(error, "eror");
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
    // router.refresh();
  }

  const fetchPengajuan = () => {
    console.log("resmasukfetch");
    axios({
      method: "get",
      url: `http://localhost:3000/pengajuan?page=0&size=1000`,

      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "respon");
        if (res.data.listData.length > 0) {
          setDataPengajuan((prevState) => {
            return {
              ...prevState,
              nodes: res.data.listData,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e, "error Pengajuan");

        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  };

  const fetchProgress = () => {
    console.log("resmasukfetch");
    axios({
      method: "get",
      url: `http://localhost:3000/progress?page=0&size=1000`,

      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.listData, "dataprogreas");
        if (res.data.listData.length > 0) {
          setDataProgress((prevState) => {
            return {
              ...prevState,
              nodes: res.data.listData,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e, "error progress");

        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  };
  useEffect(() => {
    if (props.statusForm === "edit") {
      getOne();
    }
    fetchPengajuan();
    fetchProgress();
  }, []);

  console.log(stateField.id_pengajuan, "idpengajuan");
  console.log(stateField.id_progress, "idprogress");
  console.log(props.statusForm, "status");
  return (
    <div
      style={{
        width: "100%",
        background: "white",
        // padding: "0px 0px 20px ",
        // borderRadius: "5px",
      }}
    >
      <Formik
        enableReinitialize={props.statusForm === "add" ? false : true}
        initialValues={stateField}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          {
            props.statusForm === "add"
              ? prosesSubmit(values)
              : prosesEditSubmit(values);
          }
        }}
      >
        {(props) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          } = props;
          console.log(values, "values");
          return (
            <form onSubmit={handleSubmit}>
              <div className="container">
                {/* <Row> */}
                {/* <Col> */}
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                  <CardBody>
                    {/* <Form> */}
                    <FormGroup>
                      <Label for="nama_nasabah">Customer Name</Label>
                      <Input
                        disabled={status === "edit" ? true : false}
                        id="nama_nasabah"
                        name="nama_nasabah"
                        placeholder="please input customer name"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nama_nasabah}
                      />
                    </FormGroup>
                    <p>{props.statusForm}</p>
                    {status !== "add" ? (
                      <FormGroup>
                        <Label for="exampleSelect">Submission Status</Label>
                        <Input
                          id="exampleSelect"
                          name="id_pengajuan"
                          type="select"
                          value={stateField.id_pengajuan}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            console.log(e.target.value, "id_pengajuan");
                            setStateField((prevState) => {
                              return {
                                ...prevState,
                                id_pengajuan: e.target.value,
                              };
                            });
                          }}
                        >
                          <option>Choose Submission Status</option>
                          {dataPengajuan?.nodes
                            ?.filter((el) => el.nama_pengajuan !== "BARU")
                            .map((el) => (
                              <option value={el.id} key={el.id}>
                                {el.nama_pengajuan}
                              </option>
                            ))}
                        </Input>
                      </FormGroup>
                    ) : null}
                    <FormGroup>
                      <Label for="limit">Limit</Label>
                      <Input
                        id="limit"
                        name="limit"
                        placeholder="please input limit"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.limit}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="tgl_RKP_A">RKP A</Label>
                      <Input
                        inputFormat="dd/MM/yyyy"
                        id="tgl_RKP_A"
                        name="tgl_RKP_A"
                        placeholder="please input RKP A"
                        type="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tgl_RKP_A}
                      />
                      {/* <DatePicker
                        id="example-datepicker"
                        value={values.tgl_RKP_A}
                        onChange={(v, f) =>
                          console.log(v, f, "hasildatepicker")
                        }
                      /> */}
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker label="Basic date picker" />
                        </DemoContainer>
                      </LocalizationProvider> */}
                    </FormGroup>

                    <FormGroup>
                      <Label for="tgl_RKP_B">RKP B</Label>
                      <Input
                        format="dd/MM/yyyy"
                        id="tgl_RKP_B"
                        name="tgl_RKP_B"
                        placeholder="please input RKP A"
                        type="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tgl_RKP_B}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="tgl_cair">Cash Down</Label>
                      <Input
                        id="tgl_cair"
                        name="tgl_cair"
                        placeholder="please input cair"
                        type="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tgl_cair}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelect">Progress</Label>
                      <Input
                        id="exampleSelect"
                        name="id_progress"
                        type="select"
                        value={stateField.id_progress}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          console.log(e.target.value, "id_progress");
                          setStateField((prevState) => {
                            return {
                              ...prevState,
                              id_progress: e.target.value,
                            };
                          });
                        }}
                      >
                        <option>Choose Progress</option>
                        {dataProgress.nodes.map((el) => (
                          <option value={el.id} key={el.id}>
                            {el.nama_progress}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="tgl_proyeksi_cair_rpm">
                        Proyeksi Cair RPM
                      </Label>
                      <Input
                        id="tgl_proyeksi_cair_rpm"
                        name="tgl_proyeksi_cair_rpm"
                        placeholder="please input occupation"
                        type="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tgl_proyeksi_cair_rpm}
                      />
                    </FormGroup>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "10px",
                      }}
                    >
                      <Button variant="contained" color="success" type="submit">
                        Submit
                      </Button>
                    </div>
                    {/* </Form> */}
                  </CardBody>
                </Card>
                {/* </Col> */}
                {/* </Row> */}
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

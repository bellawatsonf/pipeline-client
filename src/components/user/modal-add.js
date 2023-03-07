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

let validationSchema = Yup.object({
  nama: Yup.string().required("sector name must be fill"),
  group: Yup.string().required("group must be fill"),
  level: Yup.string().required("level name must be fill"),
});
export default function ModalAdd(props) {
  let initialValue = {
    nip: "",
    nama_pegawai: "",
    id_group: "",
    posisi: "",
    lokasi: "",
    level: "",
    password: "",
    data: {},
    nama_group: "",
  };
  let [stateField, setStateField] = useState(initialValue);
  let [dataGroup, setDataGroup] = useState({ nodes: [] });
  let router = useRouter();
  console.log(props.statusForm, "id");
  const renderError = (message) => (
    <Typography sx={{ color: "red", fontSize: "12px" }} align="right">
      {message}
    </Typography>
  );
  const fetchGroup = () => {
    console.log("resmasukfetch");
    axios({
      method: "get",
      url: "http://localhost:3000/group?page=0&size=100",

      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res, "respongrup");
        setDataGroup(() => {
          return {
            nodes: res.data.tutorials,
          };
        });
      })
      .catch((e) => {
        console.log(e, "erorgrup");
        Swal.fire({
          icon: "error",
          text: e.response?.data?.message,
        });
      });
  };
  function getOne() {
    axios({
      method: "get",
      url: `http://localhost:3000/pegawai/${props.id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.data, "responsegetone");
        setStateField((prevState) => {
          return {
            ...prevState,
            nip: res.data.data.nip,
            nama_pegawai: res.data.data.nama_pegawai,
            id_group: res.data.data.group_id,
            posisi: res.data.data.posisi,
            level: res.data.data.level,
            lokasi: res.data.data.lokasi,
          };
        });
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
      });
  }
  function prosesSubmit(data) {
    console.log(data, "masuk");
    let input = {
      nip: data.nip,
      nama_pegawai: data.nama_pegawai,
      group_id: stateField.id_group,
      posisi: data.posisi,
      level: stateField.level,
      password: "12345",
      lokasi: data.lokasi,
    };
    console.log(input, "datainput");
    axios
      .post("http://localhost:3000/add-pegawai", input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        props.setOpen(false);
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
            props.fetchPegawai();
          }
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          text: e.response.data.message,
        });
        console.log(error, "eror");
      });
    router.refresh();
  }

  function prosesEditSubmit(data) {
    console.log(data, "masuk");
    let input = {
      nip: data.nip,
      nama_pegawai: data.nama_pegawai,
      group_id: stateField.id_group,
      posisi: data.posisi,
      level: stateField.level,
      password: "12345",
      posisi: data.posisi,
      lokasi: data.lokasi,
    };
    axios
      .put(`http://localhost:3000/edit-pegawai/${props.id}`, input, {
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
            props.fetchPegawai();
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

  useEffect(() => {
    if (props.statusForm === "edit") {
      getOne();
    }
    fetchGroup();
  }, []);

  console.log(stateField.id_group, "idgroupd");
  console.log(stateField.level, "idgroup");
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
                      <Label for="nip">NIP</Label>
                      <Input
                        id="nip"
                        name="nip"
                        placeholder="please input nip"
                        type="text"
                        value={values.nip}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="nama_pegawai">Username</Label>
                      <Input
                        id="nama_pegawai"
                        name="nama_pegawai"
                        placeholder="please input username"
                        type="text"
                        value={values.nama_pegawai}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="posisi">Occupation</Label>
                      <Input
                        id="posisi"
                        name="posisi"
                        placeholder="please input occupation"
                        type="text"
                        value={values.posisi}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="lokasi">Location</Label>
                      <Input
                        id="lokasi"
                        name="lokasi"
                        placeholder="please input occupation"
                        type="text"
                        value={values.lokasi}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelect">Group</Label>
                      <Input
                        id="exampleSelect"
                        name="id_group"
                        type="select"
                        value={stateField.id_group}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          console.log(e.target.value, "targetvalue");
                          setStateField((prevState) => {
                            return {
                              ...prevState,
                              id_group: e.target.value,
                            };
                          });
                        }}
                        selected
                      >
                        <option>Pilih Group</option>

                        {dataGroup.nodes.map((el) => (
                          <option value={el.id}>{el.nama_group}</option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="exampleSelect">Level</Label>
                      <Input
                        id="exampleSelect"
                        name="level"
                        type="select"
                        value={stateField.level}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          console.log(e.target.value, "level");
                          setStateField((prevState) => {
                            return {
                              ...prevState,
                              level: e.target.value,
                            };
                          });
                        }}
                      >
                        <option>Pilih Level</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Input>
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

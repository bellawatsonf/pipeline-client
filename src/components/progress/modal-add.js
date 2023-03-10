import { Typography, TextField, Button } from "@mui/material";
import { Formik, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

export default function ModalAdd(props) {
  Yup.addMethod(Yup.array, "unique", function (message, mapper = (a) => a) {
    console.log(message, "pesaneror");
    return this.test("unique", message, function (list) {
      console.log(list, "pesanerorlist");
      // return list.length === new Set(list.map(mapper)).size;
    });
  });
  let validationSchema = Yup.object().shape({
    progress_name: Yup.array()
      .of(Yup.string())
      .unique("email must be unique", props.dataProgress)
      .required("progress name must be fill"),
  });
  console.log(props.dataProgress, "dataprogress");
  let initialValue = {
    progress_name: "",
  };
  let [stateField, setStateField] = useState(initialValue);
  const renderError = (message) => (
    <Typography sx={{ color: "red", fontSize: "12px" }} align="right">
      {message}
    </Typography>
  );
  function getOne() {
    axios({
      method: "get",
      url: `http://localhost:3000/progress/${props.id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.data, "responses");
        setStateField((prevState) => {
          return {
            ...prevState,
            progress_name: res.data.data.nama_progress,
          };
        });
      })
      .catch((e) => {
        console.log(e, "dari getone");
        // Swal.fire({
        //   icon: "error",
        //   text: e.response.data.message,
        // });
      });
  }
  function prosesSubmit(data) {
    console.log(data, "data");
    let input = {
      nama_progress: data.progress_name,
    };
    axios
      .post("http://localhost:3000/add-progress", input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        props.setOpen(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "add progress successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            props.fetchProgress();
          }
        });
      })
      .catch(function (error) {
        console.log(error, "eror");
      });
  }

  function prosesEditSubmit(data) {
    console.log(data, "masuk");
    let input = {
      nama_progress: data.progress_name,
    };
    axios
      .put(`http://localhost:3000/edit-progress/${props.id}`, input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        props.setOpen(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "edit progress successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        }).then((result) => {
          console.log(result, "result");
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            props.fetchProgress();
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
  }, []);
  return (
    <div
      style={{
        width: "100%",
        background: "white",
        padding: "0px 0px 20px ",
        borderRadius: "5px",
      }}
    >
      <Formik
        enableReinitialize={props.statusForm === "add" ? false : true}
        initialValues={stateField}
        validationSchema={validationSchema}
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
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "0px 20px 20px 20px",
                }}
              >
                <TextField
                  //   autoFocus
                  margin="dense"
                  id="progress_name"
                  label="Progress Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={values.progress_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {values.progress_name === "" && (
                  <ErrorMessage name="progress_name" render={renderError} />
                )}
              </div>
              <div
                style={{
                  marginRight: "20px ",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="contained" color="success" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

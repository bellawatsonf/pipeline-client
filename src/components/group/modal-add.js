import { Typography, TextField, Button } from "@mui/material";
import { Formik, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

// Yup.addMethod(Yup.array, "unique", function (message, mapper = (a) => a) {
//   return this.test("unique", message, function (list) {
//     return list.length === new Set(list.map(mapper)).size;
//   });
// });
// let validationSchema = Yup.object({
//   group_name: Yup.array()
//     .of(Yup.string())
//     // .unique("group name must be unique")
//     .required("group name must be fill"),

//   // .unique("group name must be unique", (a) => a.group_name),
// });

let validationSchema = Yup.object({
  group_name: Yup.string().required("group name must be fill"),
});
export default function ModalAdd(props) {
  console.log(props.dataGroup, "datagrup");
  let initialValue = {
    group_name: "",
    initial_group: "",
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
      url: `http://localhost:3000/group/${props.id}`,
      headers: {
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res.data.data, "responses");
        setStateField((prevState) => {
          return {
            ...prevState,
            group_name: res.data.data.nama_group,
            initial_group: res.data.data.initial_group,
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
    console.log(data, "datassss");
    let input = {
      nama_group: data.group_name,
      initial_group: data.initial_group,
    };
    console.log(input, "input data");
    axios
      .post("http://localhost:3000/add-group", input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        props.setOpen(false);
        props.fetchGroup();

        Swal.fire({
          position: "center",
          icon: "success",
          title: "add group successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        });
        // .then((result) => {
        //   console.log(result, "result");
        //   /* Read more about isConfirmed, isDenied below */
        //   if (result.isConfirmed) {
        //     props.fetchGroup();
        //   }
        // });
      })
      .catch(function (error) {
        console.log(error, "eror");
      });
  }

  function prosesEditSubmit(data) {
    console.log(data, "masuk");
    let input = {
      nama_group: data.group_name,
      initial_group: data.initial_group,
    };
    axios
      .put(`http://localhost:3000/edit-group/${props.id}`, input, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        props.setOpen(false);
        props.fetchGroup();

        Swal.fire({
          position: "center",
          icon: "success",
          title: "edit group successfully",
          confirmButtonText: "Ok",
          // timer: 1500,
        });
        // .then((result) => {
        //   console.log(result, "result");
        //   /* Read more about isConfirmed, isDenied below */
        //   if (result.isConfirmed) {
        //     props.fetchGroup();
        //   }
        // });
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
          console.log("masuk");
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
                  id="group_name"
                  label="Group Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={values.group_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {values.group_name === "" && (
                  <ErrorMessage name="group_name" render={renderError} />
                )}

                <TextField
                  //   autoFocus
                  margin="dense"
                  id="initial_group"
                  label="Initial Group"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={values.initial_group}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {values.initial_group === "" && (
                  <ErrorMessage name="initial_group" render={renderError} />
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

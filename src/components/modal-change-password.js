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
export default function ModalChangePassword(props) {
  let id = "";
  if (typeof window !== "undefined") {
    // Perform localStorage action
    id = localStorage.getItem("id");
  }
  let initialValue = {
    password: "",
  };
  let [stateField, setStateField] = useState(initialValue);
  let router = useRouter();

  const renderError = (message) => (
    <Typography sx={{ color: "red", fontSize: "12px" }} align="right">
      {message}
    </Typography>
  );

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
          let input = {
            password: values.password,
          };
          axios({
            method: "patch",
            url: `https://server-pipeline.herokuapp.com/edit-password/${id}`,
            headers: {
              token: localStorage.getItem("token"),
            },
            data: input,
          })
            .then(function (response) {
              props.setOpen(false);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "change password successfully",
                confirmButtonText: "Ok",
                // timer: 1500,
              }).then((result) => {
                console.log(result, "result");
                /* Read more about isConfirmed, isDenied below */
                // if (result.isConfirmed) {
                //   props.fetchPipeline();
                // }
              });
            })
            .catch(function (error) {
              console.log(error, "eror");
              Swal.fire({
                icon: "error",
                text: e.response.data.message,
              });
            });
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
                      <Label for="password">New Password</Label>
                      <Input
                        id="password"
                        name="password"
                        placeholder="please input customer name"
                        type="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
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

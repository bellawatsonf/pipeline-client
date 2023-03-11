import loginStyle from "./loginstyle.module.css";
import { ErrorMessage, Formik } from "formik";
import { Button, Typography } from "@mui/material";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { LoadingScreen } from "../loading";

const validationSchema = Yup.object({
  nip: Yup.string().required("nip must be fill"),
  password: Yup.string().required("password must be fill"),
});
export default function LoginComponent() {
  let router = useRouter();
  const initialState = {
    nip: "",
    password: "",
  };
  const [stateField, setStateField] = useState(initialState);
  const [isLoading, setLoading] = useState(false);

  const renderError = (message) => (
    <Typography sx={{ color: "red", fontSize: "12px" }} align="right">
      {message}
    </Typography>
  );

  function prosesSubmit(data) {
    let input = {
      nip: data.nip,
      password: data.password,
    };
    console.log(input, "input");
    setLoading(true);
    axios
      .post("http://localhost:3000/login", input, {
        // headers: { token: localStorage.getItem("token") },
      })
      .then(function (response) {
        console.log(response, "response");
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("level", response?.data?.level);
        localStorage.setItem("id", response?.data?.id);
        setLoading(false);
        // router.push("/dasboard");
        router.push("/dashboard");
      })
      .catch(function (error) {
        console.log(error, "eror");
        Swal.fire({
          icon: "error",
          text: error.response.data.message,
        });
        // router.push("/login");
        router.push("/");
      });
  }

  if (isLoading) return <LoadingScreen />;
  return (
    <div className={loginStyle["container"]}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "350px",
          width: "100%",
          background: "#dee2e6",
          margin: "auto",
          height: "300px",
          marginTop: "10%",
        }}
      >
        <Formik
          validateOnChange={true}
          initialValues={stateField}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            prosesSubmit(values);
          }}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              setValues,
              setFieldValue,
            } = props;
            console.log(values, "values");
            return (
              <form onSubmit={handleSubmit}>
                <div
                  className={loginStyle["title"]}
                  style={{ marginBottom: "40px" }}
                >
                  Login
                </div>
                <div className={loginStyle["input-box underline"]}>
                  <input
                    htmlFor=""
                    type="text"
                    placeholder="Enter Your NIP"
                    id="nip"
                    name="nip"
                    value={values.nip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <div className={loginStyle["underline"]}></div>
                  {values.nip === "" && (
                    <ErrorMessage name="nip" render={renderError} />
                  )}
                </div>
                <div className={loginStyle["input-box underline"]}>
                  <input
                    htmlFor="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="password"
                    placeholder="Enter Your Password"
                    required
                  />
                  <div className={loginStyle["underline"]}></div>
                  {values.password === "" && (
                    <ErrorMessage name="password" render={renderError} />
                  )}
                </div>
                <div className={loginStyle["input-box button"]}>
                  <input type="submit" name="" value="Submit" />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

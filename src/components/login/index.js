import styleLogin from "./login.module.css";
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
    <div className={`${styleLogin.container}`}>
      <div className={`${styleLogin.boxLogin}`}>
        <div className={`${styleLogin.usericon}`}>
          <img src="/assets/user.png" />
          <Typography
            sx={{
              marginTop: "10px",
              fontFamily: "fangsong",
              fontSize: { xs: "20px", md: "23px", lg: "26px" },
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Login.
          </Typography>
        </div>
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
              <form onSubmit={handleSubmit} className={`${styleLogin.form}`}>
                <div className="mb-2">
                  <label
                    htmlFor="exampleInputEmail1"
                    className={styleLogin["form-label"]}
                  >
                    NIP
                  </label>
                  <input
                    htmlFor=""
                    type="text"
                    className="form-control"
                    id="nip"
                    aria-describedby="emailHelp"
                    name="nip"
                    value={values.nip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {values.nip === "" && (
                    <ErrorMessage name="nip" render={renderError} />
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="exampleInputPassword1"
                    className={styleLogin["form-label"]}
                  >
                    Password
                  </label>
                  <input
                    htmlFor="password"
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div style={{ marginBottom: "30px" }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontFamily: "fangsong",
                    }}
                  >
                    <a style={{ textDecoration: "none" }} href="">
                      Forgot Password
                    </a>
                  </Typography>
                </div>
                <Button
                  sx={{
                    width: "60%",
                    background: "#045FB4",
                    margin: "auto",
                    display: "block",
                    fontFamily: "fangsong",
                  }}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

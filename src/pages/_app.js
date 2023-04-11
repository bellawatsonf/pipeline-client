import FullLayout from "../layouts/FullLayout";
import Head from "next/head";
import "../styles/style.scss";
import "../styles/global.css";
import { RouteGuard } from "../../RouteGuard";
import { useRouter } from "next/router";
import LoginComponent from "../components/login/index4";
import Router from "next/router";
import { useEffect } from "react";
function MyApp({ Component, pageProps }) {
  let router = useRouter();
  let token = null;
  if (typeof window !== "undefined") {
    // Perform localStorage action
    token = localStorage.getItem("token");
  }
  console.log(token, "props");
  function componentDidMount() {
    if (token === null) {
      Router.replace("/");
    }
  }

  useEffect(() => {
    componentDidMount();
  }, []);
  // function backhome() {
  //   router.push("/");
  // }

  const renderPosts = async () => {
    try {
      // router.push("/login");
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(Component.name, "router");
  console.log({ Component }, "router22");

  return (
    <>
      <Head>
        <title>Pipeline Management</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {Component.name.length === 1 ||
      Component.name === "c" ||
      Component.name === "s" ||
      Component.name === "r" ||
      Component.name === "Login" ? (
        <Component {...pageProps} />
      ) : (
        <>
          <FullLayout>
            <Component {...pageProps} />
          </FullLayout>
        </>
        // <p>no</p>
      )}
      {/* <FullLayout>
        <Component {...pageProps} />
      </FullLayout> */}
      {/* {router.pathname !== "Login" && token !== null ? (
        <FullLayout>
          <Component {...pageProps} />
        </FullLayout>
      ) : (
        <Component {...pageProps} />
      )} */}
    </>
  );
}

export default MyApp;

import loginStyle from "./loginstyle.module.css";

export default function LoginComponent() {
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
        <form action="#">
          <div className={loginStyle["title"]}>Login</div>
          <div className={loginStyle["input-box underline"]}>
            <input type="text" placeholder="Enter Your NIP" required />
            <div className={loginStyle["underline"]}></div>
          </div>
          <div className={loginStyle["input-box"]}>
            <input type="password" placeholder="Enter Your Password" required />
            <div className={loginStyle["underline"]}></div>
          </div>
          <div className={loginStyle["input-box button"]}>
            <input type="submit" name="" value="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
}

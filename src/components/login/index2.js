import style from "./style2.module.css";
export default function LoginComponent() {
  return (
    <section
      className={`${style.gradientForm}h-100`}
      style={{ backgroundColor: "#eee" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="card rounded-3 text-black">
            <div className="row g-0">
              <div className="card-body p-md-5 mx-md-4">
                <div className="text-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                    style={{ width: "185px" }}
                    alt="logo"
                  />
                  <h4 className="mt-1 mb-5 pb-1">We are The Lotus Team</h4>
                </div>

                <form>
                  <p>Please login to your account</p>

                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="form2Example11"
                      className="form-control"
                      placeholder="Phone number or email address"
                    />
                    <label className="form-label" htmlFor="form2Example11">
                      Username
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="form2Example22"
                      className="form-control"
                    />
                    <label className="form-label" htmlFor="form2Example22">
                      Password
                    </label>
                  </div>

                  <div className="text-center pt-1 mb-5 pb-1">
                    <button
                      className={`${style.gradientCustom2}btn btn-primary btn-block fa-lg mb-3`}
                      type="button"
                    >
                      Log in
                    </button>
                    <a className="text-muted" href="#!">
                      Forgot password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

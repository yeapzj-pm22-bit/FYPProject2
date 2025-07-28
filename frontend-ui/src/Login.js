import React from "react";
import './Login.css';

const Login = () => {
  return (
    <div className="login_form_wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* login_wrapper */}
            <div className="login_wrapper">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <a href="#" className="btn btn-primary facebook">
                    <span>Login with Facebook</span> <i className="fa fa-facebook"></i>
                  </a>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <a href="#" className="btn btn-primary google-plus">
                    Login with Google <i className="fa fa-google-plus"></i>
                  </a>
                </div>
              </div>

              <h2>or</h2>

              <div className="formsix-pos">
                <div className="form-group i-email">
                  <input
                    type="email"
                    className="form-control"
                    id="email2"
                    placeholder="Email Address *"
                    required
                  />
                </div>
              </div>

              <div className="formsix-e">
                <div className="form-group i-password">
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    placeholder="Password *"
                    required
                  />
                </div>
              </div>

              <div className="login_remember_box d-flex justify-content-between align-items-center">
                <label className="control control--checkbox mb-0">
                  Remember me
                  <input type="checkbox" />
                  <span className="control__indicator"></span>
                </label>
                <a href="#" className="forget_password">
                  Forgot Password
                </a>
              </div>

              <div className="login_btn_wrapper">
                <a href="#" className="btn btn-primary login_btn">
                  Login
                </a>
              </div>

              <div className="login_message">
                <p>
                  Don&rsquo;t have an account? <a href="#">Sign up</a>
                </p>
              </div>
            </div>
            {/* /.login_wrapper */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

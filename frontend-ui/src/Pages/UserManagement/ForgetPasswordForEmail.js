import React from 'react';

const ForgetPasswordForEmail = () => {
  return (
    <div className="login-main-wrapper">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 col-12 p-0">
            <div className="form-sidebar">
              <div className="logo-section">
                <img src={`${process.env.PUBLIC_URL}/images/logo3.png`} alt="img" />
              </div>
              <div className="form-image d-xl-block d-lg-block d-none">
                <img src={`${process.env.PUBLIC_URL}/images/form-img.png`} alt="img" />
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-12 p-0">
            <div className="login-main">
              <form>
                <h4>Forgot Your Password?</h4>
                <p className="mb-3">Enter your email to receive a reset link</p>

                {/* Email */}
                <div className="mt-2">
                  <input
                    type="email"
                    className="my-width"
                    placeholder="Email*"
                    name="email"
                  />
                </div>

                <button type="submit" className="button-btn mt-4 text-capitalize">
                  Send Reset Link
                  <span><i className="fas fa-angle-double-right"></i></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordForEmail;

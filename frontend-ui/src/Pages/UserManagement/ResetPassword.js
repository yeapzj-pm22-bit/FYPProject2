import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
                <h4>Reset Your Password</h4>
                <p className="mb-3">Enter and confirm your new password</p>

                {/* New Password */}
                <div className="mt-2 position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="my-width pe-5"
                    placeholder="New Password*"
                    name="newPassword"
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                {/* Confirm Password */}
                <div className="mt-2 position-relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="my-width pe-5"
                    placeholder="Confirm Password*"
                    name="confirmPassword"
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowConfirm(prev => !prev)}
                  >
                    {showConfirm ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <button type="submit" className="button-btn mt-4 text-capitalize">
                  Reset Password
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

export default ResetPassword;

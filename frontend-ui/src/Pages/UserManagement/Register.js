import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
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
                                  <img src={`${process.env.PUBLIC_URL}/images/form-img.png`}  alt="img" />
                               </div>
                            </div>
                         </div>
                         <div className="col-lg-6 col-md-12 col-12 p-0">
                            <div className="login-main">
                               <form>
                                  <h4>Register Now</h4>
                                  <p className="mb-3">Register by entering the information below</p>

                                  {/* First Name */}
                                        <div className="mt-2">
                                          <input type="text" className="my-width" placeholder="First Name*" name="firstName" />
                                        </div>

                                        {/* Last Name */}
                                        <div className="mt-2">
                                          <input type="text" className="my-width" placeholder="Last Name*" name="lastName" />
                                        </div>

                                        {/* Email */}
                                        <div className="mt-2">
                                          <input type="email" className="my-width" placeholder="Email*" name="email" />
                                        </div>

                                        {/* Gender */}
                                        <div className="mt-2">
                                          <select className="my-width" name="gender" defaultValue="">
                                            <option value="" disabled>-- Select Gender* --</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                          </select>
                                        </div>

                                        {/* Birth Date */}
                                        <div className="mt-2">
                                          <input type="date" className="my-width" name="birthDate" placeholder="Birth Date*" />
                                        </div>

                                        {/* Password */}
                                              <div className="mt-2 position-relative">
                                                <input
                                                  type={showPassword ? "text" : "password"}
                                                  className="my-width pe-5" // add padding-end to avoid icon overlap
                                                  placeholder="Password*"
                                                  name="password"
                                                />
                                                <span
                                                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                                                  style={{ cursor: "pointer"}}
                                                  onClick={() => setShowPassword(prev => !prev)}
                                                >
                                                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                                                </span>
                                              </div>

                                              {/* Confirm Password */}
                                              <div className="mt-2 position-relative">
                                                <input
                                                  type={showConfirm ? "text" : "password"}
                                                  className="my-width pe-5"
                                                  placeholder="Confirm Password*"
                                                  name="confirmPassword"
                                                />
                                                <span
                                                  className="position-absolute end-0 top-50 translate-middle-y me-3"
                                                  style={{ cursor: "pointer"}}
                                                  onClick={() => setShowConfirm(prev => !prev)}
                                                >
                                                  {showConfirm ? <FaEye /> : <FaEyeSlash />}
                                                </span>
                                              </div>

                                  <div className="mt-2">
                                     <input type="checkbox" id="accept" className="me-2" />
                                     <label for="accept">Yes, I understand and agree <a href="javascript:;" className="text-color-pink">Terms & Conditions</a>.</label>
                                  </div>
                                  <a href="javascript:;" className="button-btn mt-4 text-capitalize">Register
                                  <span><i className="fas fa-angle-double-right"></i></span>
                                  </a>
                                  <p className="mt-2">Already have an Account. <Link to="/login" className="text-color-pink">Login Now</Link></p>
                               </form>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

  );
}

export default Register;
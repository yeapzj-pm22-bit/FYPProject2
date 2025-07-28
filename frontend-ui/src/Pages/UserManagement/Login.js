import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
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
                         <h4>Welcome Back</h4>
                         <p className="mb-3">Login by entering the information below</p>
                         <div className="mt-2">
                            <input type="text" className="my-width" placeholder="UserName*" />
                         </div>
                         <div className="mt-2">
                            <input type="password" className="my-width" placeholder="Password*" />
                         </div>
                         <ul className="">
                            <li>
                               <input type="checkbox" name="remember" id="confirm" />
                               <label for="confirm">Remember me</label>
                            </li>
                            <li>
                            <Link to="/ProfilePage" className="ms-4 form-resp-display">Forget Passsword?</Link>
                           {/* <Link to="/resetPassword" className="ms-4 form-resp-display">Forget Passsword?</Link>*/}
                            </li>
                         </ul>
                         <div className="d-flex align-items-baseline ">
                            <a href="javascript:;" className="button-btn mt-4 text-capitalize">Login
                               <span><i className="fas fa-angle-double-right"></i></span>
                            </a>
                            <Link to="/register" className="ms-4 form-resp-display">Create Account</Link>

                         </div>
                      </form>
                   </div>
                </div>
             </div>
          </div>
       </div>
  );
}

export default Login;
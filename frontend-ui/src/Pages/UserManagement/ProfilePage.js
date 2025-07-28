import React, { useState } from 'react';
import './ProfilePage.css';
import Header from '../../Components/Header';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfilePage = () => {
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  return (
  <>
<Header />
<div style={{ clear: 'both' }}></div>
<div className="profile-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '30vh' }}>

    <div className="container emp-profile mt-4">
    <div className="profile-header mb-4 ">
      <h2 className="text-center">Profile</h2>
    </div>

      <form method="post">
        <div className="row">
          <div className="col-md-4">
            <div className="profile-img text-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"
                alt="profile"
                className="img-fluid"
              />
              <div className="file btn btn-lg btn-primary mt-2">
                Change Photo
                <input type="file" name="file" />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="profile-head">
              <h5>Kshiti Ghelani</h5>
              <h6>Patient</h6>
              <p className="proile-rating">
                Created at : <span>12/07/2025</span>
              </p>

              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                  >
                    About
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                  >
                    Timeline
                  </button>
                </li>
              </ul>
            </div>
          </div>


          <div className="col-md-2 d-flex flex-column align-items-start gap-2">

            {/* Edit Profile Button */}
            <input
              type="button"
              className="btn btn-outline-primary"
              value="Edit Profile"
              onClick={() => setShowEditModal(true)}
            />

            {/* Upload IC Button */}
            <input
              type="button"
              className="btn btn-outline-primary"
              value=" Upload IC "
              onClick={() => setShowVerifyModal(true)}
            />

          </div>
          {/* Modal */}
                    {showEditModal && (
                      <div className="modal-backdrop">
                        <div className="edit-modal p-4 position-relative">
                          {/* Close Icon */}
                          <span
                            className="close-icon"
                            onClick={() => setShowEditModal(false)}
                          >
                            &times;
                          </span>

                          {/* Header */}
                          <h4 className="mb-4 text-center">Edit Profile</h4>

                          <div className="mt-2">
                            <input type="text" className="my-width" placeholder="First Name*" name="firstName" />
                          </div>

                          <div className="mt-2">
                            <input type="text" className="my-width" placeholder="Last Name*" name="lastName" />
                          </div>

                          <div className="mt-2">
                            <input type="email" className="my-width" placeholder="Email*" name="email" />
                          </div>

                          <div className="mt-2">
                            <select className="my-width" name="gender" defaultValue="">
                              <option value="" disabled>-- Select Gender* --</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="mt-2">
                            <input type="date" className="my-width" name="birthDate" placeholder="Birth Date*" />
                          </div>



                          <a href="javascript:;" className="button-btn mt-4 text-capitalize">
                            Submit <span><i className="fas fa-angle-double-right"></i></span>
                          </a>
                        </div>
                      </div>
                    )}

                    {showVerifyModal && (
                      <div className="modal-backdrop">
                        <div className="edit-modal">

                          <span
                                                      className="close-icon"
                                                      onClick={() => setShowVerifyModal(false)}
                                                    >
                                                      &times;
                                                    </span>

                          <h3 className="text-center mb-3">Verify Identity</h3>

                          <div className="mt-2">
                            <label>Front IC Image</label>
                            <input type="file" className="my-width" />
                          </div>

                          <div className="mt-2">
                            <label>Back IC Image</label>
                            <input type="file" className="my-width" />
                          </div>

                          <a
                            href="javascript:;"
                            className="button-btn mt-4 text-capitalize"
                            onClick={() => setShowVerifyModal(false)}
                          >
                            Submit
                            <span><i className="fas fa-angle-double-right"></i></span>
                          </a>
                        </div>
                      </div>
                    )}

        </div>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="profile-work">

            </div>
          </div>

          <div className="col-md-8">
            <div className="tab-content profile-tab">
              {activeTab === 'about' && (
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-md-6"><label>Name</label></div>
                    <div className="col-md-6"><p>Kshiti Ghelani</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>Email</label></div>
                    <div className="col-md-6"><p>kshitighelani@gmail.com</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>Gender</label></div>
                    <div className="col-md-6"><p>Female</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>Birth Date</label></div>
                    <div className="col-md-6"><p>03/14/2003</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>IC</label></div>
                    <div className="col-md-6"><p>Not Verified</p></div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="tab-pane active">
                  <div className="row">
                    <div className="col-md-6"><label>Experience</label></div>
                    <div className="col-md-6"><p>Expert</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>Hourly Rate</label></div>
                    <div className="col-md-6"><p>10$/hr</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>Total Projects</label></div>
                    <div className="col-md-6"><p>230</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>English Level</label></div>
                    <div className="col-md-6"><p>Expert</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6"><label>Availability</label></div>
                    <div className="col-md-6"><p>6 months</p></div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>Your Bio</label>
                      <p>Your detail description</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
    </div>
    </>
  );
};

export default ProfilePage;

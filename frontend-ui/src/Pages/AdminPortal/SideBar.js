import React, { useEffect, useRef,useState } from 'react';
import logo from './images/logo/logo.png'; // Assuming using Webpack or CRA
import userImg from './images/layout_img/user_img.jpg';
import { Link } from 'react-router-dom';

const SideBar = ({ openMenu, toggleMenu }) => {
  return (
    <nav id="sidebar">
      <div className="sidebar_blog_1">
        <div className="sidebar-header">
          <div className="logo_section">
            <a href="/">
              <img
                className="logo_icon img-responsive"
                src={logo}
                alt="logo"
              />
            </a>
          </div>
        </div>
        <div className="sidebar_user_info">
          <div className="icon_setting"></div>
          <div className="user_profle_side">
            <div className="user_img">
              <img
                className="img-responsive"
                src={userImg}
                alt="user"
              />
            </div>
            <div className="user_info">
              <h6>John David</h6>
              <p>
                <span className="online_animation"></span> Online
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar_blog_2">
        <h4>General</h4>
        <ul className="list-unstyled components">
          <li className={openMenu === 'dashboard' ? 'active' : ''}>
            <a
              href="#dashboard"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu('dashboard');
              }}
              className={`dropdown-toggle ${openMenu === 'dashboard' ? '' : 'collapsed'}`}
              aria-expanded={openMenu === 'dashboard'}
            >
              <i className="fa fa-dashboard yellow_color"></i>
              <span>Dashboard</span>
            </a>
            <ul
              className={`list-unstyled collapse ${openMenu === 'dashboard' ? 'show' : ''}`}
              id="dashboard"
            >
              <li>
                <a href="/admin/dashboard">
                  &gt; <span>Default Dashboard</span>
                </a>
              </li>
            </ul>
          </li>




          <li className={openMenu === 'userManagement' ? 'active' : ''}>
                      <a
                        href="#userManagement"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMenu('userManagement');
                        }}
                        className={`dropdown-toggle ${openMenu === 'userManagement' ? '' : 'collapsed'}`}
                        aria-expanded={openMenu === 'userManagement'}
                      >
                        <i className="fa fa-user yellow_color"></i>
                        <span>User Management</span>
                      </a>
                      <ul
                        className={`list-unstyled collapse ${openMenu === 'userManagement' ? 'show' : ''}`}
                        id="userManagement"
                      >
                        <li>
                         <Link to="/list-user">
                            &gt; <span>User List</span>
                          </Link>
                        </li>
                        <li>
                              <Link to="/create-user">
                                &gt; <span>Add User</span>
                              </Link>
                        </li>
                        <li>
                               <Link to="/ic-verify">
                                 &gt; <span>IC verification</span>
                               </Link>
                        </li>
                      </ul>
          </li>



           <li className={openMenu === 'Appointment' ? 'active' : ''}>
                                           <a
                                             href="#Appointment"
                                             onClick={(e) => {
                                               e.preventDefault();
                                               toggleMenu('Appointment');
                                             }}
                                             className={`dropdown-toggle ${openMenu === 'Appointment' ? '' : 'collapsed'}`}
                                             aria-expanded={openMenu === 'Appointment'}
                                           >
                                             <i className="fa fa-calendar-check yellow_color"></i>
                                             <span>Appointment</span>
                                           </a>
                                           <ul
                                             className={`list-unstyled collapse ${openMenu === 'Appointment' ? 'show' : ''}`}
                                             id="Appointment"
                                           >

                                             <li>
                                                   <Link to="/appointment-list">
                                                     &gt; <span>Appointment List</span>
                                                   </Link>
                                             </li>
                                             <li>
                                                   <Link to="/schedule">
                                                     &gt; <span>Appointment & Schedule</span>
                                                   </Link>
                                             </li>
                                           </ul>
            </li>




          <li className={openMenu === 'medicalManagement' ? 'active' : ''}>
                                <a
                                  href="#medicalManagement"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleMenu('medicalManagement');
                                  }}
                                  className={`dropdown-toggle ${openMenu === 'medicalManagement' ? '' : 'collapsed'}`}
                                  aria-expanded={openMenu === 'medicalManagement'}
                                >
                                  <i className="fa fa-notes-medical yellow_color"></i>
                                  <span>Medical Record</span>
                                </a>
                                <ul
                                  className={`list-unstyled collapse ${openMenu === 'medicalManagement' ? 'show' : ''}`}
                                  id="medicalManagement"
                                >
                                  <li>
                                   <Link to="/medical-list">
                                      &gt; <span>Medical Record List</span>
                                    </Link>
                                  </li>
                                  <li>
                                        <Link to="/create-medical">
                                          &gt; <span>Add Medical</span>
                                        </Link>
                                  </li>
                                </ul>
           </li>


            <li className={openMenu === 'Medicine' ? 'active' : ''}>
                                                       <a
                                                         href="#Medicine"
                                                         onClick={(e) => {
                                                           e.preventDefault();
                                                           toggleMenu('Medicine');
                                                         }}
                                                         className={`dropdown-toggle ${openMenu === 'Medicine' ? '' : 'collapsed'}`}
                                                         aria-expanded={openMenu === 'Medicine'}
                                                       >
                                                         <i className="fas fa-pills yellow_color"></i>
                                                         <span>Medicine</span>
                                                       </a>
                                                       <ul
                                                         className={`list-unstyled collapse ${openMenu === 'Medicine' ? 'show' : ''}`}
                                                         id="Medicine"
                                                       >
                                                         <li>
                                                          <Link to="/medicine-list">
                                                             &gt; <span>Medicine List</span>
                                                           </Link>
                                                         </li>
                                                         <li>
                                                               <Link to="/medicine">
                                                                 &gt; <span>Add Medicine</span>
                                                               </Link>
                                                         </li>
                                                       </ul>
            </li>




            <li className={openMenu === 'Dispense' ? 'active' : ''}>
                                                                               <a
                                                                                 href="#Dispense"
                                                                                 onClick={(e) => {
                                                                                   e.preventDefault();
                                                                                   toggleMenu('Dispense');
                                                                                 }}
                                                                                 className={`dropdown-toggle ${openMenu === 'Dispense' ? '' : 'collapsed'}`}
                                                                                 aria-expanded={openMenu === 'Dispense'}
                                                                               >
                                                                                 <i className="fas fa-prescription-bottle-alt yellow_color"></i>
                                                                                 <span>Dispense</span>
                                                                               </a>
                                                                               <ul
                                                                                 className={`list-unstyled collapse ${openMenu === 'Dispense' ? 'show' : ''}`}
                                                                                 id="Dispense"
                                                                               >
                                                                                 <li>
                                                                                  <Link to="/dispense-list">
                                                                                     &gt; <span>Dispense List</span>
                                                                                   </Link>
                                                                                 </li>
                                                                                 <li>
                                                                                       <Link to="/refill-request">
                                                                                         &gt; <span>Refill Request</span>
                                                                                       </Link>
                                                                                 </li>

                                                                               </ul>
            </li>

            <li className={openMenu === 'Inventory' ? 'active' : ''}>
                                                                               <a
                                                                                 href="#Inventory"
                                                                                 onClick={(e) => {
                                                                                   e.preventDefault();
                                                                                   toggleMenu('Inventory');
                                                                                 }}
                                                                                 className={`dropdown-toggle ${openMenu === 'Inventory' ? '' : 'collapsed'}`}
                                                                                 aria-expanded={openMenu === 'Inventory'}
                                                                               >
                                                                                 <i className="fas fa-boxes yellow_color"></i>
                                                                                 <span>Inventory</span>
                                                                               </a>
                                                                               <ul
                                                                                 className={`list-unstyled collapse ${openMenu === 'Inventory' ? 'show' : ''}`}
                                                                                 id="Inventory"
                                                                               >
                                                                                 <li>
                                                                                  <Link to="/inventory-list">
                                                                                     &gt; <span>Inventory List</span>
                                                                                   </Link>
                                                                                 </li>
                                                                                 <li>
                                                                                       <Link to="/inventory">
                                                                                         &gt; <span>Add Inventory</span>
                                                                                       </Link>
                                                                                 </li>
                                                                                  <li>
                                                                                        <Link to="/restock-list">
                                                                                          &gt; <span>Restock Request</span>
                                                                                        </Link>
                                                                                  </li>
                                                                               </ul>
                        </li>

        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
import React, { useState } from 'react';
import logo from './images/logo/logo.png';
import userImg from './images/layout_img/user_img.jpg';

const TopBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="topbar">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="full">
          <button type="button" id="sidebarCollapse" className="sidebar_toggle">
            <i className="fa fa-bars"></i>
          </button>

          <div className="logo_section">
            <a href="/">
              <img className="img-responsive" src={logo} alt="logo" />
            </a>
          </div>

          <div className="right_topbar">
            <div className="icon_info">
              <ul>
                <li>
                  <a href="#"><i className="fa fa-bell-o"></i><span className="badge">2</span></a>
                </li>
                <li>
                  <a href="#"><i className="fa fa-question-circle"></i></a>
                </li>
                <li>
                  <a href="#"><i className="fa fa-envelope-o"></i><span className="badge">3</span></a>
                </li>
              </ul>

              <ul className="user_profile_dd">
                <li>
                  <a
                    className="dropdown-toggle"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    <img className="img-responsive rounded-circle" src={userImg} alt="user" />
                    <span className="name_user">John David</span>
                  </a>

                  {dropdownOpen && (
                    <div className="dropdown-menu show" style={{ display: 'block' }}>
                      <a className="dropdown-item" href="/profile">My Profile</a>
                      <a className="dropdown-item" href="/settings">Settings</a>
                      <a className="dropdown-item" href="/help">Help</a>
                      <a className="dropdown-item" href="#">
                        <span>Log Out</span> <i className="fa fa-sign-out"></i>
                      </a>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopBar;

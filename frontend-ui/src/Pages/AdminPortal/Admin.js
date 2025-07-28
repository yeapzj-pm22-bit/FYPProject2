import React, { useEffect, useRef,useState } from 'react';

import './css/bootstrap.min.css';

import './css/style.css';
import './css/responsive.css';
import './css/bootstrap-select.css';
import './css/perfect-scrollbar.css';
import './css/custom.css';
import SideBar from './SideBar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './images/logo/logo.png'; // Assuming using Webpack or CRA
import userImg from './images/layout_img/user_img.jpg';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Admin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
      const dropdownRef = useRef(null);

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

  useEffect(() => {
    const sidebarToggleBtn = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggleBtn && sidebar) {
      const toggleSidebar = () => {
        sidebar.classList.toggle('active');
      };

      sidebarToggleBtn.addEventListener('click', toggleSidebar);

      // Cleanup on unmount
      return () => {
        sidebarToggleBtn.removeEventListener('click', toggleSidebar);
      };
    }
  }, []);
    const [openMenu, setOpenMenu] = useState('');

    const toggleMenu = (menuId) => {
      setOpenMenu(prev => (prev === menuId ? '' : menuId));
    };

  return (
    <div className="full_container">
      <div className="inner_container">

        {/* SIDE BAR SECTION */}
        <SideBar openMenu={openMenu} toggleMenu={toggleMenu} />
        {/* SIDE BAR SECTION */}

        <div id="content">
            {/* TOP BAR SECTION */}
             <TopBar />
            {/* TOP BAR SECTION */}

                    <div className="midde_cont">
                                      <Outlet />
                    </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

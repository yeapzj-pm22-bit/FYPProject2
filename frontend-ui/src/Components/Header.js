import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
        <div className="main-header-wrapper3 float_left">
              <div className="sb-main-header3">
                 <div className="top-header3 d-xl-block d-lg-block d-md-none d-sm-none d-none">
                    <div className="container">
                       <div className="row">
                          <div className="col-lg-4 col-md-4 col-sm-6 col-12">
                             <div className="logo-wrapper3">
                                <a href="javascript:;"><img src={`${process.env.PUBLIC_URL}/images/home3/logo4.png`} alt="img" /></a>
                             </div>
                          </div>
                          <div className="col-lg-8 col-md-8 col-sm-6 col-12">
                             <div className="top-right-section">
                                <ul>
                                   <li>
                                      <a href="javascript:;"><i className="fas fa-phone"></i></a>
                                      <a href="javascript:;">Call Us 24/7<br />
                                         +80 (234) 123 567 12
                                      </a>
                                   </li>
                                   <li className="border-none pe-0">
                                      <a href="javascript:;"><i className="fas fa-map-marker-alt"></i></a>
                                      <a href="javascript:;">Mon - Fri: 8:00 - 20:00<br />
                                         Sat - Sun: 9:00 - 16:00</a>
                                   </li>
                                   <li>
                                      <a href="appoinment.html" className="home3-btn">Appoinment</a>
                                   </li>
                                   <li>
                                      <a href="javascript:;" className="openBtn" onclick="openSearch()"><i
                                            className="fas fa-search search"></i></a>
                                   </li>
                                </ul>
                                <div id="myOverlay" className="overlay">
                                   <span className="closebtn" onclick="closeSearch()" title="Close Overlay">×</span>
                                   <div className="overlay-content">
                                      <form action="/action_page.php">
                                         <input type="text" placeholder="Search.." name="search" />
                                         <button type="submit"><i className="fas fa-search"></i></button>
                                      </form>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="menu-items-wrapper menu-item-wrapper3 d-xl-block d-lg-block d-md-none d-sm-none d-none">
                    <div className="container">
                       <div className="row">
                          <div className="col-lg-8 col-md-6">
                             <nav className="navbar navbar-expand-lg">
                                <ul className="navbar-nav">
                                   <li className="nav-item ps-rel">
                                      <a className="nav-link" href="javascript:;">Home
                                         <span><i className="fas fa-chevron-right"></i></span>
                                      </a>
                                      <ul className="dropdown-items">
                                         <li><a href="index.html">Home 01</a></li>
                                         <li><a href="index2.html">Home 02</a></li>
                                         <li><a href="index3.html">Home 03</a></li>
                                      </ul>
                                   </li>
                                   <li className="nav-item">
                                      <a className="nav-link" href="javascript:;">Pages
                                         <span><i className="fas fa-chevron-right"></i></span>
                                      </a>
                                      <ul className="dropdown-items">
                                         <li><a href="about-us.html">About Us</a></li>
                                         <li><a href="all-dr.html">Doctors</a></li>
                                         <li><a href="dr-single.html">Doctor single</a></li>
                                         <li><a href="appoinment.html">Appoinment</a></li>
                                         <li><a href="error404.html">404</a></li>
                                      </ul>
                                   </li>
                                   <li className="nav-item ps-rel">
                                      <a className="nav-link" href="javascript:;">Services
                                         <span><i className="fas fa-chevron-right"></i></span>
                                      </a>
                                      <ul className="dropdown-items">
                                         <li><a href="service.html">Service
                                            <span><i className="fas fa-chevron-right"></i></span>
                                         </a>
                                         <ul className="sub-dropdown">
                                            <li><a href="covid-single.html">Covid 19</a></li>
                                            <li><a href="stathoscope-single.html">Full Stathoscope</a></li>
                                            <li><a href="heart-specialist.html">Heart Specialist</a></li>
                                            <li><a href="blood-bank.html">Blood Bank</a></li>
                                            <li><a href="disable.html">For Disable</a></li>
                                            <li><a href="psychiatrist.html">Psychiatrist</a></li>
                                         </ul>
                                      </li>
                                         <li><a href="single-details.html">Service Details</a></li>
                                      </ul>
                                   </li>
                                   <li className="nav-item ps-rel">
                                      <a className="nav-link" href="javascript:;">Gallery
                                         <span><i className="fas fa-chevron-right"></i></span>
                                      </a>
                                      <ul className="dropdown-items">
                                         <li><a href="gallery.html">3 Columns</a></li>
                                         <li><a href="gallery2.html">4 Columns</a></li>
                                         <li><a href="gallery3.html">5 Columns</a></li>
                                      </ul>
                                   </li>
                                   <li className="nav-item ps-rel">
                                      <a className="nav-link" href="javascript:;">Blog
                                         <span><i className="fas fa-chevron-right"></i></span>
                                      </a>
                                      <ul className="dropdown-items">
                                         <li><a href="blog-left-sidebar.html">Blog Left-sidebar</a></li>
                                         <li><a href="blog-right-sidebar.html">Blog Right-sidebar</a></li>
                                         <li>
                                            <a href="javascript:;">Blog-single
                                               <span><i className="fas fa-chevron-right"></i></span>
                                            </a>
                                            <ul className="sub-dropdown">
                                               <li><a href="blog-single.html">Blog single</a></li>
                                               <li><a href="blog-single-slider.html">Blog single slider</a></li>
                                               <li><a href="blog-single-video.html">Blog single video</a></li>
                                            </ul>
                                         </li>
                                      </ul>
                                   </li>
                                   <li className="nav-item ps-rel">
                                      <a className="nav-link" href="javascript:;">Shortcode
                                         <span><i className="fas fa-chevron-right"></i></span>
                                      </a>
                                      <div className="dropdown-items mega-menu">
                                         <ul>
                                            <li><a href="accordion.html">Accordion</a></li>
                                            <li><a href="client.html">Client</a></li>
                                            <li><a href="counter.html">Counter</a></li>
                                            <li><a href="form.html">Form</a></li>
                                         </ul>
                                         <ul>
                                            <li><a href="alert.html">Alert</a></li>
                                            <li><a href="icon.html">Icon</a></li>
                                            <li><a href="list.html">List</a></li>
                                            <li><a href="pricing-table.html">Pricing Table</a></li>
                                         </ul>
                                         <ul>
                                            <li><a href="button.html">Button</a></li>
                                            <li><a href="tab.html">Tabs</a></li>
                                            <li><a href="team.html">Team</a></li>
                                            <li><a href="testimonials.html">Testimonial</a></li>
                                         </ul>
                                         <ul>
                                            <li><a href="portfolio.html">Portfolio</a></li>
                                            <li><a href="social-icon.html">Social Icon</a></li>
                                         </ul>
                                      </div>
                                   </li>
                                   <li className="nav-item">
                                      <a className="nav-link" href="contact-us.html">Contact Us</a>
                                   </li>
                                </ul>
                             </nav>
                          </div>
                          <div className="col-lg-4 col-md-6">
                             <ul
                                className="d-xl-flex d-lg-flex d-md-none d-sm-none d-none justify-content-end align-items-center social-media-icons">
                                <li>
                                   <ul className="d-xl-flex d-lg-flex d-md-none d-sm-none d-none">
                                      <li><a href="https://www.facebook.com/"><i className="fab fa-facebook-f"></i></a></li>
                                      <li><a href="https://twitter.com/"><i className="fab fa-twitter"></i></a></li>
                                      <li><a href="https://www.instagram.com/"><i className="fab fa-instagram"></i></a></li>
                                      <li><a href="https://in.pinterest.com/"><i className="fab fa-pinterest-p"></i></a></li>
                                   </ul>
                                </li>
                                <li className="login-btn home3-btn bg-white p-0">
                                   <span>
                                      <Link to="/login" className="p-0 text-dark">Login</Link>
                                      /
                                      <Link to="/register" className="p-0 text-dark">Register</Link>

                                   </span>
                                </li>
                             </ul>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mobile-menu-wrapper d-xl-none d-lg-none d-md-block d-sm-block">
                    <div className="container">
                       <div className="row">
                          <div className=" col-md-6 col-sm-6 col-6">
                             <div className="mobile-logo">
                                <a href="javascript:;">
                                   <img src={`${process.env.PUBLIC_URL}/images/logo3.png`} alt="img" />
                                </a>
                             </div>
                          </div>
                          <div className="col-md-6 col-sm-6 col-6">
                             <div className="d-flex  justify-content-end">
                                <div className="d-flex align-items-center">
                                   <div className="toggle-main-wrapper mt-2" id="sidebar-toggle">
                                      <span className="line"></span>
                                      <span className="line"></span>
                                      <span className="line"></span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div id="sidebar">
                    <div className="sidebar_logo">
                       <a href="javascript:;"><img src={`${process.env.PUBLIC_URL}/images/home3/logo4.png`} alt="img" /></a>
                    </div>
                    <div id="toggle_close">&times;</div>
                    <div id='cssmenu'>
                       <ul className="float_left">
                          <li className="has-sub">
                             <a href="javascript:;">Home</a>
                             <ul>
                                <li><a href="index.html">Home 01</a></li>
                                <li><a href="index2.html">Home 02</a></li>
                                <li><a href="index3.html">Home 03</a></li>
                             </ul>
                          </li>
                          <li><a href="about-us.html">about</a></li>
                          <li><a href="all-dr.html">Doctors</a></li>
                          <li><a href="dr-single.html">Doctor Single</a></li>
                          <li><a href="appoinment.html">Appointment</a></li>
                          <li className="has-sub">
                             <a href="javascript:;">Services</a>
                             <ul>
                                <li><a href="service.html">Service</a></li>
                                <li><a href="single-details.html">Service Details</a></li>
                             </ul>
                          </li>
                          <li className="has-sub">
                             <a href="javascript:;">Gallery</a>
                             <ul>
                                <li><a href="gallery.html">3 Columns</a></li>
                                <li><a href="gallery2.html">4 Columns</a></li>
                                <li><a href="gallery3.html">5 Columns</a></li>
                             </ul>
                          </li>
                          <li className="has-sub">
                             <a href="javascript:;">Blog</a>
                             <ul>
                                <li><a href="blog-left-sidebar.html">Blog Left-sidebar</a></li>
                                <li><a href="blog-right-sidebar.html">Blog Right-sidebar</a></li>
                                <li className="has-sub">
                                   <a className="sub-icon">Blog Single</a>
                                   <ul className="m-sub-dropdown">
                                      <li><a href="blog-single.html">Blog single</a></li>
                                      <li><a href="blog-single-slider.html">Blog single slider</a></li>
                                      <li><a href="blog-single-video.html">Blog single video</a></li>
                                   </ul>
                                </li>
                             </ul>
                          </li>
                          <li className="has-sub">
                             <a href="javascript:;">Shortcode</a>
                             <ul>
                                <li><a href="accordion.html">Accordion</a></li>
                                <li><a href="client.html">Client</a></li>
                                <li><a href="counter.html">Counter</a></li>
                                <li><a href="form.html">Form</a></li>
                                <li><a href="alert.html">Alert</a></li>
                                <li><a href="icon.html">Icon</a></li>
                                <li><a href="list.html">List</a></li>
                                <li><a href="pricing-table.html">Pricing Table</a></li>
                                <li><a href="button.html">Button</a></li>
                                <li><a href="tab.html">Tabs</a></li>
                                <li><a href="team.html">Team</a></li>
                                <li><a href="testimonials.html">Testimonial</a></li>
                                <li><a href="portfolio.html">Portfolio</a></li>
                                <li><a href="social-icon.html">Social Icon</a></li>
                             </ul>
                          </li>
                          <li><a href="contact-us.html">contact us</a></li>
                          <li className="border-none"><a href="error404.html">404</a></li>
                          <li className="input-group border-none my-3 mx-2">
                             <input type="text" className="form-control" placeholder="Search" />
                             <button className="btn btn-outline-secondary" type="button" id="button-addon2"><i
                                   className="fas fa-search"></i></button>
                          </li>
                          <li className="border-none">
                             <ul className="social-icon">
                                <li><a href="www.facebook.com"><i className="fab fa-facebook-f"></i></a></li>
                                <li><a href="www.twitter.com"><i className="fab fa-twitter"></i></a></li>
                                <li><a href="www.instagram.com"><i className="fab fa-instagram"></i></a></li>
                                <li><a href="www.pinterest.com"><i className="fab fa-pinterest-p"></i></a></li>
                             </ul>
                          </li>
                       </ul>
                    </div>
                 </div>

              </div>
           </div>
  );
}

export default Header;
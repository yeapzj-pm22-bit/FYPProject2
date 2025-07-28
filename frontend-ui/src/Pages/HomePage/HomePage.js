import './css/bootstrap.min.css';
import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import './css/HomePage.css';
//
import './css/responsive.css';
import './css/animate.css';
import './css/animate.min.css';
//import './css/bootstrap.min.css';
import './css/fonts.css';

import './css/font-awesome.css';
import './css/font-awesome.min.css';
import './css/magnific-popup.css';
import './css/owl.carousel.min.css';

import './css/owl.theme.default.min.css';
//import './css/responsive.css';
import '@fortawesome/fontawesome-free/css/all.min.css';



const blogData = [
  {
    img: 'images/blog-img1.jpg',
    day: '08',
    month: 'july',
    title: 'Spending More and Getting Less for Health Care',
    author: 'John Doe',
    comments: 2,
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    link: 'blog-single.html',
  },
  {
    img: 'images/blog-img2.jpg',
    day: '20',
    month: 'july',
    title: 'Aliq is notm hendr erit a augue insu image pellen tes',
    author: 'John Doe',
    comments: 2,
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    link: 'blog-single.html',
  },
  {
    img: 'images/blog-img3.jpg',
    day: '28',
    month: 'july',
    title: 'Brain damage is not caused by direct or Health Care',
    author: 'John Doe',
    comments: 2,
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    link: 'blog-single.html',
  },
];

const counterData = [
  {
    count: 4500,
    label: 'Happy Patients',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        {/* ... SVG paths from Happy Patients icon ... */}
        <circle cx="30" cy="26" r="2" />
        <circle cx="44" cy="26" r="2" />
        <path
                                   d="M58.016,52.722l-9.63-2.03C47.003,50.4,46,49.163,46,47.75v-2.023c5.392-2.913,9.223-8.355,9.893-14.727H57  c2.757,0,5-2.243,5-5s-2.243-5-5-5h-1c0-9.374-7.626-17-17-17H23c-0.834,0-1.564-0.508-1.862-1.295  c-0.165-0.435-0.61-0.694-1.067-0.637c-1.834,0.244-3.53,1.232-4.652,2.711c-1.133,1.493-1.611,3.352-1.347,5.232  c0.369,2.619,2.263,4.739,4.745,5.586C18.285,17.372,18,19.183,18,21h-1c-2.757,0-5,2.243-5,5c0,1.323,0.518,2.578,1.477,3.551  c0.17,0.164,0.345,0.311,0.523,0.445v5.189C13.686,35.072,13.352,35,13,35c-0.771,0-1.468,0.301-2,0.78C10.468,35.301,9.771,35,9,35  s-1.468,0.301-2,0.78C6.468,35.301,5.771,35,5,35c-1.654,0-3,1.346-3,3v23c0,0.553,0.447,1,1,1h16c0.553,0,1-0.447,1-1v-6.734  l0.222-0.389l5.804-1.228c0.15-0.032,0.29-0.088,0.435-0.132L36,57.601V62h2v-4.399l9.539-5.085  c0.145,0.045,0.284,0.101,0.435,0.132l9.632,2.03c1.369,0.286,2.685,0.87,3.805,1.688l1.18-1.615  C61.242,53.767,59.66,53.064,58.016,52.722z M45.527,51.321L37,55.867l-8.527-4.546C29.414,50.401,30,49.131,30,47.75v-1.103  C32.169,47.511,34.527,48,37,48s4.831-0.489,7-1.353v1.103C44,49.131,44.586,50.401,45.527,51.321z M37,46  c-8.349,0-15.296-6.054-16.719-14h33.437C52.296,39.946,45.349,46,37,46z M16,38V28c0-0.552,0.448-1,1-1s1,0.448,1,1v1v12h-2V38z   M20,37.434c0.779,1.564,1.766,3.002,2.927,4.286C22.404,41.277,21.737,41,21,41h-1V37.434z M57,23c1.654,0,3,1.346,3,3  s-1.346,3-3,3h-1v-6H57z M16.052,9.732c-0.19-1.349,0.15-2.679,0.96-3.744c0.673-0.888,1.598-1.512,2.649-1.801  C20.391,5.297,21.646,6,23,6h16c8.237,0,14.945,6.674,15,14.899c-2.279-0.465-4-2.484-4-4.899v-1c0-0.553-0.447-1-1-1H21.211  C18.612,14,16.395,12.165,16.052,9.732z M21.211,16H48c0,3.519,2.614,6.432,6,6.92V29c0,0.338-0.031,0.667-0.051,1H20.051  C20.031,29.667,20,29.338,20,29v-1v-7c0-1.687,0.276-3.371,0.79-5.019C20.93,15.989,21.069,16,21.211,16z M17,23h1v2.184  C17.686,25.072,17.352,25,17,25c-1.302,0-2.402,0.839-2.816,2.001C14.07,26.682,14,26.346,14,26C14,24.346,15.346,23,17,23z M13,37  c0.552,0,1,0.448,1,1v4c0,0.552-0.448,1-1,1s-1-0.448-1-1v-4C12,37.448,12.448,37,13,37z M9,37c0.552,0,1,0.448,1,1v4  c0,0.552-0.448,1-1,1s-1-0.448-1-1v-4C8,37.448,8.448,37,9,37z M4,38c0-0.552,0.448-1,1-1s1,0.448,1,1v4c0,0.552-0.448,1-1,1  s-1-0.448-1-1V38z M18.132,53.504C18.046,53.655,18,53.826,18,54v6H4V44.816C4.314,44.928,4.648,45,5,45c0.771,0,1.468-0.301,2-0.78  C7.532,44.699,8.229,45,9,45s1.468-0.301,2-0.78c0.532,0.48,1.229,0.78,2,0.78c0.624,0,1.204-0.192,1.685-0.52  C15.549,45.978,17.15,47,19,47h1v-2h-1c-1.304,0-2.416-0.836-2.829-2H21c0.552,0,1,0.448,1,1v2.734L18.132,53.504z M25.613,50.691  l-4.062,0.859l2.317-4.055C23.954,47.345,24,47.174,24,47v-3c0-0.608-0.184-1.173-0.497-1.646c1.32,1.334,2.833,2.474,4.497,3.373  v2.023C28,49.163,26.997,50.4,25.613,50.691z" />
                                <path
                                   d="M56,56H43c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h13c0.553,0,1-0.447,1-1v-4C57,56.447,56.553,56,56,56z M55,60H44v-2  h11V60z" />
      </svg>
    ),
  },
  {
    count: 200,
    label: 'Hospital Rooms',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path
                                   d="M61,20H48V3c0-0.553-0.448-1-1-1H17c-0.552,0-1,0.447-1,1v17H3c-0.552,0-1,0.447-1,1v40c0,0.553,0.448,1,1,1h58  c0.552,0,1-0.447,1-1V21C62,20.447,61.552,20,61,20z M4,22h12v38H4V22z M35,50v10h-6V50H35z M46,60h-9V50h2v-2H25v2h2v10h-9V4h28V60  z M60,60H48V22h12V60z" />
                                <path
                                   d="M51,32h6c0.552,0,1-0.447,1-1v-6c0-0.553-0.448-1-1-1h-6c-0.552,0-1,0.447-1,1v6C50,31.553,50.448,32,51,32z M52,26h4v4h-4  V26z" />
                                <path
                                   d="M51,42h6c0.552,0,1-0.447,1-1v-6c0-0.553-0.448-1-1-1h-6c-0.552,0-1,0.447-1,1v6C50,41.553,50.448,42,51,42z M52,36h4v4h-4  V36z" />
                                <path
                                   d="M51,52h6c0.552,0,1-0.447,1-1v-6c0-0.553-0.448-1-1-1h-6c-0.552,0-1,0.447-1,1v6C50,51.553,50.448,52,51,52z M52,46h4v4h-4  V46z" />
                                <path
                                   d="M13,24H7c-0.552,0-1,0.447-1,1v6c0,0.553,0.448,1,1,1h6c0.552,0,1-0.447,1-1v-6C14,24.447,13.552,24,13,24z M12,30H8v-4h4  V30z" />
                                <path
                                   d="M21,28h4c0.552,0,1-0.447,1-1v-4c0-0.553-0.448-1-1-1h-4c-0.552,0-1,0.447-1,1v4C20,27.553,20.448,28,21,28z M22,24h2v2h-2  V24z" />
                                <path
                                   d="M34,22h-4c-0.552,0-1,0.447-1,1v4c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-4C35,22.447,34.552,22,34,22z M33,26h-2v-2h2  V26z" />
                                <path
                                   d="M38,23v4c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-4c0-0.553-0.448-1-1-1h-4C38.448,22,38,22.447,38,23z M40,24h2v2h-2  V24z" />
                                <path
                                   d="M21,36h4c0.552,0,1-0.447,1-1v-4c0-0.553-0.448-1-1-1h-4c-0.552,0-1,0.447-1,1v4C20,35.553,20.448,36,21,36z M22,32h2v2h-2  V32z" />
                                <path
                                   d="M34,30h-4c-0.552,0-1,0.447-1,1v4c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-4C35,30.447,34.552,30,34,30z M33,34h-2v-2h2  V34z" />
                                <path
                                   d="M43,30h-4c-0.552,0-1,0.447-1,1v4c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-4C44,30.447,43.552,30,43,30z M42,34h-2v-2h2  V34z" />
                                <path
                                   d="M21,44h4c0.552,0,1-0.447,1-1v-4c0-0.553-0.448-1-1-1h-4c-0.552,0-1,0.447-1,1v4C20,43.553,20.448,44,21,44z M22,40h2v2h-2  V40z" />
                                <path
                                   d="M34,38h-4c-0.552,0-1,0.447-1,1v4c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-4C35,38.447,34.552,38,34,38z M33,42h-2v-2h2  V42z" />
                                <path
                                   d="M43,38h-4c-0.552,0-1,0.447-1,1v4c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-4C44,38.447,43.552,38,43,38z M42,42h-2v-2h2  V42z" />
                                <path
                                   d="M13,34H7c-0.552,0-1,0.447-1,1v6c0,0.553,0.448,1,1,1h6c0.552,0,1-0.447,1-1v-6C14,34.447,13.552,34,13,34z M12,40H8v-4h4  V40z" />
                                <path
                                   d="M13,44H7c-0.552,0-1,0.447-1,1v6c0,0.553,0.448,1,1,1h6c0.552,0,1-0.447,1-1v-6C14,44.447,13.552,44,13,44z M12,50H8v-4h4  V50z" />
                                <path
                                   d="M26,16h3v3c0,0.553,0.448,1,1,1h4c0.552,0,1-0.447,1-1v-3h3c0.552,0,1-0.447,1-1v-4c0-0.553-0.448-1-1-1h-3V7  c0-0.553-0.448-1-1-1h-4c-0.552,0-1,0.447-1,1v3h-3c-0.552,0-1,0.447-1,1v4C25,15.553,25.448,16,26,16z M27,12h3  c0.552,0,1-0.447,1-1V8h2v3c0,0.553,0.448,1,1,1h3v2h-3c-0.552,0-1,0.447-1,1v3h-2v-3c0-0.553-0.448-1-1-1h-3V12z" />
                                <rect x="42" y="56" width="2" height="2" />
                                <rect x="42" y="52" width="2" height="2" />
                                <rect x="42" y="48" width="2" height="2" />
      </svg>
    ),
  },
  {
    count: 450,
    label: 'Award Win',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
       <path d="M50,71c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S53.3,71,50,71z M50,79c-1.1,0-2-0.9-2-2s0.9-2,2-2c1.1,0,2,0.9,2,2
                                           S51.1,79,50,79z M75,91h-5.2L66,60.8c-0.1-1-1-1.8-2-1.8H52V43.5l10,5.3c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.2-0.4
                                           c0.6-0.4,0.9-1.2,0.8-2l-2.3-13.4l9.7-9.5c0.5-0.5,0.7-1.3,0.5-2s-0.9-1.3-1.6-1.4l-13.5-2l-6-12.2C51.5,5.4,50.8,5,50,5
                                           s-1.5,0.4-1.8,1.1l-6,12.2l-13.5,2c-0.8,0.1-1.4,0.6-1.6,1.4s0,1.5,0.5,2l9.7,9.5l-2.3,13.4c-0.1,0.8,0.2,1.5,0.8,2
                                           c0.6,0.4,1.4,0.5,2.1,0.2l10-5.3V59H36c-1,0-1.9,0.8-2,1.8L30.2,91H25c-1.1,0-2,0.9-2,2s0.9,2,2,2h7h36h7c1.1,0,2-0.9,2-2
                                           S76.1,91,75,91z M40.9,31.1l-7.6-7.4l10.5-1.5c0.7-0.1,1.2-0.5,1.5-1.1l4.7-9.5l4.7,9.5c0.3,0.6,0.9,1,1.5,1.1l10.5,1.5l-7.6,7.4
                                           c-0.5,0.5-0.7,1.1-0.6,1.8l1.8,10.5l-9.4-4.9c-0.3-0.2-0.6-0.2-0.9-0.2s-0.6,0.1-0.9,0.2l-9.4,4.9l1.8-10.5
                                           C41.6,32.2,41.4,31.6,40.9,31.1z M34.3,91l3.5-28h24.5l3.5,28H34.3z" />
      </svg>
    ),
  },
  {
    count: 20,
    label: 'Ambulance',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
       <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                                  <g id="Dribbble-Light-Preview" transform="translate(-300.000000, -5279.000000)">
                                     <g id="icons" transform="translate(56.000000, 160.000000)">
                                        <path
                                           d="M252,5124 L252,5125 L253,5125 C253.552,5125 254,5125.448 254,5126 C254,5126.552 253.552,5127 253,5127 L252,5127 L252,5128 C252,5128.552 251.552,5129 251,5129 C250.448,5129 250,5128.552 250,5128 L250,5127 L249,5127 C248.448,5127 248,5126.552 248,5126 C248,5125.448 248.448,5125 249,5125 L250,5125 L250,5124 C250,5123.448 250.448,5123 251,5123 C251.552,5123 252,5123.448 252,5124 L252,5124 Z M262,5130 L258,5130 L258,5126 L261,5126 C261.552,5126 262,5126.448 262,5127 L262,5130 Z M262,5134 L261.221,5134 C260.672,5133.39 259.885,5133 259,5133 C258.647,5133 258.314,5133.072 258,5133.184 L258,5132 L262,5132 L262,5134 Z M259,5137 C258.449,5137 258,5136.551 258,5136 C258,5135.449 258.449,5135 259,5135 C259.551,5135 260,5135.449 260,5136 C260,5136.551 259.551,5137 259,5137 L259,5137 Z M256,5134 L253.484,5134 C253.038,5132.278 251.487,5131 249.625,5131 C248.538,5131 247.556,5131.436 246.838,5132.142 C246.526,5132.448 246,5132.216 246,5131.779 L246,5122 C246,5121.448 246.448,5121 247,5121 L255,5121 C255.552,5121 256,5121.448 256,5122 L256,5134 Z M251.347,5136 C251,5136.595 250.362,5137 249.625,5137 C248.888,5137 248.25,5136.595 247.903,5136 C247.731,5135.705 247.625,5135.366 247.625,5135 C247.625,5134.634 247.731,5134.295 247.903,5134 C248.25,5133.405 248.888,5133 249.625,5133 C250.362,5133 251,5133.405 251.347,5134 C251.519,5134.295 251.625,5134.634 251.625,5135 C251.625,5135.366 251.519,5135.705 251.347,5136 L251.347,5136 Z M262,5124 L258,5124 L258,5121 C258,5119.895 257.105,5119 256,5119 L246,5119 C244.895,5119 244,5119.895 244,5121 L244,5134.234 C244,5135.209 244.791,5136 245.766,5136 C246.213,5137.722 247.763,5139 249.625,5139 C251.487,5139 253.037,5137.722 253.484,5136 L256,5136 C256,5137.657 257.343,5139 259,5139 C260.657,5139 262,5137.657 262,5136 C263.105,5136 264,5135.105 264,5134 L264,5126 C264,5124.895 263.105,5124 262,5124 L262,5124 Z">
                                        </path>
                                     </g>
                                  </g>
                               </g>
      </svg>
    ),
  },
];



function HomePage() {
const carouselOptions = {
    items: 1,
    margin: 20,
    autoplay: true,
    loop: true,
    dots: true,
    nav: false,
  };
  return (
    <div>
      {/* Preloader */}


      <a href="javascript:;" id="return-to-top" class="change-bg2"> <i class="fas fa-angle-double-up"></i></a>

      <Header />

        {/* banner section */}
        <div className="banner-main-wrapper3">
              <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                 <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active"
                       aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                       aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                       aria-label="Slide 3"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3"
                       aria-label="Slide 4"></button>
                 </div>
                 <div className="carousel-inner">
                    <div className="carousel-item active">
                       <div className="container">
                          <h4>We Are Here For You</h4>
                          <h2>Professional and Friendly<br/>
                             <span> Health Care</span> For You
                          </h2>
                          <p>It is a long established fact that a reader will be distracted by the readable content of
                             <br/>
                             a page when looking at its layout. The point of using Lorem Ipsum.
                          </p>
                          <div className=" d-flex justify-content-center align-items-center">
                             <a href="javascript:;" className="button-btn bg-yellow mt-4 me-4">book now
                                <span><i className="fas fa-angle-double-right"></i></span>
                             </a>
                             <div className="mt-4 ps-rel">
                                <button type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                   <span className="wrapper">
                                      <span className="waves-block">
                                         <span className="waves wave-1"></span>
                                         <span className="waves wave-2"></span>
                                         <span className="waves wave-3"></span>
                                      </span>
                                   </span>
                                   <img src={`${process.env.PUBLIC_URL}/images/home3/video-icon.png`} alt="img" className="ps-rel" />
                                </button>

                                <div className="modal  fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
                                   aria-hidden="true">
                                   <div className="modal-dialog modal-dialog-centered">
                                      <div className="modal-content">
                                         <button type="button" data-bs-dismiss="modal"><i className="fas fa-times"></i></button>
                                         <div className="modal-body p-0">
                                            <iframe height="315" src="https://www.youtube.com/embed/8jd9YnoekiI" title="YouTube video player"></iframe>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="container">
                          <h4>We Are Here For You</h4>
                          <h2>Professional and Friendly<br />
                             <span> Health Care</span> For You
                          </h2>
                          <p>It is a long established fact that a reader will be distracted by the readable content of
                             <br />
                             a page when looking at its layout. The point of using Lorem Ipsum.
                          </p>
                          <div className=" d-flex justify-content-center align-items-center">
                             <a href="appoinment.html" className="button-btn bg-yellow mt-4 me-4">book now
                                <span><i className="fas fa-angle-double-right"></i></span>
                             </a>
                             <a href="javascript:;" className="mt-4 ps-rel">
                                <div className="wrapper">
                                   <div className="waves-block">
                                      <div className="waves wave-1"></div>
                                      <div className="waves wave-2"></div>
                                      <div className="waves wave-3"></div>
                                   </div>
                                </div>
                                <img src={`${process.env.PUBLIC_URL}/images/home3/video-icon.png`} alt="img" className="ps-rel" />
                             </a>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="container">
                          <h4>We Are Here For You</h4>
                          <h2>Professional and Friendly<br />
                             <span> Health Care</span> For You
                          </h2>
                          <p>It is a long established fact that a reader will be distracted by the readable content of
                             <br />
                             a page when looking at its layout. The point of using Lorem Ipsum.
                          </p>
                          <div className=" d-flex justify-content-center align-items-center">
                             <a href="javascript:;" className="button-btn bg-yellow mt-4 me-4">book now
                                <span><i className="fas fa-angle-double-right"></i></span>
                             </a>
                             <a href="javascript:;" className="mt-4 ps-rel">
                                <div className="wrapper">
                                   <div className="waves-block">
                                      <div className="waves wave-1"></div>
                                      <div className="waves wave-2"></div>
                                      <div className="waves wave-3"></div>
                                   </div>
                                </div>
                                <img src="images/home3/video-icon.png" alt="img" className="ps-rel" />
                             </a>
                          </div>
                       </div>
                    </div>
                    <div className="carousel-item">
                       <div className="container">
                          <h4>We Are Here For You</h4>
                          <h2>Professional and Friendly<br />
                             <span> Health Care</span> For You
                          </h2>
                          <p>It is a long established fact that a reader will be distracted by the readable content of
                             <br />
                             a page when looking at its layout. The point of using Lorem Ipsum.
                          </p>
                          <div className=" d-flex justify-content-center align-items-center">
                             <a href="javascript:;" className="button-btn bg-yellow mt-4 me-4">book now
                                <span><i className="fas fa-angle-double-right"></i></span>
                             </a>
                             <a href="javascript:;" className="mt-4 ps-rel">
                                <div className="wrapper">
                                   <div className="waves-block">
                                      <div className="waves wave-1"></div>
                                      <div className="waves wave-2"></div>
                                      <div className="waves wave-3"></div>
                                   </div>
                                </div>
                                <img src={`${process.env.PUBLIC_URL}/images/home3/video-icon.png`} alt="img" className="ps-rel" />
                             </a>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        {/* banner section */}

        {/*Service Section */}
         <div className="about-main-wrapper float_left service-section3">
              <div className="container">
                <div className="row plr-50">
                  {/* Box 1 */}
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="sb-about-section">
                      <div className="icon">
                        {/* SVG Icon 1 */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path
                            className="cls-1"
                            fill="#fff"
                            d="M512,256a89.59..."
                          />
                        </svg>
                      </div>
                      <div className="content">
                        <h5>Medical Counseling</h5>
                        <p>It is a long established fact that a reader will be distracted by the readable.</p>
                        <a href="service.html">Read More +</a>
                      </div>
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="sb-about-section">
                      <div className="icon bg-color1">
                        {/* SVG Icon 2 */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path
                            className="cls-1"
                            fill="#fff"
                            d="M320,310.18..."
                          />
                        </svg>
                      </div>
                      <div className="content">
                        <h5>Qualified Doctors</h5>
                        <p>It is a long established fact that a reader will be distracted by the readable.</p>
                        <a href="service.html">Read More +</a>
                      </div>
                    </div>
                  </div>

                  {/* Box 3 */}
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="sb-about-section">
                      <div className="icon bg-color2">
                        {/* SVG Icon 3 */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path
                            className="cls-1"
                            fill="#fff"
                            d="M434.76,218.33..."
                          />
                        </svg>
                      </div>
                      <div className="content">
                        <h5>Emergency Services</h5>
                        <p>It is a long established fact that a reader will be distracted by the readable.</p>
                        <a href="service.html">Read More +</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Service Section */}


            {/* About Section */}
            <div className="image-about-wrapper about-main-wrapper3 ptb-100 pt-0 float_left">
                  <div className="container ">
                     <div className="row ">
                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                           <div className="about-content ">
                              <h6 className="home1-section-heading1 text-start text-color-change3">About Us</h6>
                              <h4>Professional Health and Medical
                                 Care in Full Measure
                              </h4>
                              <p className="py-3">
                                 It is a long established fact that a reader will be distracted by the readable content of a
                                 page when looking at its layout. The point of using Lorem Ipsum is that it has a
                                 more-or-less normal distribution of letters, as opposed to using 'Content here, content
                                 here', making it look like readable English.
                              </p>
                              <p>
                                 It is a long established fact that a reader will be distracted by the readable
                                 content of a page when looking at its layout.
                              </p>
                              <a href="about-us.html" className="button-btn bg-yellow mt-4">read more
                                 <span><i className="fas fa-angle-double-right"></i></span>
                              </a>
                           </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                           <div className="image-section ps-rel animate-top-y">
                              <img src={`${process.env.PUBLIC_URL}/images/home3/about-image3.png`} className="img-fluid d-xl-block d-lg-block d-none" alt="img" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
                {/* About Section */}



                {/* our gallery section */}
               <div className="gallery-box-section gallery-main-wrapper float_left">
                     <div className="container">
                        <div className="row">
                           <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                              <div className="mb-5">
                                 <h6 className="home1-section-heading1 text-color-change3">Our Services</h6>
                                 <h5 className="home1-section-heading2 ">Sefety And Comfortable</h5>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="portfolio_img_wrapper">
                                 <div className="portfolio_img">
                                    <img src={`${process.env.PUBLIC_URL}/images/gallery-img1.jpg`} className="img-responsive" alt="team1_img" />
                                    <div className="portfolio_img_overlay overlay-color">
                                       <div className="portfolio_img_text">
                                          <a href="images/gallery-img1.jpg" title="image3" className="img-link">
                                             <img src={`${process.env.PUBLIC_URL}/images/plus-Icon.png`} alt="img" aria-hidden="true" />
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="portfolio_img_wrapper">
                                 <div className="portfolio_img">
                                    <img src={`${process.env.PUBLIC_URL}/images/gallery-img2.jpg`} className="img-responsive" alt="team1_img" />
                                    <div className="portfolio_img_overlay overlay-color">
                                       <div className="portfolio_img_text">
                                          <a href="images/gallery-img2.jpg" title="image4" className="img-link">
                                             <img src={`${process.env.PUBLIC_URL}/images/plus-Icon.png`} alt="img" aria-hidden="true" />
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="portfolio_img_wrapper">
                                 <div className="portfolio_img">
                                    <img src={`${process.env.PUBLIC_URL}/images/gallery-img3.jpg`} className="img-responsive" alt="team1_img" />
                                    <div className="portfolio_img_overlay overlay-color">
                                       <div className="portfolio_img_text">
                                          <a href="images/gallery-img3.jpg" title="image5" className="img-link">
                                             <img src={`${process.env.PUBLIC_URL}/images/plus-Icon.png`} alt="img" aria-hidden="true" />
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="portfolio_img_wrapper">
                                 <div className="portfolio_img">
                                    <img src={`${process.env.PUBLIC_URL}/images/gallery-img4.jpg`} className="img-responsive" alt="team1_img" />
                                    <div className="portfolio_img_overlay overlay-color">
                                       <div className="portfolio_img_text">
                                          <a href="images/gallery-img4.jpg" title="image6" className="img-link">
                                             <img src={`${process.env.PUBLIC_URL}/images/plus-Icon.png`} alt="img" aria-hidden="true" />
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="portfolio_img_wrapper">
                                 <div className="portfolio_img">
                                    <img src={`${process.env.PUBLIC_URL}/images/gallery-img5.jpg`} className="img-responsive" alt="team1_img" />
                                    <div className="portfolio_img_overlay overlay-color">
                                       <div className="portfolio_img_text">
                                          <a href="images/gallery-img5.jpg" title="image1" className="img-link">
                                             <img src={`${process.env.PUBLIC_URL}/images/plus-Icon.png`} alt="img" aria-hidden="true" />
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                              <div className="portfolio_img_wrapper">
                                 <div className="portfolio_img">
                                    <img src={`${process.env.PUBLIC_URL}/images/gallery-img6.jpg`} className="img-responsive" alt="team1_img" />
                                    <div className="portfolio_img_overlay overlay-color">
                                       <div className="portfolio_img_text">
                                          <a href="images/gallery-img6.jpg" title="image2" className="img-link">
                                              <img src={`${process.env.PUBLIC_URL}/images/plus-Icon.png`} alt="img" aria-hidden="true" />
                                          </a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-12 col-md-12 col-12">
                              <div className="text-center mt-3">
                                 <a href="gallery.html" className="button-btn bg-yellow mt-4">view gallery
                                    <span><i className="fas fa-angle-double-right"></i></span>
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                {/* our gallery section */}





                 <div className="about-gallery-main3 float_left">
                      <div className="container">
                         <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                               <h6 className="home1-section-heading1 text-color-yellow">Our Services</h6>
                               <h5 className="home1-section-heading2 text-color-white pt-1 pb-3">We care about everything what you want
                               </h5>
                               <p className="text-color-white text-center">It is a long established fact that a reader will be
                                  distracted by the readable content of<br />
                                  a page when looking at its layout. The point of using Lorem Ipsum.
                               </p>
                               <div className=" d-flex justify-content-center align-items-center">
                                  <a href="about-us.html" className="button-btn bg-yellow mt-5 me-4">about us
                                     <span><i className="fas fa-angle-double-right"></i></span>
                                  </a>
                                  <div className="mt-5 ps-rel">
                                     <div data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                                        <div className="wrapper">
                                           <div className="waves-block">
                                              <div className="waves wave-1"></div>
                                              <div className="waves wave-2"></div>
                                              <div className="waves wave-3"></div>
                                           </div>
                                        </div>
                                        <img src={`${process.env.PUBLIC_URL}/images/home3/video-icon2.png`} alt="img" className="ps-rel" />
                                     </div>
                                     <div className="modal  fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false"
                                        tabindex="-1" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                           <div className="modal-content">
                                              <button type="button" data-bs-dismiss="modal"><i className="fas fa-times"></i></button>
                                              <div className="modal-body p-0">
                                                 <iframe height="315" src="https://www.youtube.com/embed/8jd9YnoekiI" title="YouTube video player"></iframe>
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                    {/*Service*/}


                    {/*Team*/}
                    <div className="our-team-main3 float_left ptb-100">
                          <div className="container">
                             <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                   <div className="mb-5">
                                      <h6 className="home1-section-heading1 text-color-change3">Our Team</h6>
                                      <h5 className="home1-section-heading2 ">Our Dedicated Doctors</h5>
                                   </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                   <section>
                                      <div className="sb-team3">
                                         <a href="dr-single.html"><img src={`${process.env.PUBLIC_URL}/images/home3/team-img31.jpg`} className="w-100" alt="img" /></a>
                                      </div>
                                      <div className="team-box">
                                         <div className="icon">
                                            <h6>Dr. Joshua Carter</h6>
                                            <p>Psychiatrist</p>
                                         </div>
                                         <div className="details">
                                            <ul className="d-flex justify-content-between align-items-center">
                                               <li><a href="javascript:;"><i className="fab fa-facebook-f"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-instagram"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-twitter"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-pinterest-p"></i></a></li>
                                            </ul>
                                         </div>
                                      </div>
                                   </section>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                   <section>
                                      <div className="sb-team3">
                                         <a href="dr-single.html"><img src={`${process.env.PUBLIC_URL}/images/home3/team-img34.jpg`} className="w-100" alt="img" /></a>
                                      </div>
                                      <div className="team-box">
                                         <div className="icon">
                                            <h6>Dr. Susan Pearson</h6>
                                            <p>Psychiatrist</p>
                                         </div>
                                         <div className="details">
                                            <ul className="d-flex justify-content-between align-items-center">
                                               <li><a href="javascript:;"><i className="fab fa-facebook-f"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-instagram"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-twitter"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-pinterest-p"></i></a></li>
                                            </ul>
                                         </div>
                                      </div>
                                   </section>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                   <section>
                                      <div className="sb-team3">
                                         <a href="dr-single.html"><img src={`${process.env.PUBLIC_URL}/images/home3/team-img32.jpg`} className="w-100" alt="img" /></a>
                                      </div>
                                      <div className="team-box">
                                         <div className="icon">
                                            <h6>Dr. Donna Sisk</h6>
                                            <p>Psychiatrist</p>
                                         </div>
                                         <div className="details">
                                            <ul className="d-flex justify-content-between align-items-center">
                                               <li><a href="javascript:;"><i className="fab fa-facebook-f"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-instagram"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-twitter"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-pinterest-p"></i></a></li>
                                            </ul>
                                         </div>
                                      </div>
                                   </section>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                   <section>
                                      <div className="sb-team3">
                                         <a href="dr-single.html"><img src={`${process.env.PUBLIC_URL}/images/home3/team-img33.jpg`} className="w-100" alt="img" /></a>
                                      </div>
                                      <div className="team-box">
                                         <div className="icon">
                                            <h6>Dr. Joshua Carter</h6>
                                            <p>Psychiatrist</p>
                                         </div>
                                         <div className="details">
                                            <ul className="d-flex justify-content-between align-items-center">
                                               <li><a href="javascript:;"><i className="fab fa-facebook-f"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-instagram"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-twitter"></i></a></li>
                                               <li><a href="javascript:;"><i className="fab fa-pinterest-p"></i></a></li>
                                            </ul>
                                         </div>
                                      </div>
                                   </section>
                                </div>
                             </div>
                          </div>
                       </div>
                    {/*Team*/}


                    {/*Counter */}
                    <div className="counter-main-wrapper counter-main3 float_left">
                          <div className="container">
                            <div className="row">
                              {counterData.map((item, index) => (
                                <div key={index} className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                  <div className="count-up">
                                    <div className="counter-icon bg-border-yellow">
                                      {item.svg}
                                    </div>
                                    <h3 className="counter-count text-color-black">{item.count}</h3>
                                    <p className="text-color-black">{item.label}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        {/*Counter*/}


                        {/*Blog*/}
                        <div className="blog-main-wrapper blog-main3">
                              <div className="container">
                                <div className="row">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                    <div>
                                      <h6 className="home1-section-heading1 text-color-change3">Our Blog</h6>
                                      <h5 className="home1-section-heading2">Our Latest News</h5>
                                    </div>
                                  </div>
                                  {blogData.map((blog, index) => (
                                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 col-12">
                                      <div className="blog-box">
                                        <div className="img-icon">
                                          <img src={blog.img} alt="img" />
                                          <div className="img-overlay"></div>
                                          <p className="bg-yellow text-center">
                                            {blog.day}
                                            <br />
                                            {blog.month}
                                          </p>
                                        </div>
                                        <div className="blog-content">
                                          <h3>
                                            <a href={blog.link}>{blog.title}</a>
                                          </h3>
                                          <ul>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-user text-yellow"></i> by {blog.author}
                                              </a>
                                            </li>
                                            <li>
                                              <a href="#">
                                                <i className="fas fa-comments text-yellow"></i> Comments {blog.comments.toString().padStart(2, '0')}
                                              </a>
                                            </li>
                                          </ul>
                                          <p>{blog.description}</p>
                                          <a href={blog.link} className="r-btn text-yellow">
                                            Read More
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                        {/*Bloh*/}



                        <Footer />
    </div>
  );
}

export default HomePage;

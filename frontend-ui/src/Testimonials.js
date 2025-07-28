import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const testimonials = [
  {
    name: "Saul Goodman",
    title: "Ceo & Founder",
    img: "assets/img/testimonials/testimonials-1.jpg",
    quote:
      "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus...",
  },
  {
    name: "Sara Wilsson",
    title: "Designer",
    img: "assets/img/testimonials/testimonials-2.jpg",
    quote:
      "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum...",
  },
  {
    name: "Jena Karlis",
    title: "Store Owner",
    img: "assets/img/testimonials/testimonials-3.jpg",
    quote:
      "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla...",
  },
  {
    name: "Matt Brandon",
    title: "Freelancer",
    img: "assets/img/testimonials/testimonials-4.jpg",
    quote:
      "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim...",
  },
  {
    name: "John Larson",
    title: "Entrepreneur",
    img: "assets/img/testimonials/testimonials-5.jpg",
    quote:
      "Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor...",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials section">
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-lg-5 info"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3>Testimonials</h3>
            <p>
              Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
              aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur...
            </p>
          </div>

          <div className="col-lg-7" data-aos="fade-up" data-aos-delay="200">
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={true}
              speed={600}
              autoplay={{ delay: 5000 }}
              slidesPerView="auto"
              pagination={{ clickable: true }}
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="testimonial-item">
                    <div className="d-flex">
                      <img
                        src={item.img}
                        className="testimonial-img flex-shrink-0"
                        alt={item.name}
                      />
                      <div>
                        <h3>{item.name}</h3>
                        <h4>{item.title}</h4>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill"></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p>
                      <i className="bi bi-quote quote-icon-left"></i>
                      <span>{item.quote}</span>
                      <i className="bi bi-quote quote-icon-right"></i>
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useEffect } from 'react'
import './About.css'

// animate component
import AOS from "aos"
import "aos/dist/aos.css"

const About = () => {

  useEffect(() => {
    AOS.init({
        disable: 'phone',
        once: true
    });
    AOS.refresh();
  }, []);

  return (
    <section className="py-3 py-md-5 about-container">
      <div className="container">
        <div className="row gy-3 gy-md-4 gy-lg-0 align-items-lg-center">
          <div className="col-12 col-lg-6 col-xl-5">
            <img className="rounded-circle border border-1" data-aos='fade-in' loading="lazy" src="/me.png" alt="myself" />
          </div>
          <div className="col-12 col-lg-6 col-xl-7">
            <div className="row justify-content-xl-center">
              <div className="col-12 col-xl-11">
                <h2 className="mb-3 fs-1 fw-bold" data-aos='fade-right' data-aos-delay="100">Meet the developer !</h2>
                <div data-aos='fade-down' data-aos-delay="200">
                  <p className="lead fs-5 text-secondary text-start text-break">Hi, I'm creator of the web. This is my report of coursework COMP1842 - Web Programming 2.</p>
                  <p className="mt-4 fst-italic">Pham Nguyen Duc Minh, class CO1103. FGW-HN, Vietnam.</p>
                </div>                                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

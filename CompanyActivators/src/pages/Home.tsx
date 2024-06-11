import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ModelViewer from "../components/ModelViewer";
import ContactForm from '../components/ContactForm';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [showVisuals, setShowVisuals] = useState(false); // New state to manage checkbox
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]); // State to store projects
  const [partners, setPartners] = useState([]); // State to store partners
  const [currentSlide, setCurrentSlide] = useState(0); // State to keep track of the current slide
  const [wrapperMargin, setWrapperMargin] = useState(0); // State to store the calculated margin
  const [menuStart, setMenuStart] = useState(140);
  const [topMenuDrop, setTopMenuDrop] = useState(65);
  const [lastTopCheck, setLastTopCheck] = useState(10); 
  const [lastTopMenu, setLastTopMenu] = useState(-6); 
  const [widthGoogle, setWidthGoogle] = useState(520); 
  const [heightGoogle, setHeightGoogle] = useState(300); 
  const [isAnimationActive, setIsAnimationActive] = useState(true); // State to manage animations
  const [showModelViewer, setShowModelViewer] = useState(true); // State to show/hide ModelViewer
  const [containerHeight, setContainerHeight] = useState("200vh");
  const [screenHeightTooSmall, setScreenHeightTooSmall] = useState(false); // New state for screen height

  const scrollY = useMotionValue(0);
  const companyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    const fetchPartners = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/partners");
        const data = await response.json();
        setPartners(data);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      }
    };

    fetchProjects();
    fetchPartners();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  function getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  }

  const calculateWrapperMargin = () => {
    if (companyRef.current) {
      const text = companyRef.current.innerText;
      const font = getComputedStyle(companyRef.current).font;
      const textWidth = getTextWidth(text, font);
      console.log(textWidth)
      const screenWidth = window.innerWidth;
      const x = screenWidth - textWidth;
      const margin = x / 2;
      setWrapperMargin(margin);
      localStorage.setItem('wrapperMargin', margin.toString());
    }
  };

  useEffect(() => {
    const updateMenuStart = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setIsAnimationActive(width >= 768 && height >= 600);
      setShowModelViewer(width >= 768 && height >= 600);
      setContainerHeight(width >= 768 && height >= 600 ? "200vh" : "100vh");

      if(width <= 540) {
        setWidthGoogle(270);
        setHeightGoogle(200);
        setTopMenuDrop(-15);
      } else if(width <= 768){
        setWidthGoogle(200);
        setHeightGoogle(200);
        setTopMenuDrop(10); 
      } else if (width <= 1090) {
        setMenuStart(75);
        setTopMenuDrop(30);
        setLastTopCheck(-3);
        setWidthGoogle(250);
        setHeightGoogle(295);
        setLastTopMenu(-3)
      } else if (width <= 1360) {
        setMenuStart(100);
        setTopMenuDrop(50);
        setLastTopCheck(-3);
        setWidthGoogle(450);
        setHeightGoogle(300);
        setLastTopMenu(-6)
      } else {
        setMenuStart(140);
        setTopMenuDrop(65);
        setLastTopCheck(10);
        setWidthGoogle(520);
        setHeightGoogle(300);
        setLastTopMenu(-6)
      }
    };

    updateMenuStart();
    calculateWrapperMargin();

    window.addEventListener("resize", calculateWrapperMargin);
    window.addEventListener("resize", updateMenuStart);

    return () => {
      window.removeEventListener("resize", calculateWrapperMargin);
      window.removeEventListener("resize", updateMenuStart);
    };
  });

  const companyX = useTransform(scrollY, [0, window.innerHeight], [0, -window.innerWidth]);
  const activatorsX = useTransform(scrollY, [0, window.innerHeight], [0, window.innerWidth]);
  const menuTop = useTransform(scrollY, [600, window.innerHeight], [menuStart, lastTopMenu]);
  const checkboxTop = useTransform(scrollY, [600, window.innerHeight], [menuStart, lastTopCheck]);
  const backgroundColor = useTransform(
    scrollY,
    [500, window.innerHeight],
    darkMode ? ["transparent", "#000000"] : ["transparent", "#FCFAEE"]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 1;
      });
    }, 30); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
      setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isMenuOpen]);

  // Check for screen height and set state accordingly
  useEffect(() => {
    const checkScreenHeight = () => {
      if (window.innerHeight < 500) {
        setScreenHeightTooSmall(true);
      } else {
        setScreenHeightTooSmall(false);
      }
    };

    checkScreenHeight();
    window.addEventListener('resize', checkScreenHeight);

    return () => {
      window.removeEventListener('resize', checkScreenHeight);
    };
  }, []);

  const transition = { type: "spring", stiffness: 20, damping: 10 };

  const handleScrollToSection = (ref) => {
    const offsetTop = ref.current.offsetTop - 50;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
    setIsMenuOpen(false);
  };

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    afterChange: (index) => setCurrentSlide(index) 
  };

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <>
      {screenHeightTooSmall && (
        <div className="message-container">
          <p>Please rotate your phone/ tablet and refresh the page or change your device to be able to navigate on this website. Your screen height does not match our requirements.</p>
        </div>
      )}
      {!screenHeightTooSmall && loading && (
        <div className="loading-screen">
          <img src={darkMode ? "/hoofd-black.jpg" : "/hoofd.jpg"} alt="Loading" className="loading-image" />
          <p className="loading-text">Loading...</p>
          <div className="loading-bar">
            <div className="loading-progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="loading-percentage">{progress}%</p>
        </div>
      )}
      {!loading && (
        <div>
          <div style={{ height: containerHeight, display: "flex", justifyContent: "center" }}>
            {isAnimationActive ? (
              <>
                <motion.div
                  className="company"
                  ref={companyRef}
                  style={{
                    position: "fixed",
                    x: companyX,
                    zIndex: 100,
                    opacity: 1,
                  }}
                  transition={transition}
                >
                  COMPANY
                </motion.div>
                <motion.div
                  className="activators"
                  style={{
                    position: "fixed",
                    x: activatorsX,
                    opacity: 1,
                    zIndex: 100,
                  }}
                  transition={transition}
                >
                  ACTIVATORS
                </motion.div>
              </>
            ) : (
              <>
                <div
                  className="company"
                  ref={companyRef}
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    opacity: 1,
                  }}
                >
                  COMPANY
                </div>
                <div
                  className="activators"
                  style={{
                    position: "absolute",
                    opacity: 1,
                    zIndex: 100,
                  }}
                >
                  ACTIVATORS
                </div>
              </>
            )}
            {showModelViewer ? (
              <div style={{ zIndex: 99 }}>
                <ModelViewer scrollY={scrollY} />
              </div>
            ) : (
              <div className="image-home" style={{ zIndex: 99, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <img src={darkMode ? "/hoofd-black.jpg" : "/hoofd.jpg"} alt="Placeholder" />
              </div>
            )}
          </div>
          {isAnimationActive ? (
            <>
              <motion.div
                className="container-checkbox"
                style={{
                  position: "fixed",
                  top: checkboxTop,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: backgroundColor,
                  zIndex: 101,
                }}
                transition={transition}
              >
                <p className="text-checkbox">Light mode</p>
                <input
                  type="checkbox"
                  className="theme-checkbox"
                  onChange={() => setDarkMode(!darkMode)}
                  checked={darkMode}
                />
                <p className="text-checkbox">Dark mode</p>
              </motion.div>
              <motion.div
                className="sayhi"
                style={{
                  position: "fixed",
                  top: menuTop,
                  left: `${wrapperMargin}px`,
                  opacity: 1,
                  zIndex: 100,
                  backgroundColor: backgroundColor,
                }}
                transition={transition}
              >
                SAY HI
              </motion.div>
              <motion.div
                className="menu"
                style={{
                  position: "fixed",
                  top: menuTop,
                  right: `${wrapperMargin}px`,
                  opacity: 1,
                  zIndex: 100,
                  backgroundColor: backgroundColor,
                  cursor: 'pointer',
                }}
                transition={transition}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                MENU
              </motion.div>
            </>
          ) : (
            <>
              <div
                className="container-checkbox"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: backgroundColor,
                  zIndex: 101,
                }}
              >
                <p className="text-checkbox">Light mode</p>
                <input
                  type="checkbox"
                  className="theme-checkbox"
                  onChange={() => setDarkMode(!darkMode)}
                  checked={darkMode}
                />
                <p className="text-checkbox">Dark mode</p>
              </div>
              <div
                className="sayhi"
                style={{
                  position: "absolute",
                  left: `${wrapperMargin}px`,
                  opacity: 1,
                  zIndex: 100,
                  backgroundColor: backgroundColor,
                }}
              >
                SAY HI
              </div>
              <div
                className="menu"
                style={{
                  position: "absolute",
                  right: `${wrapperMargin}px`,
                  opacity: 1,
                  zIndex: 100,
                  backgroundColor: backgroundColor,
                  cursor: 'pointer',
                }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                MENU
              </div>
            </>
          )}
          {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
          {isMenuOpen && (
            <div className="dropdown-menu" style={{ position: "fixed", top: menuTop.get() + topMenuDrop, right: `${wrapperMargin}px`, zIndex: 101, textAlign: "right" }}>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                <li style={{ margin: "10px 0" }}>
                  <a href="#services" onClick={() => handleScrollToSection(servicesRef)}>SERVICES</a>
                </li>
                <li style={{ margin: "10px 0" }}>
                  <a href="#projects" onClick={() => handleScrollToSection(projectsRef)}>PROJECTS</a>
                </li>
                <li style={{ margin: "10px 0" }}>
                  <a href="#about" onClick={() => handleScrollToSection(aboutRef)}>ABOUT</a>
                </li>
                <li style={{ margin: "10px 0" }}>
                  <a href="#contact" onClick={() => handleScrollToSection(contactRef)}>CONTACT</a>
                </li>
              </ul>
            </div>
          )}
          <div className="transition-service" ref={servicesRef} style={{
              margin: `0 ${wrapperMargin}px`,
            }}>
            <div className="transition-line-service"></div>
            <div className="transition-title-service">Services</div>
            <div className="transition-line-service"></div>
          </div>
          <div
            className="services"
            style={{
              margin: `100px ${wrapperMargin}px`,
            }}
          >
            <div className="service">
              <h3>Services</h3>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
            </div>
            <div className="marketing">
              <h3>Marketing</h3>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
              <img className="marketing-image" src="/images/img1.jpg" alt="img" />
            </div>
            <div className="name1">
              <h3>Name</h3>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
            </div>
            <div className="name2">
              <h3>Name</h3>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
            </div>
          </div>
          <div className="transition-projects" ref={projectsRef} style={{
              margin: `100px ${wrapperMargin}px`,
            }}>
            <div className="transition-line-projects"></div>
            <div className="transition-title-projects">Projects</div>
            <div className="transition-line-projects"></div>
          </div>
          <div className="projects" style={{
              margin: `0 ${wrapperMargin}px`,
            }}>
            <div className="container-checkbox1">
              <p className="text-checkbox1">Index</p>
              <input
                type="checkbox"
                className="theme-checkbox1"
                onChange={() => setShowVisuals(!showVisuals)}
              />
              <p className="text-checkbox2">Visuals</p>
            </div>
            <div className="index" style={{ display: showVisuals ? "none" : "block" }}>
              {projects.map((project) => (
                <Link to={`/project/${project.id}`} key={project.id}>
                  <div className="project">
                    <h3>{project.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="visuals" style={{ display: showVisuals ? "block" : "none" }}>
              {projects.map((project) => (
                <Link to={`/project/${project.id}`} key={project.id}>
                  <div className="project">
                    <img src={`/images/${project.visual}`} alt={project.name} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="transition-about" ref={aboutRef} style={{
              margin: `100px ${wrapperMargin}px`,
            }}>
            <div className="transition-line-about"></div>
            <div className="transition-title-about">About us</div>
            <div className="transition-line-about"></div>
          </div>
          <div className="about" style={{
              margin: `0 ${wrapperMargin}px`,
            }}>
            <div className="our-mission">
              <h3>Our Mission</h3>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
              <img src="/images/img1.jpg" alt="alt" />
            </div>
            <div className="our-story">
              <h3>Our Story</h3>
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
            </div>
            <div className="our-partners">
              <div className="left">
                <h3>Our Partners</h3>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using ‘Content here, content here’, making it look like readable English.</p>
              </div>
              <div className="right">
                <Slider {...sliderSettings}>
                  {partners.map((partner, index) => (
                    <div key={index}>
                      <a href={partner.link} target="_blank">
                        <img src={`/images/${partner.image}`} alt={`Partner ${index}`} />
                      </a>
                    </div>
                  ))}
                </Slider>
                <div className="citation">
                  <h1>{partners[currentSlide]?.name}</h1>
                  <p>"{partners[currentSlide]?.description}"</p>
                  <p>{partners[currentSlide]?.person}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="transition-contact" ref={contactRef} style={{
              margin: `100px ${wrapperMargin}px`,
            }}>
            <div className="transition-line-contact"></div>
            <div className="transition-title-contact">Contact</div>
            <div className="transition-line-contact"></div>
          </div>
          <div className="contact" style={{
              margin: `0 ${wrapperMargin}px 60px ${wrapperMargin}px`,
            }}>
            <div className="left-contact">
              <div className="contact-form">
                <h3>Contact form</h3>
              </div>
              <div className="form">
                <ContactForm />
              </div>
            </div>
            <div className="right-contact">
              <div className="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39963.20875793531!2d4.373725494466242!3d51.24300964563638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f63435c044a3%3A0xa9fd5c643a4787c5!2sKinepolis%20Antwerpen!5e0!3m2!1sfr!2sbe!4v1717331502618!5m2!1sfr!2sbe" width={widthGoogle} height={heightGoogle} loading="lazy"></iframe>
                <div className="black-box">
                  <ul>
                    <li><a href="https://www.linkedin.com/in/nicolascartilier/" target="_blank">
                      <div className="linked">
                        <img className="svg" src={darkMode ? "/images/linkedin-black.svg" : "/images/linkedin-white.svg"} alt="LinkedIn" />
                        <p>Company Activators</p>
                      </div>
                    </a></li>
                    <li><a href="https://www.instagram.com/company.activators" target="_blank">
                      <div className="linked">
                        <img className="svg" src={darkMode ? "/images/instagram-black.svg" : "/images/instagram-white.svg"} alt="Instagram" />
                        <p>company.activators</p>
                      </div>
                    </a></li>
                    <li><a href="#">
                      <div className="linked">
                        <img className="svg" src={darkMode ? "/images/facebook-black.svg" : "/images/facebook-white.svg"} alt="Facebook" />
                        <p>Company Activators</p>
                      </div>
                    </a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [numberImg, setNumberImg] = useState(2)
  const [arrows, setArrows] = useState(true)
  const [marginTop, setMarginTop] = useState("100px")
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const navigate = useNavigate();
  const [wrapperMargin, setWrapperMargin] = useState(() => {
    return parseFloat(localStorage.getItem('wrapperMargin')) || 0;
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const width = window.innerWidth;

    if(width < 330){
      setArrows(false)
    }

    if(width < 768){
      setMarginTop("50px")
    }else if(width < 1090){
      setMarginTop("80px")
    }

    if(width < 1360){
      setNumberImg(1)
    }
  }, [numberImg, arrows])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  if (!project) {
    return <div>Loading...</div>;
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: numberImg,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: arrows,
  };

  return (
    <div>
      <div className={`header ${darkMode ? 'dark-mode' : ''}`}>
        <div className="sayhi1" style={{ left: `${wrapperMargin}px` }}>SAY HI</div>
        <div className="container-checkbox2"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 101,
          }}
        >
          <p className="text-checkbox">Light mode</p>
          <input
            type="checkbox"
            className="theme-checkbox"
            onChange={() => setDarkMode(!darkMode)}
            style={{ border: "none"}}
            checked={darkMode}
          />
          <p className="text-checkbox">Dark mode</p>
        </div>
        <div className="back" onClick={() => navigate("/")} style={{ right: `${wrapperMargin}px` }}>BACK</div>
      </div>
      <div className="project-page" style={{ margin: `${marginTop} ${wrapperMargin}px 40px ${wrapperMargin}px` }}>
        <div className="project-name">
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
        <img src={`/images/${project.image}`} alt={project.name} />
        <div className="what">
          <h3>What</h3>
          <p>{project.what}</p>
        </div>
        <div className="more-images">
          <Slider {...settings}>
            {project.images.map((img, index) => (
              <div key={index}>
                <img src={`/images/${img}`} alt={`Project ${index}`} className="carousel-image" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Project;

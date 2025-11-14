import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";


const Button = () => {
  return (
    <StyledWrapper>
      <div className='flex items-center mt-20 text-center md:mt-40 flex-row c-space'>
  <a href="https://drive.google.com/file/d/1b3lutXKX0qocWcNs3BQV00lIqrR0z51C/view?usp=sharing" target="_blank" rel="noopener noreferrer">
    <button className="button">
      <div className="blob1" />
      <div className="blob2" />
      <div className="inner">My Resume</div>
    </button>
  </a>

  <a href="https://github.com/prajikta08" target="_blank" rel="noopener noreferrer">
    <button className="button">
      <div className="blob1" />
      <div className="blob2" />
      <div className="inner"> <FaGithub size={18} /></div>
    </button>
  </a>

  <a href="https://www.linkedin.com/in/prajikta-sati-40aa34283/"target="_blank" rel="noopener noreferrer" >
  <button className="button">
    <div className="blob1" />
    <div className="blob2" />
    <div className='inner'><FaLinkedin size={18} /></div>
  </button> </a>

</div>

      
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    margin-right: 16px;
    font-size: 1.1rem;   /* smaller text */
    border-radius: 14px;
    border: none;
    padding: 2px;
    background: radial-gradient(circle 70px at 80% -10%, #ffffff, #181b1b);
    position: relative;
    transition: background 0.3s, transform 0.3s;
  }

  a {
    display: inline-block;
    margin-right: 16px;
  }

  a:last-child {
    margin-right: 0;
  }

  .button:hover {
    transform: scale(0.96);
  }

  .button::after {
    content: "";
    position: absolute;
    width: 60%;
    height: 55%;
    border-radius: 120px;
    top: 0;
    right: 0;
    box-shadow: 0 0 16px #ffffff30;
    z-index: -1;
    transition: box-shadow 0.3s;
  }

  .button:hover::after {
    box-shadow: 0 0 8px #ffffff15;
  }

  /* 🔥 Yellow Glow Blob */
  .blob1 {
    position: absolute;
    width: 50px;                 /* smaller */
    height: 100%;
    border-radius: 16px;
    bottom: 0;
    left: 0;
    background: radial-gradient(
      circle 50px at 0% 100%,
      #ffe66d,          /* warm yellow */
      #f2c23daa,        /* golden glow */
      transparent
    );
    box-shadow: -10px 10px 25px #f7d75a3d;
    transition: background 0.3s, box-shadow 0.3s;
  }

  .button:hover .blob1 {
    box-shadow: -5px 5px 18px #00000066;
  }

  .inner {
    padding: 10px 18px;   /* smaller */
    border-radius: 12px;
    color: #fff;
    z-index: 3;
    position: relative;
    background: radial-gradient(circle 70px at 80% -50%, #666666, #0f1111);
    transition: background 0.3s;
  }

  .button:hover .inner {
    background: radial-gradient(circle 70px at 80% -50%, #333333, #0f0f0f);
  }

  .inner::before {
    content: "";
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 12px;
    background: radial-gradient(
      circle 50px at 0% 100%,
      #ffe66d1a,
      #f4c54211,
      transparent
    );
    position: absolute;
    transition: opacity 0.3s;
  }

  .button:hover .inner::before {
    opacity: 0;
  }
`;

export default Button;

import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";


const Button = () => {
  return (
    <StyledWrapper>
      <div className="flex flex-row items-center mt-5 text-center md:mt-30 c-space 
                justify-center md:justify-start gap-4">

        <a href="https://drive.google.com/file/d/1D8k8s_Lit9KDLro0TdqmMhkYaFD56g9I/view?usp=sharing" target="_blank" rel="noopener noreferrer">
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

        <a href="https://www.linkedin.com/in/prajikta-sati-40aa34283/" target="_blank" rel="noopener noreferrer" >
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
  /* =======================
     DESKTOP DEFAULT STYLING
     ======================= */
  .flex {
    justify-content: center;
    align-items: center;
  }

  .button {
    cursor: pointer;
    margin-right: 16px;
    font-size: 1.1rem;
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

  .blob1 {
    position: absolute;
    width: 50px;
    height: 100%;
    border-radius: 16px;
    bottom: 0;
    left: 0;
    background: radial-gradient(
      circle 50px at 0% 100%,
      #ffe66d,
      #f2c23daa,
      transparent
    );
    box-shadow: -10px 10px 25px #f7d75a3d;
    transition: 0.3s;
  }

  .inner {
    padding: 10px 18px;
    border-radius: 12px;
    color: #fff;
    z-index: 3;
    position: relative;
    background: radial-gradient(circle 70px at 80% -50%, #666666, #0f1111);
    transition: 0.3s;
  }

  /* =======================
         MOBILE FIXES
     ======================= */
  @media (max-width: 768px) {
    .div {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 30px !important;
      margin-left: auto;
      margin-right: auto;
   
    }

    .button {
      margin-right: 0;
      transform: scale(0.85);      /* smaller buttons */
    }

    .inner {
      padding: 8px 14px;           /* smaller padding */
      font-size: 0.9rem;           
    }

    .blob1 {
      width: 35px;                 /* smaller glow */
    }
  }
`;


export default Button;

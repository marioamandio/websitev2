import React, { useState, useEffect, FC } from "react";
import PropTypes from "prop-types";
import anime from "animejs";
import styled from "styled-components";

const StyledLoader = styled.div<{ isMounted: boolean }>`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;

  .logo-wrapper {
    width: max-content;
    transition: var(--transition);
    opacity: ${(props) => (props.isMounted ? 1 : 0)};
    padding: 12px;
    font-size: 40px;

    h5 {
      font-size: 80px;
      color: var(--green);
    }
  }
`;

const Loader: FC<{ finishLoading: () => void }> = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader
      .add({
        targets: "#logo path",
        delay: 300,
        duration: 1000,
        easing: "easeInOutQuart",
        strokeDashoffset: [anime.setDashoffset, 0],
      })
      .add({
        targets: "#logo #B",
        duration: 700,
        easing: "easeInOutQuart",
        opacity: 1,
      })
      .add({
        targets: "#logo",
        delay: 500,
        duration: 300,
        easing: "easeInOutQuart",
        opacity: 0,
        scale: 0.1,
      })
      .add({
        targets: ".loader",
        duration: 200,
        easing: "easeInOutQuart",
        opacity: 0,
        zIndex: -1,
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <div className="logo-wrapper">
        <h5>Welcome to my world!</h5>
        <p>Let&apos;s build something awesome together.</p>
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;

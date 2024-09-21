const SCROLL_UP = "up";
const SCROLL_DOWN = "down";

import { useState, useEffect } from "react";

const useScrollDirection = ({
  initialDirection,
  thresholdPixels,
  off,
} = {}) => {
  const [scrollDir, setScrollDir] = useState(initialDirection);

  useEffect(() => {
    const threshold = thresholdPixels || 0;
    let lastScrollY = typeof window !== "undefined" ? window.pageYOffset : 0;
    let ticking = false;

    const updateScrollDir = () => {
      let scrollY = 0;

      if (typeof window !== "undefined") {
        scrollY = window.pageYOffset;
      }

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        // We haven't exceeded the threshold
        ticking = false;
        return;
      }

      setScrollDir(scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(updateScrollDir);
        }
        ticking = true;
      }
    };

    /**
     * Bind the scroll handler if `off` is set to false.
     * If `off` is set to true reset the scroll direction.
     */
    if (!off) {
      if (typeof window !== "undefined") {
        window.addEventListener("scroll", onScroll);
      }
    } else {
      setScrollDir(initialDirection);
    }

    return () =>
      typeof window !== "undefined"
        ? window.removeEventListener("scroll", onScroll)
        : null;
  }, [initialDirection, thresholdPixels, off]);

  return scrollDir;
};

export default useScrollDirection;

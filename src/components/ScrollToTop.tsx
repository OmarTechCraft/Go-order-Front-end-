import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  // useLayoutEffect runs synchronously after all DOM mutations but before the browser paints.
  // This is ideal for scroll restoration to prevent any momentary flash of the page
  // at the old scroll position before jumping to the top.
  useLayoutEffect(() => {
    // Scrolls the window to the top-left corner (0,0)
    // 'instant' behavior ensures no smooth scrolling animation,
    // making the jump immediate, which is typically desired for page loads.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Change to 'smooth' if you want a scrolling animation
    });
  }, [pathname]); // This effect re-runs whenever the URL's path changes

  return null; // This component does not render any visible UI
};

export default ScrollToTop;

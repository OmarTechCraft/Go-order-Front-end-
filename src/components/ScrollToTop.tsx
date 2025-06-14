import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * This component listens for changes in the URL location (route changes)
 * and automatically scrolls the window to the very top of the page.
 * It's crucial for single-page applications where navigation
 * doesn't cause a full page reload, preventing users from landing
 * in the middle of a newly rendered page.
 */
const ScrollToTop: React.FC = () => {
  // `useLocation` hook from react-router-dom provides access to the current location object.
  // The location object changes whenever the route changes.
  const { pathname } = useLocation();

  // `useEffect` hook runs after every render.
  // The effect will re-run only when `pathname` changes,
  // indicating a route transition.
  useEffect(() => {
    // Scrolls the window to the top-left corner (0,0)
    // `behavior: 'auto'` means the scroll will be instantaneous,
    // which is generally desired for page transitions.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]); // Dependency array: Effect runs when `pathname` changes

  // This component doesn't render any UI, it just performs a side effect.
  return null;
};

export default ScrollToTop;

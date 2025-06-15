import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import "./Navbar.css";
import { getUserProfile, ProfileData } from "../../service/Profile_service";
import {
  getBusinessProfile,
  BusinessProfile,
} from "../../service/Profile_B_service";

// Declare global properties for Google Translate to prevent TypeScript errors
declare global {
  interface Window {
    google: any; // Google's global object
    googleTranslateElementInit: () => void; // Callback function for Google Translate
    doGTranslate: (lang_pair: string) => void; // Unofficial API function used for programmatic translation
    hideGoogleTranslateToolbar: () => void; // Our custom function to hide toolbar
  }
}

const fetchNotifications = async () => {
  try {
    const response = await fetch("/api/notifications");
    if (!response.ok) throw new Error("Failed to fetch notifications");
    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

const NotificationBell = ({ count }: { count: number }) => {
  return (
    <div className="notification-bell-icon">
      <FaBell size={18} />
      {count > 0 && <span className="notification-badge">{count}</span>}
    </div>
  );
};

interface SearchMatch {
  text: string;
  element: HTMLElement;
  position: number;
}

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      findMatches(searchQuery);
    } else {
      clearHighlights();
      setMatches([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (matches.length > 0) {
      highlightMatches();
      scrollToMatch(currentMatchIndex);
    }
  }, [matches, currentMatchIndex]);

  const findMatches = (query: string) => {
    if (query.trim().length === 0) return;

    clearHighlights();

    const searchText = query.toLowerCase();
    const matches: SearchMatch[] = [];

    // Get all text nodes in the document body excluding script and style elements
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Exclude script, style elements, and elements related to search bar itself or Google Translate
          if (
            parent.tagName === "SCRIPT" ||
            parent.tagName === "STYLE" ||
            parent.tagName === "NOSCRIPT" ||
            parent.classList.contains("search-input") ||
            parent.classList.contains("search-results-info") ||
            parent.closest("#google_translate_element") || // Exclude Google Translate widget container
            parent.closest(".goog-tooltip") || // Exclude Google Translate tooltips
            parent.closest(".skiptranslate") // Exclude elements used by Google Translate for skipping translation
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Only accept nodes with content that includes the search text
          if (
            node.textContent &&
            node.textContent.toLowerCase().includes(searchText)
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }

          return NodeFilter.FILTER_REJECT;
        },
      } as NodeFilter
    );

    let position = 0;
    let node;

    while ((node = walker.nextNode())) {
      const text = node.textContent || "";
      const parent = node.parentElement as HTMLElement;

      if (text.toLowerCase().includes(searchText)) {
        matches.push({
          text,
          element: parent,
          position: position,
        });
        position++;
      }
    }

    setMatches(matches);
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1);
  };

  const clearHighlights = () => {
    // Remove all existing highlight elements
    const highlights = document.querySelectorAll(".search-highlight");
    highlights.forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        // Replace the highlight element with its text content
        parent.replaceChild(document.createTextNode(el.textContent || ""), el);
        // Normalize the parent to merge adjacent text nodes
        parent.normalize();
      }
    });

    // Remove active highlight class
    const activeHighlight = document.querySelector(".search-highlight-active");
    if (activeHighlight) {
      activeHighlight.classList.remove("search-highlight-active");
    }
  };

  const highlightMatches = () => {
    clearHighlights();

    if (searchQuery.trim().length === 0 || matches.length === 0) return;

    const searchText = searchQuery.toLowerCase();

    matches.forEach((match, idx) => {
      const element = match.element;
      const text = element.innerHTML;

      // Create a regex to find all instances of the search text
      const regex = new RegExp(`(${searchText})`, "gi");

      // Replace with highlighted version
      const highlightedText = text.replace(regex, (match) => {
        const isActive = idx === currentMatchIndex;
        return `<span class="search-highlight ${
          isActive ? "search-highlight-active" : ""
        }">${match}</span>`;
      });

      element.innerHTML = highlightedText;
    });
  };

  const scrollToMatch = (index: number) => {
    if (index < 0 || index >= matches.length) return;

    const activeHighlight = document.querySelector(".search-highlight-active");
    if (activeHighlight) {
      activeHighlight.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded && searchInputRef.current) {
      // Focus the input when expanding
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const navigateToNextMatch = () => {
    if (matches.length === 0) return;

    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
  };

  const navigateToPrevMatch = () => {
    if (matches.length === 0) return;

    const prevIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prevIndex);
  };

  return (
    <>
      <div className={`search-container ${isSearchExpanded ? "expanded" : ""}`}>
        <div className="search-icon">
          <FaSearch size={16} />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search on page"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchQuery.trim().length > 0 && matches.length > 0 && (
          <div className="search-results-info">
            <span>
              {currentMatchIndex + 1} of {matches.length}
            </span>
            <button className="search-nav-button" onClick={navigateToPrevMatch}>
              <FaChevronUp size={14} />
            </button>
            <button className="search-nav-button" onClick={navigateToNextMatch}>
              <FaChevronDown size={14} />
            </button>
          </div>
        )}
      </div>
      <button className="search-toggle" onClick={toggleSearch}>
        <FaSearch size={18} />
      </button>
    </>
  );
};

const UserAvatar = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="user-avatar">
      <img src={imageUrl} alt="User profile" />
    </div>
  );
};

interface NavbarProps {
  sidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarToggle, isSidebarOpen }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfile | null>(null);
  // State to track current language. Defaults to false (English)
  const [isArabic, setIsArabic] = useState<boolean>(false);

  // Function to delete a cookie
  const deleteCookie = (name: string) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
  };

  // Function to hide Google Translate elements
  const hideGoogleTranslateElements = () => {
    const elementsToHide = [
      '#goog-gt-tt',
      '.goog-te-banner-frame',
      '.goog-te-ftab-frame',
      '.goog-tooltip',
      '.goog-tooltip-wrapper',
      '.goog-te-balloon-frame',
      '.goog-te-menu-frame',
      '.goog-te-spinner-pos',
      '.skiptranslate.goog-te-gadget'
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.visibility = 'hidden';
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.position = 'absolute';
        (el as HTMLElement).style.left = '-9999px';
        (el as HTMLElement).style.top = '-9999px';
      });
    });

    // Ensure body positioning is correct
    document.body.style.marginTop = '0';
    document.body.style.top = '0';
    document.body.style.position = 'static';
  };

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications();
      setNotifications(data);
    };

    const loadUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setProfileData(userData);
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    const loadBusinessProfile = async () => {
      try {
        const businessData = await getBusinessProfile();
        setBusinessProfile(businessData);
      } catch (error) {
        console.error("Error loading business profile:", error);
      }
    };

    loadNotifications();
    loadUserProfile();
    loadBusinessProfile();

    // Check translation state
    const checkTranslationState = () => {
      const googtransCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('googtrans='));
      
      if (googtransCookie && googtransCookie.includes('/ar')) {
        setIsArabic(true);
      } else {
        setIsArabic(false);
      }
    };

    // Check immediately
    checkTranslationState();
    
    // Set up interval to monitor cookie changes
    const translationMonitor = setInterval(checkTranslationState, 500);
    
    // Cleanup function to hide Google Translate elements periodically
    const hideTranslateElements = setInterval(() => {
      hideGoogleTranslateElements();
    }, 1000);

    // Initial cleanup
    setTimeout(hideGoogleTranslateElements, 100);

    return () => {
      clearInterval(translationMonitor);
      clearInterval(hideTranslateElements);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    if (sidebarToggle) {
      sidebarToggle();
    }
  };

  // Enhanced function to handle language translation toggle
  const handleTranslateToggle = () => {
    if (isArabic) {
      // If currently in Arabic, revert to original (English)
      deleteCookie('googtrans'); // Delete the main translation cookie
      deleteCookie('googtrans_session'); // Delete session cookie
      
      // Force page reload to revert to original content
      window.location.reload();
    } else {
      // If currently in English, translate to Arabic
      if (window.doGTranslate) {
        window.doGTranslate('en|ar'); // Translate from English to Arabic
        setIsArabic(true); // Set state to Arabic
        
        // Additional cleanup after translation
        setTimeout(() => {
          hideGoogleTranslateElements();
        }, 1000);

        // Continue hiding elements periodically after translation
        setTimeout(() => {
          hideGoogleTranslateElements();
        }, 2000);

        setTimeout(() => {
          hideGoogleTranslateElements();
        }, 3000);
      } else {
        console.warn("Google Translate function (doGTranslate) not found. Ensure the script is loaded correctly in index.html.");
        alert("Translation service not ready. Please try again or check your internet connection.");
      }
    }
  };

  // Use business profile image first, then fall back to user profile image
  const profileImageUrl =
    businessProfile?.image || profileData?.image || "/photos/boy1.png";

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={handleToggleSidebar}>
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
        <div className="logo">
          <Link to="/home" className="logo-link">
            GoOrder
          </Link>
        </div>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-actions">
        {/* Translate Button: No icon, text changes based on language view */}
        <button className="translate-button" onClick={handleTranslateToggle}>
          <span className="translate-button-text">
            {isArabic ? "English" : "عربي"} {/* Text changes here */}
          </span>
        </button>

        <div className="notification-bell" onClick={toggleDropdown}>
          <NotificationBell count={notifications.length} />
        </div>

        <Link to="/profile_b" className="profile-link">
          <UserAvatar imageUrl={profileImageUrl} />
        </Link>
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <div key={index} className="notification-item">
                <p>{notif.message}</p>
              </div>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
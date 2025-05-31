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

          // Skip script, style elements and the search input itself
          if (
            parent.tagName === "SCRIPT" ||
            parent.tagName === "STYLE" ||
            parent.tagName === "NOSCRIPT" ||
            parent.classList.contains("search-input") ||
            parent.classList.contains("search-results-info")
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
      <img src={imageUrl || "/photos/boy1.png"} alt="User profile" />
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

    loadNotifications();
    loadUserProfile();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    if (sidebarToggle) {
      sidebarToggle();
    }
  };

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
        <div className="notification-bell" onClick={toggleDropdown}>
          <NotificationBell count={notifications.length} />
        </div>

        <Link to="/profile" className="profile-link">
          <UserAvatar imageUrl={profileData?.image || "/photos/boy1.png"} />
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

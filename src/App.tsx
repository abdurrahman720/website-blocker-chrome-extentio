import { useState, useEffect } from "react";
import "./App.css";

interface BlockedSite {
  domain: string;
  addedAt: number;
}

function App() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([]);
  const [newSite, setNewSite] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load blocked sites from Chrome storage
  useEffect(() => {
    const loadBlockedSites = async () => {
      if (chrome?.storage?.sync) {
        chrome.storage.sync.get(["blockedSites"], (result) => {
          if (result.blockedSites) {
            setBlockedSites(result.blockedSites);
          }
        });
      } else {
        // For local development without Chrome API
        const savedSites = localStorage.getItem("blockedSites");
        if (savedSites) {
          setBlockedSites(JSON.parse(savedSites));
        }
      }
    };

    loadBlockedSites();
  }, []);

  // Save blocked sites
  const saveBlockedSites = (sites: BlockedSite[]) => {
    if (chrome?.storage?.sync) {
      chrome.storage.sync.set({ blockedSites: sites });
    } else {
      // For local development without Chrome API
      localStorage.setItem("blockedSites", JSON.stringify(sites));
    }
    setBlockedSites(sites);
  };

  // Process domain input to extract just the domain
  const extractDomain = (url: string): string => {
    try {
      // Remove leading @ if present (for handling inputs like @https://www.youtube.com/)
      url = url.replace(/^@/, "");

      // Add http protocol if missing to make the URL constructor work
      if (!url.match(/^[a-zA-Z]+:\/\//)) {
        url = "http://" + url;
      }

      const urlObj = new URL(url);
      let domain = urlObj.hostname;

      // Remove 'www.' prefix if present
      domain = domain.replace(/^www\./, "");

      return domain;
    } catch {
      // If URL constructor fails, clean the input as best we can
      let cleanedInput = url.trim();
      cleanedInput = cleanedInput.replace(/^www\./, "");

      // Check if it looks like a domain
      if (
        /^[a-zA-Z0-9]+([-.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/.test(cleanedInput)
      ) {
        return cleanedInput;
      }

      throw new Error("Invalid domain format");
    }
  };

  // Add a new site to block
  const addSite = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newSite.trim()) {
      setError("Please enter a website to block");
      return;
    }

    try {
      const domain = extractDomain(newSite);

      if (!domain) {
        setError("Please enter a valid website");
        return;
      }

      if (blockedSites.some((site) => site.domain === domain)) {
        setError("This website is already blocked");
        return;
      }

      const updatedSites = [...blockedSites, { domain, addedAt: Date.now() }];
      saveBlockedSites(updatedSites);
      setNewSite("");
      setSuccess(`${domain} has been blocked`);

      // Log to console for debugging
      console.log(`Added site to block: ${domain}`);
      console.log("Current blocked sites:", updatedSites);
    } catch (e) {
      setError("Error adding website. Please enter a valid URL or domain");
      console.error("Error processing URL:", e);
    }
  };

  // Remove a site from blocked list
  const removeSite = (domain: string) => {
    const updatedSites = blockedSites.filter((site) => site.domain !== domain);
    saveBlockedSites(updatedSites);
    setSuccess(`${domain} has been unblocked`);
    console.log(`Removed site from block list: ${domain}`);
  };

  return (
    <div className="container">
      <h1>Website Blocker</h1>
      <p className="description">
        Add websites you want to block to stay focused and productive.
      </p>

      <form onSubmit={addSite} className="add-form">
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Enter website URL or domain (e.g., facebook.com)"
          className="site-input"
        />
        <button type="submit" className="add-button">
          Block Website
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="sites-list">
        <h2>Blocked Websites</h2>

        {blockedSites.length === 0 ? (
          <p className="empty-message">No websites blocked yet</p>
        ) : (
          <ul>
            {blockedSites.map((site) => (
              <li key={site.domain} className="site-item">
                <span className="site-domain">{site.domain}</span>
                <button
                  onClick={() => removeSite(site.domain)}
                  className="remove-button"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

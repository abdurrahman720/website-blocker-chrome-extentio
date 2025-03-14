// Store for blocked websites
let blockedSites = [];

// Load blocked sites from storage
chrome.storage.sync.get(['blockedSites'], (result) => {
    if (result.blockedSites) {
        blockedSites = result.blockedSites;
        updateBlockRules();
    }
});

// Listen for changes to the blocked sites list
chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedSites) {
        blockedSites = changes.blockedSites.newValue;
        updateBlockRules();
    }
});

// Function to create blocking rules for the declarativeNetRequest API
async function updateBlockRules() {
    try {
        // First, remove all existing rules
        const existingRuleIds = await chrome.declarativeNetRequest.getDynamicRules()
            .then(rules => rules.map(rule => rule.id));

        if (existingRuleIds.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: existingRuleIds
            });
        }

        // Don't add new rules if there are no blocked sites
        if (!blockedSites || blockedSites.length === 0) return;

        // Create new rules for each blocked site
        const newRules = blockedSites.map((site, index) => {
            const domain = site.domain || site;
            // Create a rule to match the exact domain and any subdomains
            return {
                id: index + 1, // Rule IDs must be positive integers
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        url: chrome.runtime.getURL("blocked.html")
                    }
                },
                condition: {
                    urlFilter: domain,
                    resourceTypes: ["main_frame"]
                }
            };
        });

        // Add the new rules
        if (newRules.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: newRules
            });
            console.log("Blocking rules updated:", newRules);
        }
    } catch (error) {
        console.error("Error updating blocking rules:", error);
    }
}

// Handle the opening of the options page
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'openOptions') {
        chrome.runtime.openOptionsPage();
    }
});

// Also handle navigation to implement the blocking
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading' && tab.url) {
        if (shouldBlockUrl(tab.url)) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html') });
        }
    }
});

// Additional URL checking function for the tab update listener
function shouldBlockUrl(url) {
    if (!url || !blockedSites.length) return false;

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        return blockedSites.some(site => {
            const domain = site.domain || site;
            // Check if hostname matches exactly or is a subdomain
            return hostname === domain ||
                hostname.endsWith('.' + domain) ||
                hostname.replace(/^www\./, '') === domain;
        });
    } catch (e) {
        console.error('Error parsing URL:', e);
        return false;
    }
} 
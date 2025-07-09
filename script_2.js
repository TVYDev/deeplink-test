handleShowButtonDownload();

// Create animated particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Device detection and deep linking
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  } else if (/android/i.test(userAgent)) {
    return "android";
  } else if (/windows|mac|linux|cros/i.test(userAgent)) {
    return "desktop";
  }

  return "unknown";
}

function handleShowButtonDownload() {
  const device = detectDevice();

  if (device === "ios") {
    document.getElementById("androidBtn").style.display = "none";
  } else if (device === "android") {
    document.getElementById("iosBtn").style.display = "none";
  }
}

function doActionBasedOnDeviceType() {
  const device = detectDevice();

  if (device === "desktop") {
    window.location.href = "https://www.hatthabank.com";
  } else if (device === "ios" || device === "android") {
    handleAppDownload(device);
  }
}

function handleAppDownload(platform) {
  const isIOS = platform === "ios";
  const isAndroid = platform === "android";

  const container = document.querySelector(".container");

  // Get deeplink parameters
  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("path") || "/";
  const action = urlParams.get("action") || "";
  const id = urlParams.get("id") || "";

  // Build app URL with proper validation
  let appUrl = "hatthabank://";
  
  // Clean and validate path
  if (path && path !== "/") {
    const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "");
    if (cleanPath) {
      appUrl += cleanPath;
    }
  }

  // Build query parameters
  const params = new URLSearchParams();
  if (action) params.append("action", action);
  if (id) params.append("id", id);

  if (params.toString()) {
    appUrl += (appUrl.endsWith("://") ? "" : "/") + "?" + params.toString();
  }

  console.log("Attempting to open app:", appUrl);

  const startTime = Date.now();
  let hasTriedOpening = false;
  let fallbackTriggered = false;

  // App store URLs
  const storeUrls = {
    ios: "https://apps.apple.com/us/app/hattha-mobile/id1493188010",
    android: "https://play.google.com/store/apps/details?id=com.kh.hkl.mobilebanking"
  };

  // Function to redirect to app store
  function redirectToStore() {
    if (fallbackTriggered) return;
    fallbackTriggered = true;
    
    console.log("Redirecting to store for platform:", platform);
    
    try {
      if (isIOS) {
        window.location.href = storeUrls.ios;
      } else if (isAndroid) {
        window.location.href = storeUrls.android;
      }
    } catch (error) {
      console.error("Error redirecting to store:", error);
    }
  }

  // Function to try opening the app
  function tryOpenApp() {
    if (hasTriedOpening) return;
    hasTriedOpening = true;

    try {
      if (isAndroid) {
        // Android: Try intent URL first, then custom scheme
        const intentUrl = `intent://${path.replace(/^\/+/, "")}#Intent;scheme=hatthabank;package=com.kh.hkl.mobilebanking;end`;
        console.log("Trying Android intent:", intentUrl);
        
        // Create a hidden iframe to avoid navigation issues
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = intentUrl;
        document.body.appendChild(iframe);
        
        // Clean up iframe after attempt
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
        
      } else if (isIOS) {
        // iOS: Try app scheme
        console.log("Trying iOS app URL:", appUrl);
        window.location.href = appUrl;
      }

      console.log("App opening attempted");
    } catch (error) {
      console.error("Error trying to open app:", error);
      redirectToStore();
    }
  }

  // Function to show download fallback
  function showDownloadFallback() {
    if (container) {
      container.classList.remove("checking");
    }
    console.log("Showing download fallback");
    
    // If we're on mobile and haven't redirected yet, go to store
    if (!fallbackTriggered && (isIOS || isAndroid)) {
      redirectToStore();
    }
  }

  // Try opening app immediately
  tryOpenApp();

  // Fallback timeout - redirect to store if app doesn't open
  const fallbackTimeout = setTimeout(() => {
    if (!document.hidden && !fallbackTriggered) {
      console.log("Timeout reached, redirecting to store");
      redirectToStore();
    }
  }, 2500); // Increased timeout for better detection

  // If page becomes hidden quickly, app likely opened
  const visibilityHandler = function() {
    if (document.hidden) {
      const timeTaken = Date.now() - startTime;
      if (timeTaken < 3000) {
        console.log("App opened (page hidden)");
        clearTimeout(fallbackTimeout);
      }
    }
  };
  
  document.addEventListener("visibilitychange", visibilityHandler, { once: true });

  // If user comes back to page, show download
  const focusHandler = function() {
    setTimeout(() => {
      if (hasTriedOpening && !fallbackTriggered) {
        console.log("Page regained focus, showing fallback");
        showDownloadFallback();
      }
    }, 500);
  };
  
  window.addEventListener("focus", focusHandler, { once: true });

  // Clean up event listeners after a reasonable time
  setTimeout(() => {
    document.removeEventListener("visibilitychange", visibilityHandler);
    window.removeEventListener("focus", focusHandler);
  }, 10000);
}

// Add click handlers
document.getElementById("iosBtn")?.addEventListener("click", function (e) {
  e.preventDefault();
  handleAppDownload("ios");
});

document.getElementById("androidBtn")?.addEventListener("click", function (e) {
  e.preventDefault();
  handleAppDownload("android");
});

// Initialize particles when page loads
window.addEventListener("load", () => {
  doActionBasedOnDeviceType();
  createParticles();
});

// Add parallax effect on mouse move
document.addEventListener("mousemove", (e) => {
  const particles = document.querySelectorAll(".particle");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  particles.forEach((particle, index) => {
    const speed = ((index % 3) + 1) * 0.5;
    const translateX = (x - 0.5) * speed * 20;
    const translateY = (y - 0.5) * speed * 20;
    particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
  });
});

// Add scroll-triggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll(".feature, .store-btn").forEach((el) => {
  observer.observe(el);
});

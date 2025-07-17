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
  }
}

function updateHrefForDownloadButtons() {
  const updatedHref =
    "https://link.hatthabank.com/customer" + window.location.search;
  document.getElementById("iosBtn").setAttribute("href", "https://apps.apple.com/us/app/hattha-mobile/id1493188010");
  document.getElementById("androidBtn").setAttribute("href", "intent://open/#Intent;scheme=hatthabank;package=com.kh.hkl.mobilebanking;end");
}

function handleAppDownload(platform) {
  const isIOS = platform === "ios";
  const isAndroid = platform === "android";

  const statusMessage = document.getElementById("statusMessage");
  const container = document.querySelector(".container");

  // Get deeplink parameters
  // const urlParams = new URLSearchParams(window.location.search);
  // const path = urlParams.get("path") || "/";
  // const action = urlParams.get("action") || "";
  // const id = urlParams.get("id") || "";

  // // Build app URL
  // let appUrl = "hatthabank://";
  // if (path !== "/") appUrl += path.replace(/^\//, "");

  // const params = new URLSearchParams();
  // if (action) params.append("action", action);
  // if (id) params.append("id", id);

  // if (params.toString()) {
  //   appUrl += (appUrl.includes("?") ? "&" : "?") + params.toString();
  // }

  console.log("Attempting to open app:", appUrl);
  // statusMessage.textContent = "Opening app...";

  const startTime = Date.now();
  let hasTriedOpening = false;

  // Simplified approach: Try to open app, then quickly fallback
  function tryOpenApp() {
    if (hasTriedOpening) return;
    hasTriedOpening = true;

    if (isAndroid) {
      // Android: Try intent URL
      window.location.href = "intent://open/#Intent;scheme=hatthabank;package=com.kh.hkl.mobilebanking;end";
    } else if (isIOS) {
      // iOS: Try app scheme
      window.location.href = "hatthabank://customer";
    }

    console.log("App opening attempted");
  }

  // Quick detection with short timeout
  function showDownloadFallback() {
    container.classList.remove("checking");
    //   statusMessage.textContent = "Choose your platform:";
    //   document.getElementById("downloadButtons").style.display = "flex";
    console.log("Showing download fallback");
  }

  // Try opening app immediately
  tryOpenApp();

  // Simple timeout - if page is still visible after 1.5 seconds, show download
  setTimeout(() => {
    if (!document.hidden) {
      showDownloadFallback();
    }
  }, 1500);

  // If page becomes hidden quickly, app likely opened
  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.hidden) {
        const timeTaken = Date.now() - startTime;
        if (timeTaken < 3000) {
          console.log("App opened (page hidden)");
          // statusMessage.textContent = "App opened!";
        }
      }
    },
    { once: true }
  );

  // If user comes back to page, show download
  window.addEventListener(
    "focus",
    function () {
      setTimeout(() => {
        if (hasTriedOpening) {
          showDownloadFallback();
        }
      }, 500);
    },
    { once: true }
  );
}

  // function handleAppDownload(platform) {
  //   const device = detectDevice();

  //   // Try to open the app first (deep link)
  //   const appSchemes = {
  //     ios: "hattha-mobile://",
  //     android: "intent://open#Intent;package=com.kh.hkl.mobilebanking;end",
  //   };

  //   if (device === platform && appSchemes[device]) {
  //     // Try to open the app
  //     window.location.href = appSchemes[device];

  //     // Fallback to store after a short delay
  //     setTimeout(() => {
  //       if (document.hidden || document.webkitHidden) {
  //         return; // App probably opened
  //       }
  //       // Redirect to store
  //       window.location.href =
  //         platform === "ios"
  //           ? "https://apps.apple.com/us/app/hattha-mobile/id1493188010"
  //           : "https://play.google.com/store/apps/details?id=com.kh.hkl.mobilebanking";
  //     }, 2000);
  //   }
  // }

// Add click handlers
document.getElementById("iosBtn").addEventListener("click", function (e) {
  e.preventDefault();

  // handleAppDownload("ios");

  const windowProxy = window.open("hatthabank://customer", "_self");
  if(!windowProxy) {
    window.location.replace("https://apps.apple.com/us/app/hattha-mobile/id1493188010");
  }

  // try {
  //   window.location.replace("hatthabank://customer");
  // }catch(error) {
    
  // }
  
  // window.location.href = "hatthabank://customer";

  // setTimeout(() => {
  //   if (document.hidden || document.webkitHidden) {
  //     return; // App probably opened
  //   }
    
  //   window.location.href = "https://apps.apple.com/us/app/hattha-mobile/id1493188010";
  // }, 10000);
});

document.getElementById("androidBtn").addEventListener("click", function (e) {
  e.preventDefault();

  // handleAppDownload("android");

  try {
    window.location.replace("intent://open/#Intent;scheme=hatthabank;package=com.kh.hkl.mobilebanking;end");
  }catch(error) {
    window.location.replace("https://play.google.com/store/apps/details?id=com.kh.hkl.mobilebanking");
  }

  // setTimeout(() => {
  //   if (document.hidden || document.webkitHidden) {
  //     return; // App probably opened
  //   }
    
  // }, 10000);
});

// Initialize particles when page loads
window.addEventListener("load", () => {
  console.log('frame element', window.frameElement);
  console.log('frames', window.frames);
  console.log('Ancestor origins', window.frames.location.ancestorOrigins);

  
  handleShowButtonDownload();
  updateHrefForDownloadButtons();
  // doActionBasedOnDeviceType();
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

import { createRouter, createWebHistory } from "vue-router";

const isPublicBuild = import.meta.env.PROD;
const legacyServices = isPublicBuild
  ? null
  : Promise.all([
      import("../utils/api"),
      import("../services/modelService"),
    ]).then(([api, model]) => ({
      checkSession: api.checkSession,
      modelService: model.default,
    }));

const publicRoutes = [
  {
    path: "/",
    name: "landing",
    component: () => import("../views/LandingSaaSView.vue"),
    meta: { layout: "blank" },
  },
  {
    path: "/demo",
    name: "demo",
    component: () => import("../views/DemoWorkspaceView.vue"),
    meta: { layout: "public" },
  },
  {
    path: "/research",
    name: "research",
    component: () => import("../views/ResearchView.vue"),
    meta: { layout: "public" },
  },
  {
    path: "/metrics",
    name: "metrics",
    component: () => import("../views/MetricsDashboardView.vue"),
    meta: { layout: "public" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
    meta: { layout: "public" },
  },
];

const legacyRoutes = [
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"), // Dynamic import
    meta: { requiresAuth: true },
  },
  {
    path: "/annotate",
    name: "annotate",
    component: () => import("../views/AnnotateView.vue"), // Dynamic import
    meta: { 
      requiresAuth: true,
      // Add a leave guard to ensure component cleanup
      leaveGuard: true 
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"), // Dynamic import
    meta: { layout: "blank" },
  },
  {
    path: "/upload-cxr",
    name: "upload-cxr",
    component: () => import("../views/UploadCXRView.vue"), // Dynamic import
    meta: { requiresAuth: true },
  },
];

const routes = [
  ...publicRoutes,
  ...(isPublicBuild ? [] : legacyRoutes),
  // Unknown and local-only paths return visitors to the public landing page.
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

// Get the base URL from environment variables or use a default value
const baseUrl = import.meta.env?.VITE_BASE_URL || "/";

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;

    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    return { top: 0 };
  },
});

// Track navigation attempts to prevent infinite loops
let navigationAttempts = 0;
const MAX_NAVIGATION_ATTEMPTS = 5;

// Reset navigation counter after a delay
setInterval(() => {
  if (navigationAttempts > 0) {
    console.log("[Router] Resetting navigation attempts counter");
    navigationAttempts = 0;
  }
}, 10000);

router.beforeEach(async (to, from, next) => {
  if (isPublicBuild) {
    return next();
  }

  const { checkSession, modelService } = await legacyServices;
  console.log("[Router] Navigation started to:", to.path, "from:", from.path);

  // Special handling for leaving AnnotateView page
  if (from.name === 'annotate') {
    console.log("[Router] Leaving Annotation page - performing additional cleanup");
    // Force cleanup of any potentially problematic resources
    try {
      // Cancel any pending requests
      modelService.cancelRequests();
      
      // Clear any cached images that might be causing issues
      const imageElements = document.querySelectorAll('img');
      imageElements.forEach(img => {
        // Clear image src to help with memory cleanup
        if (img.src && img.src.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(img.src);
            img.src = '';
          } catch (e) {
            console.error("[Router] Error cleaning up image:", e);
          }
        }
      });
      
      // Reset any global CSS that might be affecting other pages
      document.body.style.cursor = 'default';
      
    } catch (error) {
      console.error("[Router] Error during annotation page cleanup:", error);
    }
  }

  // Cancel any pending API requests to prevent errors
  modelService.cancelRequests();

  // Increment navigation attempts
  navigationAttempts++;

  // Prevent potential navigation loops
  if (navigationAttempts > MAX_NAVIGATION_ATTEMPTS) {
    console.error(
      "[Router] Too many navigation attempts detected, possible loop"
    );
    navigationAttempts = 0;

    // Force navigation to login and clear any auth state
    localStorage.removeItem("authToken");
    if (to.path !== "/login") {
      return next("/login");
    }
    return next();
  }

  // Bypass auth check for public/blank-layout pages
  if (to.meta?.requiresAuth !== true) {
    // Special handling for login page
    if (to.path === "/login" || to.name === "login") {
      // If user is already logged in and trying to access login page, redirect to home
      const token = localStorage.getItem("authToken");
      if (token) {
        console.log("[Auth] User already has token, redirecting to home");
        return next("/home");
      }
      return next();
    }

    return next();
  }

  // Backward-compatible bypass for login page (should not be hit due to block above)
  if (to.path === "/login" || to.name === "login") {
    // If user is already logged in and trying to access login page, redirect to home
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("[Auth] User already has token, redirecting to home");
      return next("/home");
    }
    return next();
  }

  const token = localStorage.getItem("authToken");

  // No token - redirect to login
  if (!token) {
    console.log("[Auth] No token found");
    return next("/login");
  }

  // Check if token is an offline token (added for network bypass)
  if (isOfflineToken(token)) {
    console.log("[Auth] Offline token detected - bypassing server validation");
    return next(); // Allow navigation with offline token
  }

  try {
    // Use the API utility for session checking
    console.log("[Auth] Checking session validity");
    const response = await checkSession();

    if (response && response.data && response.data.valid) {
      console.log(
        "[Auth] Session is valid, user:",
        response.data.user?.username
      );
      // Successful navigation decreases the counter
      navigationAttempts = Math.max(0, navigationAttempts - 1);
      return next();
    } else {
      console.log("[Auth] Session is invalid");
      localStorage.removeItem("authToken");
      return next("/login");
    }
  } catch (error) {
    console.error("[Auth] Session check failed:", error);

    // Only clear token if it's an authentication error (401)
    // For network errors, we'll still allow navigation to proceed
    if (error.response && error.response.status === 401) {
      console.log("[Auth] Unauthorized, clearing token");
      localStorage.removeItem("authToken");
      return next("/login");
    }

    if (error.code === "ERR_NETWORK") {
      console.warn(
        "[Auth] Network error during session check - allowing navigation"
      );

      // Create an offline token if not already using one
      if (!isOfflineToken(token)) {
        try {
          // Extract username from existing token
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));
          const username = decoded.username || decoded.sub || "offline_user";
          
          // Create and store offline token
          const offlineToken = createOfflineToken(username);
          localStorage.setItem("authToken", offlineToken);
          console.log("[Auth] Created offline token for", username);
        } catch (e) {
          console.error("[Auth] Error creating offline token:", e);
        }
      }

      // For pages that require auth, let the page component handle the error display
      // This prevents a redirect loop when the API is unreachable
      if (to.meta.requiresAuth) {
        console.log(
          "[Auth] Page requires auth but API is unreachable - proceeding with caution"
        );
      }

      // Allow navigation to proceed despite network error
      return next();
    }

    // For other errors, clear token and redirect to login
    localStorage.removeItem("authToken");
    return next("/login");
  }
});

// Helper function to check if a token is an offline token
function isOfflineToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.offline_mode === true;
  } catch (e) {
    console.error("[Router] Error checking offline token:", e);
    return false;
  }
}

// Helper function to create an offline token
function createOfflineToken(username) {
  // Create header
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  // Create payload with 24 hour expiration
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: username,
    name: username,
    username: username,
    iat: now,
    exp: now + 86400, // 24 hours from now
    offline_mode: true // Flag to indicate this is a bypass token
  };
  
  // For mock token, we'll use base64 encoding (not actual JWT signing)
  const encodeBase64 = (obj) => {
    return btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };
  
  // Create the token parts
  const headerEncoded = encodeBase64(header);
  const payloadEncoded = encodeBase64(payload);
  const signatureEncoded = encodeBase64({sig: "offline_signature"});
  
  // Combine into a JWT token format
  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

// Add afterEach navigation hook to perform cleanup
router.afterEach((to, from) => {
  console.log("[Router] Navigation completed to:", to.path, "from:", from.path);
  
  // Free up memory by running garbage collection via setTimeout
  setTimeout(() => {
    navigationAttempts = Math.max(0, navigationAttempts - 1);
    
    // This helps release memory more quickly
    if (window.gc) {
      try {
        window.gc();
        console.log("[Router] Manual garbage collection triggered");
      } catch (e) {
        console.warn("[Router] Manual garbage collection not available");
      }
    }
  }, 100);
});

export default router;

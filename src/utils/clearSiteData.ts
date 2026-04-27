/**
 * Utility function to clear all site data from browser
 * Clears localStorage, sessionStorage, IndexedDB, cookies, and cache
 */
export const clearAllSiteData = async (): Promise<void> => {
  try {
    console.log('🧹 Starting site data cleanup...');
    
    // 1. Clear localStorage
    try {
      localStorage.clear();
      console.log('✅ localStorage cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear localStorage:', error);
    }

    // 2. Clear sessionStorage
    try {
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear sessionStorage:', error);
    }

    // 3. Clear cookies
    try {
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      console.log('✅ Cookies cleared');
    } catch (error) {
      console.warn('⚠️ Failed to clear cookies:', error);
    }

    // 4. Clear IndexedDB
    try {
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => indexedDB.deleteDatabase(db.name!))
        );
        console.log('✅ IndexedDB cleared');
      }
    } catch (error) {
      console.warn('⚠️ Failed to clear IndexedDB:', error);
    }

    // 5. Clear Cache Storage
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Cache Storage cleared');
      }
    } catch (error) {
      console.warn('⚠️ Failed to clear Cache Storage:', error);
    }

    // 6. Clear service workers (optional)
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('✅ Service Workers unregistered');
      }
    } catch (error) {
      console.warn('⚠️ Failed to unregister service workers:', error);
    }

    console.log('🎉 Site data cleanup completed successfully!');
    
    // Show success message to user
    if (typeof window !== 'undefined') {
      // Create a temporary success message
      const successDiv = document.createElement('div');
      successDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        ">
          ✅ All site data cleared successfully!
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `;
      document.body.appendChild(successDiv);
      
      // Remove message after 3 seconds
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
        }
      }, 3000);
    }

  } catch (error) {
    console.error('❌ Error during site data cleanup:', error);
    throw error;
  }
};

/**
 * Check if site has any data stored
 */
export const hasStoredData = (): boolean => {
  try {
    // Check localStorage
    if (localStorage.length > 0) return true;
    
    // Check sessionStorage
    if (sessionStorage.length > 0) return true;
    
    // Check cookies
    if (document.cookie.length > 0) return true;
    
    return false;
  } catch {
    return false;
  }
};

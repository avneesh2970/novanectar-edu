/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';
import { logPageView } from './analytics';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TrackPageViews({ router }: { router: any }) {
  useEffect(() => {
    // Log initial page view
    logPageView();

    // Subscribe to router navigation events
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = router.subscribe(() => {
      // Log page view on route change
      logPageView();
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return null; // This component doesn't render anything
}

export default TrackPageViews;
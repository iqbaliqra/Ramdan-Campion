import type { NextConfig } from 'next';

/** Avoids devtools "SegmentViewNode" / React Client Manifest errors in some dev setups (Cursor, etc.). */
const nextConfig: NextConfig = {
  experimental: {
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;

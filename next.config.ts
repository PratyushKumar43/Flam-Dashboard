import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Performance optimizations
  // Note: SWC minification is enabled by default in Next.js 13+
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@tanstack/react-table",
    ],
  },
  // Reduce bundle size with better code splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for large libraries - more aggressive splitting
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 2, // Only include if used in 2+ chunks
            },
            // Separate chunk for chart libraries
            charts: {
              name: "charts",
              chunks: "all",
              test: /[\\/]components[\\/]charts[\\/]/,
              priority: 30,
            },
            // Separate chunk for UI components
            ui: {
              name: "ui",
              chunks: "all",
              test: /[\\/]components[\\/]ui[\\/]/,
              priority: 25,
            },
            // Separate chunk for dnd-kit (only used in data table)
            dndkit: {
              name: "dndkit",
              chunks: "async", // Only load when needed
              test: /[\\/]node_modules[\\/]@dnd-kit[\\/]/,
              priority: 30,
            },
            // Separate chunk for react-table (only used in data table)
            reactTable: {
              name: "react-table",
              chunks: "async", // Only load when needed
              test: /[\\/]node_modules[\\/]@tanstack[\\/]react-table[\\/]/,
              priority: 30,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;

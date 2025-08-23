const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "yihokqocgijpqfemclfy.supabase.co",
        pathname: "**"
      }, 
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**"
      }
    ]
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/quizzes',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;

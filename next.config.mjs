const nextConfig = {
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
        hostname: "fakeimg.pl",
        pathname: "**"
      }
    ]
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

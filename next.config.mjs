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
  }
};

export default nextConfig;

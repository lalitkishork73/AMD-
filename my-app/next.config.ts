import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  crossOrigin: 'anonymous',
  // allowedDevOrigins: ['*'],
  // devServer: {
  //   allowedDevOrigins: [
  //     '*',
  //     'https://192.168.0.109:3000', // Specific IP of the device accessing the server
  //     'http://192.168.0.109:3000', 
  //     'http://localhost:3000', // You might need to keep localhost explicitly
  //     'http://127.0.0.1:3000'
  //     // You can also use a wildcard for all local IPs if you have dynamic IPs:
  //     // /\.your-local-network-subnet\.local$/ 
  //   ],
  // },
};  

export default nextConfig;

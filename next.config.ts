import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        // Low-risk baseline headers with no known breakage potential for
        // this app. Deliberately NOT including a Content-Security-Policy
        // here -- the JSON-LD <script> tags (dangerouslySetInnerHTML) and
        // Vercel Analytics need specific allowances, and a wrong CSP fails
        // silently in ways that are easy to ship and hard to notice. Add
        // one in a separate, tested pass rather than guessing here.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

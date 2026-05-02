app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no origin (curl, mobile)
      if (!origin) return callback(null, true);
      
      // Allow all localhost ports
      if (origin.startsWith("http://localhost:")) return callback(null, true);
      
      // Allow production domains
      const allowed = [
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.netlify\.app$/,
        "https://test-yu3u.onrender.com",
      ];
      
      const isAllowed = allowed.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );
      
      if (isAllowed) return callback(null, true);
      
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false); // return false, not an error
    },
    credentials: true,
  })
);
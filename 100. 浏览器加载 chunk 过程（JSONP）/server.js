// server.js
// 极简静态服务器：暴露根目录，访问 http://localhost:3000/
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 3000;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(root, urlPath);
    if (!filePath.startsWith(root)) {
      res.statusCode = 403;
      return res.end("forbidden");
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end("not found: " + urlPath);
      }
      const ext = path.extname(filePath).toLowerCase();
      res.setHeader("Content-Type", mime[ext] || "application/octet-stream");
      res.end(data);
    });
  })
  .listen(port, () => {
    console.log(`server: http://localhost:${port}/`);
    console.log("先 `npm run build`，再 `npm run serve`，浏览器打开上面地址。");
  });

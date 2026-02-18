import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import querystring from "querystring";

function createApp() {
    const routes = [];
    const middlewares = [];
    const sessions = {};


    // MAIN SERVER FUNCTION
    const app = async (req, res) => {

        // Parse URL
        const parsedUrl = url.parse(req.url, true);
        req.path = parsedUrl.pathname;
        req.query = parsedUrl.query;

        // Response Helpers (OLD + NEW)
        res.status = (code) => {
            res.statusCode = code;
            return res;
        };

        res.json = (data) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data));
        };

        // OLD behavior preserved
        res.send = (data) => {
            if (typeof data === "object") {
                res.json(data);
            } else {
                res.setHeader("Content-Type", "text/html");
                res.end(data);
            }
        };

        // NEW (safe)
        res.redirect = (location) => {
            res.statusCode = 302;
            res.setHeader("Location", location);
            res.end();
        };

        res.sendFile = (filePath) => {
            if (fs.existsSync(filePath)) {
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.statusCode = 404;
                res.end("File not found");
            }
        };

        // Session (OLD)
        const cookie = req.headers.cookie;
        if (cookie && sessions[cookie]) {
            req.session = sessions[cookie];
        } else {
            const id = Date.now().toString();
            sessions[id] = {};
            res.setHeader("Set-Cookie", id);
            req.session = sessions[id];
        }
        // Body Parser (JSON + Form)
        if (req.method !== "GET") {
            let body = "";
            for await (const chunk of req) {
                body += chunk;
            }

            const type = req.headers["content-type"] || "";

            try {
                if (type.includes("application/json")) {
                    req.body = JSON.parse(body || "{}");
                } else if (type.includes("application/x-www-form-urlencoded")) {
                    req.body = querystring.parse(body);
                } else {
                    req.body = body;
                }
            } catch {
                req.body = {};
            }
        }
        // Middleware Runner (error safe)
        let i = 0;
        const next = () => {
            if (i < middlewares.length) {
                try {
                    middlewares[i++](req, res, next);
                } catch (err) {
                    res.statusCode = 500;
                    res.end("Internal Server Error");
                }
            } else {
                handleRoute();
            }
        };

        // Route Handler
        const handleRoute = () => {

            const route = routes.find(r => {

                // support app.all()
                if (r.method !== req.method && r.method !== "ALL") return false;

                const routeParts = r.path.split("/");
                const urlParts = req.path.split("/");

                if (routeParts.length !== urlParts.length) return false;

                req.params = {};
                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(":")) {
                        req.params[routeParts[i].slice(1)] = urlParts[i];
                    } else if (routeParts[i] !== urlParts[i]) {
                        return false;
                    }
                }
                return true;
            });

            if (route) {
                route.handler(req, res);
            } else {
                res.statusCode = 404;
                res.send("Not Found");
            }
        };

        next();
    };

    // ROUTING (OLD + NEW)
    app.get = (path, handler) => {
        routes.push({ method: "GET", path, handler });
    };

    app.post = (path, handler) => {
        routes.push({ method: "POST", path, handler });
    };

    // NEW (safe)
    app.put = (path, handler) => {
        routes.push({ method: "PUT", path, handler });
    };

    app.delete = (path, handler) => {
        routes.push({ method: "DELETE", path, handler });
    };

    app.patch = (path, handler) => {
        routes.push({ method: "PATCH", path, handler });
    };

    app.all = (path, handler) => {
        routes.push({ method: "ALL", path, handler });
    };

    // MIDDLEWARE
    app.use = (fn) => {
        middlewares.push(fn);
    };

    // DEFAULT LOGGER (safe)
    app.use((req, res, next) => {
        console.log(req.method, req.url);
        next();
    });

    // STATIC FILES (OLD)
    app.static = (folder) => {
        app.use((req, res, next) => {
            const filePath = path.join(folder, req.path);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);

                const types = {
                    ".html": "text/html",
                    ".css": "text/css",
                    ".js": "application/javascript",
                    ".json": "application/json",
                    ".png": "image/png",
                    ".jpg": "image/jpeg"
                };

                res.setHeader("Content-Type", types[ext] || "text/plain");
                fs.createReadStream(filePath).pipe(res);
            } else {
                next();
            }
        });
    };

    // TEMPLATE RENDER (OLD)
    app.render = (res, file, data) => {
        let html = fs.readFileSync(file, "utf-8");

        for (let key in data) {
            html = html.replace(`{{${key}}}`, data[key]);
        }

        res.setHeader("Content-Type", "text/html");
        res.end(html);
    };

    // SERVER START
    app.listen = (port, cb) => {
        http.createServer(app).listen(port, cb);
    };

    return app;
}

export default createApp;
import http from "http";
import url from "url";
import fs from "fs";
import path from "path";

function createApp() {
    const routes = [];
    const middlewares = [];
    const sessions = {};

    //////////////////////////////////////
    // MAIN SERVER FUNCTION
    //////////////////////////////////////
    const app = async (req, res) => {

        // Parse URL
        const parsedUrl = url.parse(req.url, true);
        req.path = parsedUrl.pathname;
        req.query = parsedUrl.query;

        //////////////////////////////////////
        // Response Helpers (IMPORTANT)
        //////////////////////////////////////
        res.send = (data) => {
            if (typeof data === "object") {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
            } else {
                res.setHeader("Content-Type", "text/html");
                res.end(data);
            }
        };

        //////////////////////////////////////
        // Session (simple)
        //////////////////////////////////////
        const cookie = req.headers.cookie;
        if (cookie && sessions[cookie]) {
            req.session = sessions[cookie];
        } else {
            const id = Date.now().toString();
            sessions[id] = {};
            res.setHeader("Set-Cookie", id);
            req.session = sessions[id];
        }

        //////////////////////////////////////
        // JSON Body Parser
        //////////////////////////////////////
        if (req.method !== "GET") {
            let body = "";
            for await (const chunk of req) {
                body += chunk;
            }
            try {
                req.body = JSON.parse(body || "{}");
            } catch {
                req.body = {};
            }
        }

        //////////////////////////////////////
        // Middleware Runner
        //////////////////////////////////////
        let i = 0;
        const next = () => {
            if (i < middlewares.length) {
                middlewares[i++](req, res, next);
            } else {
                handleRoute();
            }
        };

        //////////////////////////////////////
        // Route Handler
        //////////////////////////////////////
        const handleRoute = () => {

            const route = routes.find(r => {
                if (r.method !== req.method) return false;

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

    //////////////////////////////////////
    // ROUTING
    //////////////////////////////////////
    app.get = (path, handler) => {
        routes.push({ method: "GET", path, handler });
    };

    app.post = (path, handler) => {
        routes.push({ method: "POST", path, handler });
    };

    //////////////////////////////////////
    // MIDDLEWARE
    //////////////////////////////////////
    app.use = (fn) => {
        middlewares.push(fn);
    };

    //////////////////////////////////////
    // STATIC FILES
    //////////////////////////////////////
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

    //////////////////////////////////////
    // TEMPLATE RENDER
    //////////////////////////////////////
    app.render = (res, file, data) => {
        let html = fs.readFileSync(file, "utf-8");

        for (let key in data) {
            html = html.replace(`{{${key}}}`, data[key]);
        }

        res.setHeader("Content-Type", "text/html");
        res.end(html);
    };

    //////////////////////////////////////
    // SERVER START
    //////////////////////////////////////
    app.listen = (port, cb) => {
        http.createServer(app).listen(port, cb);
    };

    return app;
}

export default createApp;
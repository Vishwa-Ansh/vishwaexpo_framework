import createApp from "vishwaexpo";
import path from "path";

const app = createApp();

// Middleware (Logger)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Static files
app.static(path.join(process.cwd(), "public"));

// Home
app.get("/", (req, res) => {
    res.send("<h1>Welcome to VishwaExpo</h1>");
});

// Route params
app.get("/user/:id", (req, res) => {
    res.json({
        message: "User details",
        userId: req.params.id
    });
});

// Session example
app.get("/visit", (req, res) => {
    req.session.count = (req.session.count || 0) + 1;
    res.send(`Visit count: ${req.session.count}`);
});

// POST example
app.post("/login", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username required" });
    }

    req.session.user = username;

    res.json({
        message: "Login successful",
        user: username
    });
});

// Redirect example
app.get("/home", (req, res) => {
    res.redirect("/");
});

// Send file example
app.get("/download", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "file.txt"));
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
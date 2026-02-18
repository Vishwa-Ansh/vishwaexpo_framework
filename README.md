<p align="center">
  <img src="<p align="center">
  <img src="https://raw.githubusercontent.com/Vishwa-Ansh/vishwaexpo_framework/main/logo.png" width="160"/>
</p>

<h1 align="center">VishwaExpo</h1>

<p align="center">
  Minimal Express-like Node.js framework built from scratch
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vishwaexpo">
    <img src="https://img.shields.io/npm/v/vishwaexpo?color=blue&label=npm%20version" />
  </a>
  <a href="https://www.npmjs.com/package/vishwaexpo">
    <img src="https://img.shields.io/npm/dw/vishwaexpo?color=green&label=downloads" />
  </a>
  <img src="https://img.shields.io/npm/l/vishwaexpo?color=orange&label=license" />
  <img src="https://img.shields.io/badge/node-%3E%3D14-brightgreen" />
</p>

<p align="center">
  <b>Fast • Lightweight • Beginner Friendly</b>
</p>" width="160"/>
</p>



# Vishwa Framework

A lightweight Express-like Node.js framework built from scratch.

## Features
- Routing
- Middleware
- JSON body parser
- Static files
- Sessions
- Template rendering

## Install
npm install vishwaexpo

## Usage

import createApp from "vishwaexpo";

const app = createApp();

app.get("/", (req, res) => {
  res.end("Hello World");
});

app.listen(3000);
# Vishwaexpo Framework

A lightweight **Express-like Node.js framework** built from scratch using core Node.js modules.  
This framework provides essential backend features such as routing, middleware, static file handling, sessions, and template rendering without any external dependencies.

---

## 🚀 Features

- Routing (GET, POST)
- Middleware support
- URL parameters (`req.params`)
- Query parameters (`req.query`)
- JSON body parser
- Static file serving
- Basic session management
- Template rendering
- Automatic Content-Type handling

---

## 📦 Installation

```bash
npm install vishwaexpo
```

---

## 🛠 Basic Usage

```js
import createApp from "vishwaexpo";

const app = createApp();

app.get("/", (req, res) => {
    res.send("<h1>Hello from Vishwaexpo</h1>");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
```

Open in your browser:

```
http://localhost:3000
```

---

## 📌 Route Parameters

```js
app.get("/user/:id", (req, res) => {
    res.send("User ID: " + req.params.id);
});
```

---

## 📌 Handling JSON Requests

```js
app.post("/data", (req, res) => {
    res.send(req.body);
});
```

---

## 📁 Static Files

```js
app.static("public");
```

Project structure example:

```
public/
   index.html
   style.css
   script.js
```

Access in browser:

```
http://localhost:3000/index.html
```

---

## 🧾 Template Rendering

HTML file (`views/home.html`)

```html
<h1>Welcome {{name}}</h1>
```

Route:

```js
app.get("/home", (req, res) => {
    app.render(res, "./views/home.html", { name: "Ansh" });
});
```

---

## 🔐 Session Example

```js
app.get("/visit", (req, res) => {
    req.session.count = (req.session.count || 0) + 1;
    res.send("Visits: " + req.session.count);
});
```

---

## 📂 Example Project Structure

```
project/
│
├── index.js
├── public/
├── views/
├── package.json
└── node_modules/
```

---

## ⚙️ Requirements

- Node.js v16 or higher
- ES Modules enabled in package.json:

```json
{
  "type": "module"
}
```

---

## 🗺 Roadmap

Future improvements planned:

- Router modules (`app.use("/user", router)`)
- Error handling middleware
- File upload support
- Security middleware
- Performance optimizations

---

## 👨‍💻 Author

**Ansh Vishwakarma**

---

## 📄 License

ISC
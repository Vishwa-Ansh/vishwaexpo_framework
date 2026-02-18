# Changelog

All notable changes to **VishwaExpo** will be documented in this file.

---

## [1.1.0] - 2026-02-18

### ✨ Added
- Support for **PUT, DELETE, and PATCH** HTTP methods
- New `app.all()` method to handle all HTTP methods for a route
- `res.status()` for setting HTTP status codes
- `res.json()` for sending JSON responses easily
- `res.redirect()` for URL redirection
- `res.sendFile()` to serve files directly from the server
- Support for parsing **application/x-www-form-urlencoded** request bodies
- Default request logging middleware

### ⚙️ Improved
- Enhanced middleware execution with basic error handling
- Better response utility methods for developer convenience

### 🔒 Compatibility
- **Fully backward compatible** with v1.0.x
- No breaking changes
- Existing applications will continue to work without any modifications

---

## [1.0.5] - Previous Version

### Features
- GET and POST routing
- Middleware support
- Static file serving using `app.static()`
- Template rendering using `app.render()`
- Basic session support
- JSON body parser
- Route parameters support (e.g., `/user/:id`)
- Query parsing
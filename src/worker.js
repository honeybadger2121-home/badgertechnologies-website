export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle different routes
    if (url.pathname === '/') {
      return new Response(getIndexHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname === '/contact.html') {
      return new Response(getContactHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname === '/services.html') {
      return new Response(getServicesHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname === '/about.html') {
      return new Response(getAboutHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    if (url.pathname === '/styles.css') {
      return new Response(getCSS(), {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    if (url.pathname === '/script.js') {
      return new Response(getJS(), {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    // Default 404
    return new Response('Not Found', { status: 404 });
  }
};

function getIndexHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Badger Technologies - Professional IT Services</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <span>🦡 Badger Technologies</span>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/services.html" class="nav-link">Services</a>
                <a href="/about.html" class="nav-link">About</a>
                <a href="/contact.html" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>Professional IT Services & Cybersecurity Solutions</h1>
                <p>Protecting and optimizing your technology infrastructure with expert managed IT services.</p>
                <div class="cta-buttons">
                    <a href="/contact.html" class="btn btn-primary">Get Started</a>
                    <a href="/services.html" class="btn btn-secondary">Our Services</a>
                </div>
            </div>
        </section>
    </main>

    <script src="/script.js"></script>
</body>
</html>`;
}

function getContactHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Badger Technologies</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <span>🦡 Badger Technologies</span>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/services.html" class="nav-link">Services</a>
                <a href="/about.html" class="nav-link">About</a>
                <a href="/contact.html" class="nav-link active">Contact</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="contact-hero">
            <h1>Contact Badger Technologies</h1>
            <p>Ready to transform your IT infrastructure? Get in touch today.</p>
        </section>
    </main>

    <script src="/script.js"></script>
</body>
</html>`;
}

function getServicesHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services - Badger Technologies</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <span>🦡 Badger Technologies</span>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/services.html" class="nav-link active">Services</a>
                <a href="/about.html" class="nav-link">About</a>
                <a href="/contact.html" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="services-hero">
            <h1>Professional IT Services</h1>
            <p>Comprehensive technology solutions for your business.</p>
        </section>
    </main>

    <script src="/script.js"></script>
</body>
</html>`;
}

function getAboutHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Badger Technologies</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <span>🦡 Badger Technologies</span>
            </div>
            <div class="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/services.html" class="nav-link">Services</a>
                <a href="/about.html" class="nav-link active">About</a>
                <a href="/contact.html" class="nav-link">Contact</a>
            </div>
        </div>
    </nav>

    <main>
        <section class="about-hero">
            <h1>About Badger Technologies</h1>
            <p>Your trusted partner in IT services and cybersecurity.</p>
        </section>
    </main>

    <script src="/script.js"></script>
</body>
</html>`;
}

function getCSS() {
  return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
}

.navbar {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
}

.nav-logo {
    font-weight: bold;
    font-size: 1.2rem;
    color: #2c5aa0;
}

.nav-menu {
    display: flex;
    gap: 30px;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.active {
    color: #2c5aa0;
}

.hero, .contact-hero, .services-hero, .about-hero {
    background: linear-gradient(135deg, #2c5aa0 0%, #1a365d 100%);
    color: white;
    padding: 120px 20px 80px;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero h1, .contact-hero h1, .services-hero h1, .about-hero h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    font-weight: 700;
}

.hero p, .contact-hero p, .services-hero p, .about-hero p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.cta-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 15px 30px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background: #ff6b35;
    color: white;
}

.btn-primary:hover {
    background: #e55a2b;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #2c5aa0;
}

@media (max-width: 768px) {
    .hero h1, .contact-hero h1, .services-hero h1, .about-hero h1 {
        font-size: 2rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
}`;
}

function getJS() {
  return `console.log('Badger Technologies - IT Services & Cybersecurity Solutions');`;
}
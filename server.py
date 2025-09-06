#!/usr/bin/env python3
"""
Simple HTTP server for serving the Badger Technologies website locally.
Run this script and visit http://localhost:8000 in your browser.
"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import threading
import time

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{self.log_date_time_string()}] {format % args}")

def open_browser(url, delay=1):
    """Open the browser after a short delay"""
    def delayed_open():
        time.sleep(delay)
        webbrowser.open(url)
    
    thread = threading.Thread(target=delayed_open)
    thread.daemon = True
    thread.start()

def main():
    # Configuration
    HOST = 'localhost'
    PORT = 8000
    
    # Change to the directory containing the website files
    website_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(website_dir)
    
    # Create server
    server = HTTPServer((HOST, PORT), CustomHTTPRequestHandler)
    
    print("=" * 60)
    print("🚀 Badger Technologies Website Server")
    print("=" * 60)
    print(f"📁 Serving directory: {website_dir}")
    print(f"🌐 Server running at: http://{HOST}:{PORT}")
    print(f"📱 Network access: http://{get_local_ip()}:{PORT}")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    # Open browser automatically
    url = f"http://{HOST}:{PORT}"
    open_browser(url)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        server.shutdown()

def get_local_ip():
    """Get the local IP address for network access"""
    import socket
    try:
        # Connect to a remote server to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
        return local_ip
    except Exception:
        return "localhost"

if __name__ == "__main__":
    main()

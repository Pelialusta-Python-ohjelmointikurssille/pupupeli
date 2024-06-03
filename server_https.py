from http.server import SimpleHTTPRequestHandler, HTTPServer
import ssl

class CORSRequestHandler(SimpleHTTPRequestHandler):
    # Send the headers required for SharedArrayBuffer
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, CORSRequestHandler)

    # Create an SSL context
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile='cert.pem', keyfile='key.pem')

    # Wrap the server socket with SSL
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    print("Serving on port 8000 with HTTPS...")
    httpd.serve_forever()

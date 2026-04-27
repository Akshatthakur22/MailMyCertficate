def handler(environ, start_response):
    """Simple test handler to verify Vercel serverless function works"""
    status = '200 OK'
    headers = [('Content-Type', 'text/plain')]
    start_response(status, headers)
    return [b'Python serverless function is working!']

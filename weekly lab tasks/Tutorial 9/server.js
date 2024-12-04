const http = require('http')

const port = 8000

const server = http.createServer((req, res) => {
    if (req.url == '/')
    {
        res.writeHead(200, {'Content-Type': 'text/html'})

        res.write('<p>This is Home page</p>')
        res.end()
    }
    else if (req.url == '/student')
    {
        res.writeHead(200, {'Content-Type': 'text/html'})

        res.write('<p>This is Student page</p>')
        res.end()
    }
    else if (req.url == '/admin')
    {
        res.writeHead(200, {'Content-Type': 'text/html'})

        res.write('<p>This is Admin page</p>')
        res.end()
    }
    else if (req.url == '/data')
    {
        res.writeHead(200, {'Content-Type': 'application/json'})

        res.write(JSON.stringify({ message: "Hello world JSON"}))
        res.end()
    }
    else
    {
        res.end('Invalid request')
    }
    
    
})

server.listen(port, () => {
    console.log('Node.js web server is running at http://localhost:'+port)
})
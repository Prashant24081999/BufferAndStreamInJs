const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");

    res.end(`
                <form action='/message', method='POST'>
                    <label for="name">Name:</label>
                    <input type='text' name='name' id='name'/> 
                    <button type='submit'>Add</button>
                </form>
            `);
  } else {
    if (req.url == "/message") {
      res.setHeader("Content-Type", "text/html");

      let dataChunks = [];
      req.on("data", (chunk) => {
        dataChunks.push(chunk);
      });
      req.on("end", () => {
        let combinedBuffer = Buffer.concat(dataChunks);
        console.log(combinedBuffer);
        let data = combinedBuffer.toString().split("=")[1];
        console.log(data);
        fs.writeFile("formValues.txt", data, (err) => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          res.end();
        });
      });
    }
    if (req.url == "/read") {
      fs.readFile("formValues.txt", (err, data) => {
        console.log(data);
        res.end(`
                <h1>${data.toString()}</h1>
                `);
      });
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running");
});

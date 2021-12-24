const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Flex-Box</title>
      <style>
          .container {
              width: 1000px;
              height: 250px;
              border: 5px solid rebeccapurple;
              padding: 10px;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-around;
              align-items: center;
          }
  
          .item {
              background-color: blanchedalmond;
              border: 2px solid black;
              padding: 5px 3px;
              margin: 10px;
              width: 100px;
              height: 100px;
          }
  
          #item1 {
              flex-basis: 200px;
              /* order: 3; */
              /* flex-grow:2 ; */
          }
  
          #item2 {
              /* order: 1; */
              /* flex-grow:3 ; */
              flex: 0 1 150px;
          }
  
          #item3 {
              /* order: 3; */
              /* flex-grow: 1; */
          }
      </style>
  </head>
  
  <body>
      <h1>Flex-Box Tutorials</h1>
      <div class="container">
          <div class="item" id="item1">First</div>
          <div class="item" id="item2">Second</div>
          <div class="item" id="item3">Third</div>
          <!-- <div class="item" id="item4">Fourth</div> -->
      </div>
  </body>
  
  </html>`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
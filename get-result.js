const http = require('http');

http.get('http://localhost:5000/api/assignments', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const last = json.data[0];
    
    http.get('http://localhost:5000/api/results/' + last._id, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => console.log(data2.substring(0, 500)));
    });
  });
});

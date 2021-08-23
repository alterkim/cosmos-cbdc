const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const port = 3030
const cors = require('cors')
const exec = require('child_process').exec
app.use(
    express.urlencoded({
      extended: true
    })
  )
app.use(cors())
app.use(express.json())




app.post('/v1/transfer', (req, res) => {
    try{
        var cmd = `yes y | sh CBDC.sh ${req.body.sender} ${req.body.receiver} ${req.body.amount}${req.body.token}` 
        
        //console.log(cmd)
        exec(cmd,
            function (error, stdout, stderr) {
                //console.log('stdout: ' + stdout);
                //console.log('stderr: ' + stderr);
                if (error !== null) {
                //console.log('exec error: ' + error);
                }
            });
        
    }catch(error){
        console.log(error)
    }
    
    res.send(cmd);
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

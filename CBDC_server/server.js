import express from 'express'
import cors from 'cors'
import exe from 'child_process'
// import { dbService } from './fbase.js';

const app = express();
const port = 3030
const exec = exe.exec;

app.use(
    express.urlencoded({
      extended: true
    })
  )
app.use(cors())
app.use(express.json())

app.post('/v1/cosmos/transfer', (req, res) => {
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

app.post('v1/line/transfer', (req, res) => {
    try {
      var cmd = `yes y | sh line.sh ${req.body.sender} ${req.body.receiver} ${req.body.amount}${req.body.token}`

      exec(cmd,
          function (error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error);
            }
          });

    } catch(error) {
      console.log(error)
    }
})

  app.listen(port, () => {
    console.log(`CBDC server listening at http://localhost:${port}`)
  })

var blocknum;

app.get('/v1/blocknum', (req, res)=> {
    try {
        var cmd = `yes y | sh blocknum.sh`
        
        exec(cmd,
              function (error, stdout, stderr){
                const obj = JSON.parse(stdout)
                blocknum = obj.block.header.height

                if (error !== null) {
                  //console.log('exec error: ' + error);
                  }
              });
    } catch(error) {
        console.log(error)
    }
    res.send(blocknum)
})

// async function UpdateBlockNum() {
//     try {
//         var cmd = `yes y | sh blocknum.sh`

//         exec(cmd,
//               function (error, stdout, stderr){
//                 const ojb = JSON.parse(stdout)
//                 _blocknum = obj.block.header.height
//               });
          
//         await dbService
//               .collection(`CrossBlockInfo`)
//               .doc("cosmos")
//               .update({blocknum: _blocknum})
        
        
//     } catch (error) {
//       console.log(error)
//     }
// }

// setInterval(()=>{
//   UpdateBlockNum()
// },2000)
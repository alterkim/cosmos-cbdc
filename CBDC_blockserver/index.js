const request = require('request');
const Caver = require('caver-js')
const caver = new Caver('http://141.223.212.120:8551/')

const url_cosmos = `http://localhost:1317/blocks/latest`;
const url_line =  `http://localhost:26667/status`;

var admin = require('firebase-admin');
var serviceAccount = require("/home/alter/workspace/hana-cbdc2-firebase-adminsdk-j4ag7-344ceae083.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const dbService = admin.firestore();


function requestCosmosBlockNumber() {
    var blockNumber;
    request(url_cosmos, function(error, response, body) {
        if(!error && response.statusCode==200) {
            result = JSON.parse(body);
            blockNumber = parseInt(result.block.header.height);
            updateCrossBlockInfo("cosmos", blockNumber);
        }
    });
}

function requestLineBlockNumber() {
    request(url_line, function(error, response, body) {
        if(!error && response.statusCode==200) {
            result = JSON.parse(body);
            blockNumber = parseInt(result.result.sync_info.latest_block_height);
            updateCrossBlockInfo("line", blockNumber)
        }
    })
}

async function requestKlaytnBlockNumber() {
    const blockNum = await caver.rpc.klay.getBlockNumber();
    return parseInt(blockNum)
}

async function updateCrossBlockInfo(chain, blockNum) {
    console.log(chain + " update: " + blockNum)
    try {
        await dbService
            .collection(`CrossBlockInfo`)
            .doc(chain)
            .update({
                blocknum: blockNum
        });
    } catch(error) {
        console.log(error)
    }
}

function processKlaytn() {
    requestKlaytnBlockNumber().then(function(result) {
        var blockNumber = result;
        updateCrossBlockInfo("klaytn", blockNumber)
    })
}

function processCosmos() {
    requestCosmosBlockNumber();
}

function processLine() {
    requestLineBlockNumber();
}


setInterval(processKlaytn, 3000);
setInterval(processCosmos, 3000);
setInterval(processLine, 3000);
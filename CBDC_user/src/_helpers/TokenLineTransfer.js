const TokenLineTransfer = async(amount, _sender, _receiver) =>{
    const tokenName = "dthb";
    var blockNumber = 0;
    await fetch('http://141.223.181.204:3030/v1/line/transfer',{
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method : 'POST',
        body :JSON.stringify({sender : _sender, receiver: _receiver, amount:amount, token:tokenName})
    })
    .then((response) => response.json())
    .then((data) => blockNumber = data.height)

    return blockNumber
}

export default TokenLineTransfer
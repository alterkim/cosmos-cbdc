const TokenLineTransfer = async(amount, _sender, _receiver) =>{
    const tokenName = "dthb";
    const req = await fetch('http://localhost:3030/v1/line/transfer',{
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method : 'POST',
        body :JSON.stringify({sender : _sender, receiver: _receiver, amount:amount, token:tokenName})
    }) 
}

export default TokenLineTransfer
const TokenTransfer = async(amount, _sender, _receiver) =>{
    const tokenName = "token";
    const req = await fetch('http://141.223.181.204:3030/v1/cosmos/transfer',{
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method : 'POST',
        body :JSON.stringify({sender : _sender, receiver: _receiver, amount:amount, token:tokenName})
    }) 
}

export default TokenTransfer
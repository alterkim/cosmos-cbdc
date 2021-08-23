const TokenTransfer = async(amount) =>{
    const tokenName = "token";
    const req = await fetch('http://141.223.82.142:3030/v1/transfer',{
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method : 'POST',
        body :JSON.stringify({sender : "cosmos1qwf9gvqh538rnjmtnq4xmaxmm74yjv9wd8htjt", receiver:"cosmos1qz49l8dc3ay5aun2hkndld962scnhg8adj3qa7", amount:amount, token:tokenName})
    }) 
}

export default TokenTransfer
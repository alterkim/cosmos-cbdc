const TokenTransfer = async(amount) =>{
    const tokenName = "token";
    const req = await fetch('http://localhost:3030/v1/transfer',{
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method : 'POST',
        body :JSON.stringify({sender : "cosmos1yqch4dkeaxmrk4pf75h8444q8ly0qd5a65xv7c", receiver:"cosmos17tnatqa2fhy3edywvd2fpw2lh6js0ue4u7wv93", amount:amount, token:tokenName})
    }) 
}

export default TokenTransfer
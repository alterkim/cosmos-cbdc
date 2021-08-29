const TokenTransfer = async(amount) =>{
    const tokenName = "token";
    const req = await fetch('http://localhost:3030/v1/transfer',{
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method : 'POST',
        body :JSON.stringify({sender : "cosmos18k8lqe0dgv3ruq7ymqg8v0j0yeqe306es8m4el", receiver:"cosmos1jzr0u0dlzh5skcev9jrf4089850q7jxfazyp3z", amount:amount, token:tokenName})
    }) 
}

export default TokenTransfer
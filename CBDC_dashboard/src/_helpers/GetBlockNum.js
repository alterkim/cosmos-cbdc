const GetBlockNum = async() => {
    await fetch('http://localhost:3030/v1/blocknum')
        .then(response => response.text())
        .then((response)=> {
            return response
        })
        .catch((error) => console.log(error))
    
}

export default GetBlockNum
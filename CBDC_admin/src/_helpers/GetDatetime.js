const GetDatetime = () =>{
    var now = new Date()
    var datetime = now.getUTCFullYear().toString() + "/" +
        (now.getUTCMonth() + 1).toString() +
        "/" + now.getUTCDate() + " " + (now.getUTCHours()+9).toString() +
        ":" + (now.getUTCMinutes() < 10 ? '0'+now.getUTCMinutes():now.getUTCMinutes()) +
        ":" + (now.getUTCSeconds() < 10 ? '0'+now.getUTCSeconds():now.getUTCSeconds());
    return datetime
}


export default GetDatetime

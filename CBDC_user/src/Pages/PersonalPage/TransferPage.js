import React from "react"
import { Transfer } from "../Components/Transfer";

const TransferPage = ({userInfo}) => {
    
    return (
        <Transfer userInfo={userInfo} returnPage={'/personal/cbdc'}></Transfer>
    )
}

export { TransferPage }

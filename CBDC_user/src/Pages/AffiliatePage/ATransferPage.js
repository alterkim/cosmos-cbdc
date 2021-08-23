import React from "react"
import { Transfer } from "../Components/Transfer";

const ATransferPage = ({affiliateInfo}) => {
    return (
        <Transfer userInfo={affiliateInfo} returnPage={'/affiliate/cbdc'}></Transfer>
    )
}

export { ATransferPage }

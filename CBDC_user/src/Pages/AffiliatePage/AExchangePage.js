import React from "react"
import { Exchange } from "../Components/Exchange";



const AExchangePage = ({affiliateInfo}) => {
    return (
        <Exchange userInfo={affiliateInfo} returnPage={'/affiliate/CBDC'}></Exchange>
    )
}

export { AExchangePage }

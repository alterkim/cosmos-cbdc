import React from "react"
import { Exchange } from "../Components/Exchange";



const ExchangePage = ({userInfo}) => {
    return (
        <Exchange userInfo={userInfo} returnPage={'/personal/CBDC'}></Exchange>
    )
}

export { ExchangePage }
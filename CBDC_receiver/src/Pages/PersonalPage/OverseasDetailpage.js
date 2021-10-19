import React, { useEffect, useState } from "react"
import styled from 'styled-components'
import { dbService } from "../../fbase"
import { history } from "../../_helpers"

const OverseasDeatailPage = () => {
    const logoStyle = {
        height: '8vh',
        width: '50vw',
        marginRight: '3vw'
    }

    return(
        <div>
            <Header>
                <img src={"/images/bangkok_bank.png"} style={logoStyle}/>
            </Header>
            <Mline/>
        </div>
    )
}

export { OverseasDeatailPage }

const Header = styled.div`
    background-color: #fff;
    height: 6.76vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    font-size: 4vw;
    font-weight: 600;
`
const Mline = styled.div`
    height: 1.4px;
    width: 100%;
    background-color: #e2e2e2;
`
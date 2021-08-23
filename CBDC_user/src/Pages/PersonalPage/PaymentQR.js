import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';

const PaymentQR = () => {

    let timeout;

    useEffect(()=>{
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            history.goBack()
        },3000)
    },[])
    try{
        return (
            <div>
                <Header>
                    <FontAwesomeIcon 
                        icon={faChevronLeft} 
                        style={{color: "#000", fontSize: '4vw', marginLeft: '5vw',cursor:'pointer'}}
                        onClick={() => history.goBack()}
                    />
                    <HeaderText>결제하기</HeaderText>
                    <div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                    </div>
                </Header>
                <Body>
                    <QRImage src="/images/qr-1.png" />
                    <Separator></Separator>
                </Body>
            </div>
        )
    }catch(error)
    {
        console.log("error")
    }
    
}

export { PaymentQR }

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
const Body = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 6.76vh);
    background-color: #8e8e8e;
`
const HeaderText = styled.div`
    color: #000;
`
const QRImage = styled.img`
    width: 60vw;
`
const Separator = styled.div`
    position: absolute;
    width: 70vw;
    height: 4px;
    border-radius: 2px;
    background-color: #f53737;
    top: 47vh;
    left: 15vw;
`
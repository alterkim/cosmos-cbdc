import React from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';

const PersonalPage = ({userInfo}) => {
    
    const totalCBDC = userInfo.common_cbdc_balance + userInfo.reduce_cbdc_balance + userInfo.extinct_cbdc_balance

    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw',cursor:'pointer'}}
                    onClick={() => history.push('/')}
                />
                <HeaderText style={{marginLeft: 40}}>전계좌조회</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <Button style={{marginTop: 40}} href="personal/save">
                    <div>저축예금</div>
                    <div><span style={{color: "#212121"}}>{userInfo.fiat_balance&&userInfo.fiat_balance.toLocaleString()}</span> 원</div>
                </Button>
                <Button style={{marginTop: 15}} href="personal/CBDC">
                    <div>CBDC</div>
                    <div><span style={{color: "#212121"}}>{totalCBDC&&totalCBDC.toLocaleString()}</span> D-KRW</div>
                </Button>
            </Body>
        </div>
    )
}

export { PersonalPage }

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
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`
const HeaderText = styled.div`
    color: #000;
`
const Button = styled.a`
    width: 85vw;
    height: 11.89vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 3.6vw;
    border: 1px solid #e9e9e9;
    background: #ffffff;
    padding-left: 20px;
    padding-right: 20px;
    color: #000000;
    text-decoration: unset;
    font-weight: 600;
    font-size: 4vw;
    box-shadow: 1px 2px 6px 1px #bfcfea;
`
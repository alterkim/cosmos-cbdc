import React from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';

const ASaveAccountPage = ({affiliateInfo}) => {
    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw',cursor:'pointer'}}
                    onClick={() => history.push('/affiliate')}
                />
                <HeaderText style={{marginLeft: 40}}>전계좌조회</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <CardChild>
                    <div style={{display: 'flex', alignItems: 'center' }}>
                        <CardChildName>기업자유예금</CardChildName>
                        <div style={{marginLeft: 'auto', marginRight: 30, fontWeight: 600, fontSize: '6vw'}}>
                            {affiliateInfo.fiat_balance&&affiliateInfo.fiat_balance.toLocaleString()} <span style={{fontSize: '4vw'}}>원</span>
                        </div>
                    </div>
                    <span style={{marginLeft:20}}>257-2572-2572</span>
                    <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                        <Button2 
                            style={{marginLeft: 'auto'}}
                            //onClick={() => history.push('/affiliate/Exchange')}
                        >이체</Button2>
                        <Button1
                            style={{
                                marginLeft: 5, 
                                marginRight: 20
                            }}
                            onClick={() => history.push('/affiliate/deal/save')}
                        >
                            거래내역
                        </Button1>
                    </div>
                </CardChild>
            </Body>

        </div>
    )
}

export { ASaveAccountPage }

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
const CardChild = styled.div`
    width: 90vw;
    height: 16.31vh;
    padding-top: 3.5vh;
    padding-bottom: 3vh;
    border-top: 1px solid #dcdcdc;
    box-shadow: 1px 2px 6px 1px #bfcfea;
    border-radius: 4vw;
    margin-top: 4vw;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const CardChildName = styled.div`
    margin-left: 20px;
    color: #414141;
    font-size: 4vw;
    font-weight: 600;
`
const Button1 = styled.button`
    color: #ffffff;
    height: 4.19vh;
    border-radius: 2vh;
    border: none;
    background-color: #00b2a7;
    font-size: 3.6vw;
    outline: none;
    padding: 0.5vw 1.5vh;
`
const Button2 = styled.button`
    color: #adacac;
    min-height: 4.19vh;
    border-radius: 2vh;
    background-color: #ffffff;
    border: 1px solid #adacac;
    outline: none;
    font-size: 3.6vw;
    padding: 0.5vw 1.5vh;
`
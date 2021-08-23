import React from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';

const ACBDCPage = ({affiliateInfo}) => {
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
                <CardHeader>
                    <CardName>CBDC</CardName>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <CardName>{affiliateInfo.common_cbdc_balance &&affiliateInfo.common_cbdc_balance.toLocaleString()}</CardName>
                        <CardMoney>D-KRW</CardMoney>    
                    </div>
                </CardHeader>
                <CardBody>
                    <CardChild style={{marginTop: 50}}>
                        <CardChildName>가맹점 보유금</CardChildName>
                        <span style={{marginLeft:20}}>147-1471-1471</span>
                        <span style={{marginLeft:20}}>(cosmos456zzt)</span>
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 30, fontWeight: 600, fontSize: '6vw'}}>
                                {affiliateInfo.common_cbdc_balance &&affiliateInfo.common_cbdc_balance.toLocaleString()} <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                            <Button1 
                                style={{marginLeft: 'auto'}}
                                onClick={() => history.push('/affiliate/Exchange')}
                            >교환</Button1>
                            <Button1 
                                style={{marginLeft: 5}}
                                onClick={() => history.push('/affiliate/transfer')}
                            >
                                이체
                            </Button1>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    marginRight: 20
                                }}
                                onClick={() => history.push('/affiliate/deal/cbdc')}
                            >
                                거래내역
                            </Button1>
                        </div>
                    </CardChild>
                </CardBody>
            </Body>

        </div>
    )
}

export { ACBDCPage }

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
    font-weight: 600;
`
const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90vw;
    height: 11.88vh;
    background-color: #00b2a7;
    color: #000;
    font-weight: 600;
    font-size: 16.56vw;
    border-radius: 4vw;
    box-shadow: 1px 2px 6px 1px #bfcfea;
    margin-top: 30px;
`
const CardName = styled.div`
    font-size: 6.3vw;
    font-weight: 600;
    margin-left: 15px;
`
const CardMoney = styled.div`
    font-size: 4vw;
    font-weight: 500;
    color: #212121;
    margin: 0 15px;
`
const CardBody = styled.div`
    min-height: 200px;
    margin-bottom: 4vw;
`
const CardChild = styled.div`
    width: 90vw;
    height: 18.31vh;
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
    font-size: 3.73vw;
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
    cursor : pointer;
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
import React from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';

const SaveAccountPage = ({userInfo}) => {
    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw',cursor:'pointer'}}
                    onClick={() => history.push('/personal')}
                />
                <HeaderText style={{marginLeft: 40}}>전계좌조회</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <CardBody>
                    <CardChild>
                        <div style={{display: 'flex', justifyContent: 'space-between' }}>
                            <CardChildName>저축예금</CardChildName>
                            <div style={{fontWeight: 600, fontSize: '5vw', marginRight: 20}}>
                                {userInfo.fiat_balance&&userInfo.fiat_balance.toLocaleString()} 원
                            </div>
                        </div>
                        <span style={{marginLeft:20}}>111-1111-1111</span>
        
                        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
                            <Button2 
                                style={{marginLeft: 5}}
                                // onClick={() => history.push('/personal/transfer')}
                            >
                                이체
                            </Button2>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    marginRight: 20
                                }}
                                onClick={() => history.push('/personal/deal/save')}
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

export { SaveAccountPage }

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
const CardBody = styled.div`
    min-height: 200px;
    margin-bottom: 4vw;
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
    color: #000;
    font-size: 4.5vw;
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
    height: 4.19vh;
    border-radius: 2vh;
    background-color: #ffffff;
    border: 1px solid #adacac;
    outline: none;
    font-size: 3.6vw;
    padding: 0.5vw 1.5vh;
`
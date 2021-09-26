import React, {useState} from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';

const ACBDCPage = ({affiliateInfo}) => {
    const [modalcommon, setModalcommon] = useState(false)

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
                        <div style={{display: 'flex', alignItems: 'center', marginTop:10}}>
                            <Button1
                                style={{marginLeft:'auto'}}
                                onClick={() => setModalcommon(true)}
                            >거래선택
                            </Button1>
                            <Button1
                                style={{marginLeft: 45, marginRight: 27}}
                                onClick={() => history.push('/affiliate/deal/cbdc')}
                            >거래내역
                            </Button1>
                        </div>
                    </CardChild>
                </CardBody>
            </Body>
            {modalcommon && <Modal>
                <ModalBackground onClick={() => setModalcommon(false)}></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div style={{marginLeft: 180, fontSize: '4.5vw'}}>거래 선택</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setModalcommon(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <MButton onClick={() => history.push('/affiliate/Exchange')}>교환</MButton>
                    <Mline/>
                    <MButton onClick={() => history.push('/affiliate/transfer')}>이체</MButton>
                    <Mline/>
                    <MButton onClick={() => history.push('/affiliate/cancel')}>결제 취소 승인/거절</MButton>
                    <Mline/>
                </ModalContent>
                </Modal>}
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
    height: 4vh;
    border-radius: 2.5vh;
    border: none;
    background-color: #00b2a7;
    font-size: 3.6vw;
    outline: none;
    padding: 0.5vw 4.0vh;
    cursor : pointer;
`
const Button2 = styled.button`
    color: #ffffff;
    height: 4vh;
    border-radius: 2.5vh;
    border: none;
    background-color: #00b2a7;
    font-size: 3.6vw;
    outline: none;
    padding: 0.5vw 2.5vh;
    cursor : pointer;
`
const Modal = styled.div`
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
`
const ModalContent = styled.div`
    top: 70%;
    height: 80%;
    width: 95%;
    border-radius:5px;
    position: fixed;
    z-index: 1000;
    font-size: 13px;
    background-color: #ffffff;
    transfrom: translate(-50%,-50%);
    overflow-y: auto;
    margin-left: 10px;
`
const ModalBackground = styled.div`
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #000000;
    opacity: 0.4;
`
const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6.08vh;
    background-color: #fff;
    color: #000;
    font-size: 3.7vw;
    font-weight: 600;
    font-weight: 600;
`
const Mline = styled.div`
    height: 1.4px;
    width: 110%;
    background-color: #808080;
`
const MButton = styled.div`
    width: 100%;
    color: #000000;
    height: 2vh;
    background-color: #ffffff;
    font-size: 3.5vw;
    outline: none;
    padding: 3.5vw 2.5vh;
    cursor: pointer;
`
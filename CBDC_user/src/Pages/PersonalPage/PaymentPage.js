import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';
import { dbService, firebaseInstance } from "../../fbase";
import GetDatetime from "../../_helpers/GetDatetime";
import {useLocation} from "react-router"
import TokenTransfer from "../../_helpers/TokenTransfer";

const PaymentPage = ({userInfo,affiliateInfo}) => {
    const location = useLocation()
    const [modalshow, setModalshow] = useState(false)
    const [amount, setAmount] = useState(0)
    
    var clickBtn
    try{
        clickBtn = location.state.cbdcType
    }catch{
        clickBtn = "common"
    }


    const onClickCBDC = (value) =>{
        if(value === "extinct"){
            setModalshow(true)
        }
    }
    const onClickQR = () => {
        history.push('/personal/payment/read-qr');
    }

    const onClickPayment = async() => {
        if(amount !== "0"){
            var val = Number(amount.replace(/\D/g, ''))
            
            const receiverSnapshot = await dbService
                .collection(`UserInfo`)
                .where('name','==',affiliateInfo.name)
                .get()
            const receiverData = receiverSnapshot.docs[0].data()
            

            
            await dbService
                .collection(`TxInfo`)
                .add({
                    sender_account : userInfo.account,
                    sender_wallet : userInfo.wallet,
                    sender_name : userInfo.name,
                    receiver_name : receiverData.name,
                    receiver_wallet : receiverData.wallet,
                    receiver_account : receiverData.account,
                    amount : val,
                    transaction_type : "결제",
                    transaction_date : GetDatetime(),
                    cbdc_type : clickBtn
                })
            var user_cbdc_balance = {}
            user_cbdc_balance[clickBtn + "_cbdc_balance"] = firebaseInstance.firestore.FieldValue.increment(-val)
            await dbService
                .doc(`UserInfo/${userInfo.uid}`)
                .update(user_cbdc_balance)
            
            var affiliate_cbdc_balance ={}
            affiliate_cbdc_balance["common_cbdc_balance"] = firebaseInstance.firestore.FieldValue.increment(val)
            await dbService
                .doc(`UserInfo/${affiliateInfo.uid}`)
                .update(affiliate_cbdc_balance)
            
    
            TokenTransfer(val)
                  
            history.push('/personal/CBDC')
            window.location.reload();
        }
    }
    const onChangeAmount = (e) =>{

        var val = Number(e.target.value.replace(/\D/g, ''))
        setAmount(val.toLocaleString())
    }


    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw'}}
                    onClick={() => history.push('/personal/CBDC')}
                />
                <HeaderText>결제하기</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight: '5vw',cursor:'pointer'}}/>
                </div>
            </Header>
            <Body>
                <Title style={{marginTop: '2vh'}}>가맹점 QR읽기</Title>
                <Box style={{marginBottom: '4vh',cursor:'pointer'}} >
                    <img src="/images/capture.png" alt="qr" onClick={onClickQR} />
                </Box>
                <Title style={{marginTop: '2vh'}}>사용가능 CBDC <span style={{color: '#00b2a7'}}>(한가지 선택)</span></Title>
                
                
                <Box style={{justifyContent: 'space-between', backgroundColor : (clickBtn === "common"? '#ccfdfa' : "#fffff") }}  onClick={()=>onClickCBDC("common")}>
                    <Content>일반자금 </Content>
                    <Content> <span style={{fontSize: '4.5vw'}}>{userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString()}</span> &nbsp;&nbsp; D-KRW</Content>
                </Box>
                {
                    (userInfo.extinct_cbdc_balance !== 0) &&
                    <Box style={{justifyContent: 'space-between', marginTop: '2vh', backgroundColor : (clickBtn === "extinct"? '#ccfdfa' : "#fffff") }}  onClick={()=>onClickCBDC("extinct")}>
                        <Content>재난지원금 <span> <Badge>소멸형</Badge> </span></Content>
                        <Content> <span style={{fontSize: '4.5vw'}}>{userInfo.extinct_cbdc_balance&&userInfo.extinct_cbdc_balance.toLocaleString()}</span> &nbsp;&nbsp; D-KRW</Content>
                    </Box>
                }
                {
                    (userInfo.reduce_cbdc_balance !== 0)&&
                    <Box style={{justifyContent: 'space-between', marginTop: '2vh', backgroundColor : (clickBtn === "reduce"? '#ccfdfa' : "#fffff")}} onClick={()=>onClickCBDC("reduce")}>
                        <Content>재난지원금 <span> <Badge>감소형</Badge> </span></Content>
                        <Content> <span style={{fontSize: '4.5vw'}}>{userInfo.reduce_cbdc_balance&&userInfo.reduce_cbdc_balance.toLocaleString()}</span> &nbsp;&nbsp; D-KRW</Content>
                    </Box>
                }
                
                

                <Title style={{marginTop: '4vh'}}>내 QR/바코드로 결제하기 <span style={{color: '#00b2a7'}}>(한가지 선택)</span></Title>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20vh'}}>
                    <Card style={{border: '2px solid #ccfdfa'}}>
                        <CardHeader style={{backgroundColor: '#ccfdfa'}}>
                            <div style={{fontSize: '2.67vw'}}>내 QR로 결제하기</div>
                        </CardHeader>
                        <CardBody>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img src="/images/qr.png" alt="qr" style={{width: '50%'}} />
                            </div>
                        </CardBody>
                    </Card>
                    <Card style={{border: '2px solid #e6e9e9'}}>
                        <CardHeader style={{backgroundColor: '#e6e9e9'}}>
                            <div style={{fontSize: '2.67vw'}}>내 바코드로 결제하기</div>
                        </CardHeader>
                        <CardBody>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <img src="/images/barcode.png" alt="qr" style={{width: '80%'}} />
                            </div>
                        </CardBody>
                    </Card>    
                </div>
            </Body>
            <div style={{position: 'fixed', bottom: '8.45vh', 
                        left: 0, width: '100vw', display: 'flex', 
                        justifyContent: 'center', alignItems: 'center', 
                        borderTop: '1.35vh solid #eae9e9', 
                        backgroundColor: '#fff'
                    }}>
                <Amount>
                    <div style={{fontSize: '3.8vw'}}>금액입력</div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <PriceInput defaultValue="0" value={amount} onChange={onChangeAmount} />
                        <div style={{fontSize: '3.8vw', marginLeft: 10}}>D-KRW</div>
                    </div>
                </Amount>
            </div>
            <ExRunButton onClick={onClickPayment}>
                결제하기
            </ExRunButton>
            {modalshow && <Modal>
                <ModalBackground></ModalBackground>
                <ModalBody>
                    <div
                        style={{fontSize: '3.8vw', fontWeight: 600}}
                    >
                        사용가능 가맹점이 아닙니다.
                    </div>
                    <div style={{
                        marginTop: 20,
                        width: '80%',
                        textAlign: 'center',
                        fontSize: '3.7vw',
                        color: "#6c6969"
                    }}>
                        재난지원금의 경우, 사용처 제한이<br/> 있을 수 있으니 확인 하세요.
                    </div>
                    <button
                        onClick={() => setModalshow(false)}
                        style={{
                            marginTop: 40,
                            width: '70vw',
                            height: '5.14vh',
                            backgroundColor: '#00b2a7',
                            color: '#ffffff',
                            fontSize: '3.8vw',
                            border: 'none',
                            borderRadius: 3,
                            outline: 'none'
                        }}
                    >
                        닫기
                    </button>
                </ModalBody>
            </Modal>}
        </div>
    )
}

export { PaymentPage }

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
const Title = styled.div`
    color: #000;
    font-size: 3.8vw;
    font-weight: 600;
    width: 90vw;
    margin-bottom: 2vh;
`
const Box = styled.div`
    width: 90vw;
    height: 9.26vh;
    border: 1px solid #e9e9e9;
    border-radius: 3.75vw;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0vw 2vw;
`
const Content = styled.div`
    color: #000;
    font-size: 3.8vw;
    font-weight: 600;
    display: flex;
    align-items: center;
`
const Badge = styled.div`
    background-color: #f53737;
    width: fit-content;
    color: #fff;
    height: 2.4vh;
    border-radius: 1.28vh;
    padding: 0 0.4vw;
    font-size: 3vw;
`
const Amount = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90vw;
    margin: 2vw 0;
`
const PriceInput = styled.input`
    border: 1px solid #cfcccc;
    border-radius: 5px;
    text-align: right;
    width: 50.9vw;
    height: 7.5vh;
    font-size: 4vw;
    padding-right: 20px;
`
const ExRunButton = styled.button`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 8.45vh;
    background-color: #00b2a7;
    border: none;
    font-size: 4.5vw;
    color: #ffffff;
`
const Card = styled.div`
    width: 44.5vw;
    height: 21.1vh;
    border-radius: 4vw;
    margin: 10px;
`
const CardHeader = styled.div`
    height: 4.5vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3.8vw 3.8vw 0 0;
    font-weight: 600;
`
const CardBody = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
`
const Modal = styled.div`
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
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
const ModalBody = styled.div`
    position: fixed;
    z-index: 1000;
    top: 20vh;
    right: 20px;
    left: 20px;
    padding: 20px 10px;
    font-size: 3.8vw;
    border-radius: 5px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
`

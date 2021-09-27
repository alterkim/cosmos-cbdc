import { faChevronLeft, faHome, faSearch, faCog, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, {useEffect, useState} from "react"
import styled from "styled-components"
import { history } from '../../_helpers'
import { dbService } from "../../fbase"

const CancelPage = ({userInfo}) => {
    const [paymenttxs, setPaymentTxs] = useState([])
    const [state, setState] = useState(false)
    const [canceltx, setCancelTx] = useState({})
    const [modalshow, setModalshow] = useState(false)
    const [modalcomplete, setModalcomplete] = useState(false)
    const curDate = new Date().getUTCFullYear().toString()+"-"+(new Date().getUTCMonth()+1).toString()
    const getPaymentTxHistory = async(e) => {
        try {
            var userPaymentSnapshot = await dbService
                .collection(`TxInfo`)
                .where("transaction_type", "==", "결제")
                .get()
            
            const txsArray = userPaymentSnapshot.docs.map((doc)=>({
                ...doc.data()
            })).sort(function(a,b) {
                if(a.transaction_date > b.transaction_date){
                    return -1;
                }
                if(a.transaction_date < b.transaction_date){
                    return 1;
                }
                return 0;
            })
            setPaymentTxs(txsArray.filter(tx => tx.cbdc_type === "common" 
            && tx.sender_account ===userInfo.account))
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        getPaymentTxHistory()
    }, [userInfo, setPaymentTxs])

    const onClickPaymentCancel = async() => {
        try {
            const cancelSnapshot = await dbService
                .collection(`TxInfo`)
                .where('tx_id', '==', canceltx.tx_id)
                .get()

            await dbService.collection(`TxInfo`)
                .doc(cancelSnapshot.docs[0].id)
                .update({payment_cancel_progress: "결제취소요청"})
        } catch(error) {
            console.log(error)
        }

        setModalshow(false)
        setModalcomplete(true)
    }

    const onClickClose = async() => {
        setModalcomplete(false)
        window.location.reload()
    }

    return(
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor:'pointer'}}
                    onClick={()=> history.push('/personal/CBDC')}
                />
                <HeaderText>결제 취소 요청</HeaderText>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: '3vw'}}/>
                    <Dbutton style={{marginRight: '4vw', cursor: 'pointer'}} onClick={() => history.push('/personal/CBDC')}>D</Dbutton>
                </div>
            </Header>
            <Body>
            <CardChild>
                    <div style={{display: 'flex', flexDirection: 'column', padding: '0 4vw'}}>
                        <div style={{marginTop: '2vw', color: '#000', fontSize:'3.73vw'}}>
                        <img 
                            src={"/images/hana_logo.png"} 
                            alt="logo"
                            style={{
                                height:20,
                                marginRight:10
                            }}
                        />CBDC-일반자금</div>
                        <span style={{marginLeft:20}}>123-1231-1231</span>
                        <span style={{marginLeft:20}}>(cosmos1x92f6)</span>
                        
                        <div style={{marginTop: '6vw', display: 'flex', justifyContent: 'flex-end', position: 'relative'}}>
                            <div style={{fontSize: '6vw'}}>{userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString()} <span style={{fontSize: '4vw'}}>D-KRW</span></div>
                        </div>
                    </div>
                </CardChild>
                <Tools>
                    <IconButton>
                        <FontAwesomeIcon icon={faSearch} style={{fontSize: '5.73vw'}} />
                    </IconButton>
                    <SearchText>1개월 &nbsp;&nbsp;&nbsp; 전체 &nbsp;&nbsp;&nbsp; 최신 &nbsp;&nbsp;&nbsp;</SearchText>
                    <IconButton>
                        <FontAwesomeIcon icon={faCog} style={{fontSize: '5.73vw'}}  />
                    </IconButton>
                </Tools>
                <List>
                    <ListHeader>
                        <ListDate>{curDate}</ListDate>
                        <ListShow onClick={() => setState(!state)}>
                            <FontAwesomeIcon
                                icon={state? faChevronDown : faChevronUp} 
                                style={{fontSize: '3.7vw', color: '#00b2a7', cursor: 'pointer'}}/>
                        </ListShow>
                    </ListHeader>
                    {!state && <ListBody>
                        {
                            paymenttxs.map((tx,index) => (
                                <ListItem key={index}>
                                    <ListItemLeft>
                                        <Time>{tx.transaction_date}</Time>
                                        <Content>{tx.receiver_name} {' '} {tx.transaction_type}</Content>
                                    </ListItemLeft>
                                    <ListItemRight style={{textAlign: 'right'}}>    
                                        {
                                            tx.receiver_name === userInfo.name
                                            ?(
                                                <>{tx.amount.toLocaleString()}</>
                                            )
                                            :
                                            ( tx.transaction_type == "결제취소"?(
                                                <>{(tx.amount).toLocaleString()}</>
                                            ):(
                                                <>{(-tx.amount).toLocaleString()}</>
                                            ))
                                        }
                                        <br/>
                                        D-KRW
                                    </ListItemRight>
                                    {tx.payment_cancel_progress == undefined?(
                                        <>
                                            <PaymentCancelButton
                                                onClick={() => {
                                                    setModalshow(true)
                                                    setCancelTx(tx)
                                                }}
                                            >결제취소<br/>요청</PaymentCancelButton>
                                        </>
                                    ):(tx.payment_cancel_progress == "결제취소요청"?(
                                        <>
                                            <CancelButton2>결제취소<br/>진행중</CancelButton2>
                                        </>
                                    ):(tx.payment_cancel_progress == "결제취소승인"?(
                                        <>
                                            <CancelButton2>결제취소<br/>완료</CancelButton2>
                                        </>
                                    ):(
                                        <>
                                        </>
                                    )))}
                                </ListItem>
                            ))
                        }
                    </ListBody>}
                </List>
            </Body>
            {modalshow && <Modal>
                <ModalBackground onClick={() => setModalshow(false)}></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div style={{marginLeft: 110, fontSize: '4.5vw'}}>결제 취소요청</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setModalshow(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <CardChild2>
                        <div style={{display: 'flex', flexDirection: 'column', padding: '0.4vw', marginLeft:10}}>
                            <div style={{marginTop: '1vw', color: '#000', fontSize: '3.4vw'}}>
                                <img
                                    src={"/images/hana_logo.png"}
                                    alt="logo"
                                    style={{
                                        height: 18,
                                        marginRight:9
                                    }}
                                />거래내역-상세
                            </div>
                            <span style={{marginLeft:20, marginBottom:4, marginTop:6}}>결제자: {canceltx.sender_name}</span>
                            <span style={{marginLeft:20, marginBottom:4, marginTop:3}}>결제처: {canceltx.receiver_name}</span>
                            <span style={{marginLeft:20, marginBottom:4, marginTop:3}}>결제시간: {canceltx.transaction_date}</span>
                            <div style={{marginTop: '1vw', display: 'flex', justifyContent: 'flex-end', position: 'relative', marginRight: 10}}>
                                <div style={{fontSize: '5vw'}}>{canceltx.amount&&canceltx.amount.toLocaleString()} <span style={{fontSize: '3vw'}}>D-KRW</span></div>
                            </div>
                        </div>
                    </CardChild2>
                    <div style={{textAlign: 'center', marginTop: 20, marginBottom: 20, fontSize: '3vw'}}>가맹점 앞으로 결제 취소요청 하시겠어요?</div>
                    <div style={{display: 'flex', position: 'relative'}}>
                        <CancelButton>취소</CancelButton>
                        <PaymentCancelButton2 onClick={onClickPaymentCancel}>결제취소 요청</PaymentCancelButton2>
                    </div>
                </ModalContent>
            </Modal>}
            {modalcomplete && <Modal>
                <ModalBackground></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div style={{marginLeft: 110, fontSize: '4.5vw'}}>결제 취소요청</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setModalcomplete(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <div style={{marginTop: 50, marginBottom: 80, textAlign: 'center', fontSize: '16px'}}>가맹점 앞으로 결제 취소요청이 완료되었습니다.</div>
                    <CloseButton onClick={onClickClose}>닫기</CloseButton>
                </ModalContent>
            </Modal>}
        </div>
    )
}

export { CancelPage }

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
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`

const HeaderText = styled.div`
    color: #000;
`

const Dbutton = styled.button`
    color: #ffffff;
    background-color: #00b2a7;
    font-size: 3.73vw;
    font-weight: 600;
    width: 4.5vw;
    height: 4.5vw;
    border-radius: 2vw;
    border: none;
    text-align: center;
`

const CardChild = styled.div`
    width: 90vw;
    height: 12.31vh;
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
const CardChild2 = styled.div`
    background-color: #f8f8f8;
    height: 12.31vh;
    padding-top: 2vh;
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
const CancelButton = styled.button`
    color: #000000;
    background-color: #ffffff;
    font-size: 3.73vw;
    font-weight: 600;
    width: 30vw;
    height: 10vw;
    border: 1px solid #dcdcdc;
    text-align: center;
    cursor: pointer;
`

const PaymentCancelButton = styled.button`
    color: #ffffff;
    background-color: #00b2a7;
    font-size: 3.73vw;
    font-weight: 600;
    width: 25vw;
    height: 12vw;
    border-radius: 2vw;
    border: none;
    text-align: center;
    cursor: pointer;
`
const PaymentCancelButton2 = styled.button`
    color: #ffffff;
    background-color: #00b2a7;
    font-size: 3.73vw;
    font-weight: 600;
    width: 60vw;
    height: 10vw;
    text-align: center;
    cursor: pointer;
    border: 1px solid #dcdcdc;
`
const CloseButton = styled.button`
    color: #ffffff;
    background-color: #00b2a7;
    font-size: 3.73vw;
    font-weight: 600;
    width: 100%;
    height: 10vw;
    text-align: center;
    cursor: pointer;
    border: 1px solid #dcdcdc;
`
const Tools = styled.div`
    width: 90vw;
    height: 5vh;
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-top: 4.53vh
`
const IconButton = styled.button`
    // width: 20px;
    // height: 20px;
    font-size: 15px;
    background: none;
    outline: none;
    border: none;
    color: #888888;
`
const SearchText = styled.div`
    color: #888888;
    font-size: 3.5vw;
    margin-left: auto;
`

const List = styled.div`
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #efefef;
`
const ListHeader = styled.div`
    width: 100vw;
    height: 5.47vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #efefef;
`
const ListDate = styled.div`
    font-size: 3.7vw;
    font-weight: 500;
    margin-left: 6vw;
`
const ListShow = styled.button`
    background: none;
    border: none;
    outline: none;
    color: #aaaaaa;
    font-size: 13px;
    margin-right: 6vw;
`
const ListBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const ListItem = styled.div`
    display: flex;
    width: 90vw;
    height: 9.86vh;
    padding-top: 20px;
    padding-bottom: 20px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #efefef;
`
const ListItemLeft = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`
const ListItemRight = styled.div`
    color: #00b2a7;
    font-size: 3.8vw;
    font-weight: 600;
    white-space: nowrap;
`
const Time = styled.div`
    color: #aaaaaa;
    font-size: 2.67vw;
`
const Content = styled.div`
    margin-top: 10px;
    color: #212121;
    font-size: 3.8vw;
    font-weight: 600;
`
const CancelButton2 = styled.button`
    color: #202020;
    background-color: #e0e0e0;
    font-size: 3.73vw;
    font-weight: 600;
    width: 25vw;
    height: 12vw;
    border-radius: 2vw;
    border: none;
    text-align: center;
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
const ModalContent = styled.div`
    position: fixed;
    z-index: 1000;
    top: 20vh;
    right: 5vw;
    left: 5vw;
    padding: 0.7vh 3.7vw;
    font-size: 13px;
    border-radius: 5px;
    background-color: #ffffff;
`
const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5.08vh;
    background-color: #fff;
    color: #000;
    font-size: 3.7vw;
    font-weight: 600;
    font-weight: 600;
`
const Mline = styled.div`
    height: 1.4px;
    width: 100%;
    background-color: #808080;
`
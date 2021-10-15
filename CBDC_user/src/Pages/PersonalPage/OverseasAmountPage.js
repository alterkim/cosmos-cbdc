import { faChevronLeft, faHome, faBars, faExchangeAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from "../../_helpers"
import React, {useState} from "react"
import styled from "styled-components"
import { dbService } from "../../fbase"
import { useLocation } from "react-router"


const OverseasAmountPage = ({userInfo}) => {
    const location = useLocation()
    const [walletShow,setWalletShow] = useState(false)
    const [senderAccount, setSenderAccount] = useState(userInfo.account)
    const [senderWallet,setSenderWallet] = useState(userInfo.wallet)
    const [senderQuerySnapshot,setSenderQuerySnapshot] = useState([])
    const [sendAmount, setSendAmount] = useState(0)
    const [exchangeAmount, setExchangeAmount] = useState(0)
    const [exchangeRate, setExchangeRate] = useState(35.74)
    const [exchangeArrow, setExchangeArrow] = useState(false)

    const onClickSender= async(e) => {
        try{
            // sender 세팅
            const senderSnapshot = await dbService
                .collection(`UserInfo`)
                .where('account','==',e.target.value)
                .get()
            const senderData = senderSnapshot.docs[0].data()
            setSenderAccount(senderData.account)
            setSenderWallet(senderData.wallet)
            setSenderQuerySnapshot(senderSnapshot)
            setWalletShow(true)
        }catch(error){
            console.log(error)
        }
        
    }

    const onChangeCBDCAmount = async(e) =>{
        var val = Number(e.target.value.replace(/\D/g, ''))
        setSendAmount(val.toLocaleString())
        setExchangeAmount((exchangeRate * val).toLocaleString())
    }

    const onClickArrow = async(e) => {
        if(!exchangeArrow){
            setExchangeArrow(true)
            setExchangeRate(0.028)
            setSendAmount(0)
            setExchangeAmount(0)
        } else {
            setExchangeArrow(false)
            setExchangeRate(35.74)
            setSendAmount(0)
            setExchangeAmount(0)
        }
        console.log(location.state.txId)
    }

    const onClickUpdateInfo = async(e) => {
        const txId = location.state.txId
        try {
            const overseasSnapshot = await dbService
                .collection(`OverseasInfo`)
                .where('id', '==', txId)
                .get()
        
            await dbService.collection(`OverseasInfo`)
                .doc(overseasSnapshot.docs[0].id)
                .update({
                    amount: sendAmount,
                    sender_name: 'JEONGHEON KIM',
                    sender_address: '123-1231-1231'           
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor: 'pointer'}}
                    onClick={() => history.push('/personal/overseas')}/>
                <HeaderText style={{marginLeft: 40}}>CBDC 해외송금</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <div style={{marginTop: "4vh", display: 'flex', alignItems: 'center', borderBottom: '1px solid #000', width: '90vw', height: 40}}>
                    <div style={{color: '#000', fontSize: '3.5vw'}}>출금지갑주소</div>
                    <select className="select"
                        onClick={onClickSender}
                        style={{
                            width: 170, 
                            height: 40,
                            fontSize: '3.5vw', 
                            textAlign: "right", 
                            border: 'none', 
                            outline: 'none',
                            marginLeft: 'auto',
                            marginRight: 0,
                            backgroundColor: '#f6f6f6'
                        }}>
                        <option></option>
                        <option value={userInfo.account}>{userInfo.account}</option>
                        
                    </select>
                </div>
                {
                    walletShow &&(
                    <div style={{marginTop: '1.5vh', display: 'flex', alignItems: 'center', width: '90vw', height: 30}}>
                        <div style={{color: '#414141', 
                                    fontSize: '2.5vw', 
                                    color: '#8d8e8e',
                                    padding: 8,
                                    marginLeft: 'auto', 
                                    border: '1px solid #8d8e8e', 
                                    borderRadius: 10}}>{userInfo.wallet}</div>
                    </div>)
                }
                <div style={{marginTop: '4vh', display: 'flex', alignItems: 'center', width: '90vw', height: 40}}>
                    <div style={{color: 'gray', fontSize: '3.5vw'}}>잔액</div>
                    <div style={{color: 'gray', marginLeft: 'auto', fontSize: '3.5vw', }}>{walletShow ? userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString() : ""}  D-KRW</div>
                </div>
            </Body>
            <div style={{width:'100%', height:'10vh', backgroundColor:'white', fontSize:'3.5vw', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'600'}}>
                얼마를 송금 하시겠어요?
            </div>
            <Body>
                <div style={{width: '100%', height: '10vh', fontSize:'3.2vw', display:'flex', justifyContent:'space-around' , flexDirection:'row'}}>
                    <Amount>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <PriceInput defaultValue="0" value={sendAmount} onChange={onChangeCBDCAmount}/>
                            <div style={{fontSize: '2.9vw', marginLeft: 10}}>{exchangeArrow?"D-KRW":"D-THB"}</div>
                        </div>
                    </Amount>
                    <FontAwesomeIcon icon={faExchangeAlt} style={{color: '#00b2a7', fontSize:'4vw', alignItems:'center',display:'flex', justifyContent:'center', marginTop: 40, cursor:'pointer'}}
                        onClick={onClickArrow}/>
                    <Amount>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <PriceOutput defaultValue="0" value={exchangeAmount} readOnly={true}/>
                            <div style={{fontSize: '2.9vw', marginLeft: 10}}>{exchangeArrow?"D-THB":"D-KRW"}</div>
                        </div>
                    </Amount>
                </div>
                <div style={{fontSize:'3vw', textAlign:'end', color:'gray', marginLeft: '50vw', borderBottom: '0.5px solid gray', marginBottom: '5vh'}}>적용환율 1 {exchangeArrow?"D-KRW":"D-THB"} = {exchangeRate} {exchangeArrow?"D-THB":"D-KRW"}</div>
                <CardChild>
                    <div style={{marginTop: "4vh", display: 'flex', alignItems: 'center', width: '100%', height: 40, borderBottom: '0.5px solid gray'}}>
                        <div style={{color:'gray', fontSize:'3.5vw', marginLeft: '10%'}}>예상 송금금액</div>
                        <PriceOutput2 defaultValue="0" value={exchangeArrow?exchangeAmount:sendAmount} readOnly={true}/>
                        <div style={{fontSize:'3.5vw', textAlign: 'right', marginLeft: '2%'}}>D-THB</div>
                    </div>
                    <div style={{marginTop: "4vh", display: 'flex', alignItems: 'center', width: '100%', height: 40, borderBottom: '0.5px solid gray'}}>
                        <div style={{color:'gray', fontSize:'3.5vw', marginLeft: '10%'}}>예상 출금금액</div>
                        <PriceOutput2 defaultValue="0" value={exchangeArrow?sendAmount:exchangeAmount} readOnly={true}/>
                        <div style={{fontSize:'3.5vw', textAlign: 'right', marginLeft: '2%'}}>D-KRW</div>
                    </div>
                </CardChild>
            </Body>
            <div style={{width:'100%', height:'10vh', backgroundColor:'white', fontSize:'3.5vw', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'600'}}>
                입력 정보를 확인해주세요.
            </div>
            <ExRunButton onClick={() => {
                onClickUpdateInfo()
                history.push({
                    pathname: '/personal/overseastransfer',
                    state: {txId: location.state.txId}
                    })}}>다음</ExRunButton>
        </div>
    )
}

export {OverseasAmountPage}

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
    background-color: #f6f6f6; 
`
const HeaderText = styled.div`
    color: #000;
`
const Amount = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 40%;
    margin: 2vw 0;
`
const PriceInput = styled.input`
    border: 1px solid #cfcccc;
    border-radius: 5px;
    text-align: right;
    height: 4.5vh;
    font-size: 3.5vw;
    padding-right: 20px;
    width: 60%;
`
const PriceOutput = styled.input`
    border: 1px solid #cfcccc;
    border-radius: 5px;
    text-align: right;
    width: 60%;
    height: 4.5vh;
    font-size: 3.5vw;
    padding-right: 20px;
`
const PriceOutput2 = styled.input`
    text-align: right;
    width: 30%;
    height: 3vh;
    font-size: 3.5vw;
    border: 0;
    outline: 0;
    background-color: #f6f6f6;
    margin-left: 10%;
`
const CardChild = styled.div`
    width: 90vw;
    height: 20vh;
    padding-bottom: 2vh;
    border-top: 1px solid #dcdcdc;
    box-shadow: 1px 2px 6px 1px #bfcfea;
    border-radius: 4vw;
    margin-top: 4vw;
    margin-bottom: 4vw;
    font-weight: 600;
    display: flex;
    flex-direction: column;
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
    cursor: pointer;
    font-weight: 600;
`
import { faChevronLeft, faHome, faBars, faTimes, faArrowsAltV } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { feeDelegatedValueTransfer } from "caver-js/packages/caver-transaction"
import React, {useState} from "react"
import Select, {defaultTheme} from "react-select"
import styled from "styled-components"
import { history } from "../../_helpers"

const Caver = require('caver-js')
const caver = new Caver('http://localhost:8551/')

const testFunction = async() => {
    const sender = caver.wallet.keyring.decrypt({
        "version": 4,
        "id": "46228a95-9551-4f89-a67a-7ba6cf480814",
        "address": "0x2c48eabfc1a79c430b175353e3ad53dd4d90d20d",
        "keyring": [
                {
                        "ciphertext": "f118245b28bfaf5b4377d4f946e9ad00c5deda1d044242f1e9f640626368d010",
                        "cipherparams": {
                                "iv": "66fcbbfb7260ff612911567b6030d7ef"
                        },
                        "cipher": "aes-128-ctr",
                        "kdf": "scrypt",
                        "kdfparams": {
                                "dklen": 32,
                                "salt": "d04334566e5b7a553c6e2567adbd3c3ec7f9055e9fb7117dfbe5b1606a6cc482",
                                "n": 4096,
                                "r": 8,
                                "p": 1
                        },
                        "mac": "67292f821b0a84e8a85bbfe093af5c0fb9b83ca4b8c5a3606ae71c42cb081037"
                }
        ]
    },"justdoit17!")
    caver.wallet.add(sender)
    // caver.wallet.updateKeyring(sender)
    //caver.wallet.remove(sender.address)
    console.log(caver.wallet.getKeyring(sender.address))

    const receiver = caver.wallet.keyring.decrypt({
        "version": 4,
        "id": "a0c239fa-aa62-44cf-92ad-cc5167b1f1fd",
        "address": "0xc4bbb580c21c24ec488e96f3b7131ac83e3edea2",
        "keyring": [
                {
                        "ciphertext": "5b05fcfb12eab0e25724641be3b897e3d4d624157671a3649a589d4256de6d2a",
                        "cipherparams": {
                                "iv": "c471b86ffcdb2bbf97cd2fb7d50d32b7"
                        },
                        "cipher": "aes-128-ctr",
                        "kdf": "scrypt",
                        "kdfparams": {
                                "dklen": 32,
                                "salt": "863661a71b1d03b510755d3ed54549535e9d37e5c68ee89cfdff364637d8fc06",
                                "n": 4096,
                                "r": 8,
                                "p": 1
                        },
                        "mac": "569820be7ec0548dbec0fffc81d1b7864bd697456efdb8c78265d4f4c6b0fc7e"
                }
        ]
    }, "justdoit17!")
    caver.wallet.add(receiver)
    // caver.wallet.updateKeyring(receiver)
    //caver.wallet.remove(receiver.address)
    console.log(caver.wallet.getKeyring(receiver.address))

    const vt = caver.transaction.valueTransfer.create({
        from: sender.address,
        to: receiver.address,
        value: caver.utils.toPeb(1, 'KLAY'),
        gas: 25000,
    })

    const signed = await caver.wallet.sign(sender.address, vt)

    const receipt = await caver.rpc.klay.sendRawTransaction(signed)
    console.log(receipt)
}

const send_method = [
    {value: 'account', label: '계좌로 입금'}
]


const OverseasTransferpage = ({userInfo}) => {
    const [CBDCAmount, setCBDCAmount] = useState(0)
    const [ExchangeAmount, setExchangeAmount] = useState(0)
    const [countrymodal, setCountryModal] = useState(false)
    const [selectcountry, setCountry] = useState({value:"not", label:"선택하여 주세요"})

    const onChangeCBDCAmount = async(e) =>{
        var val = Number(e.target.value.replace(/\D/g, ''))
        const exchangeRate = 35.34
        setCBDCAmount(val.toLocaleString())
        setExchangeAmount((exchangeRate * val).toLocaleString())
    }

    const onMenuOpen = () => {
        setCountryModal(true)
    }

    const selectSytles = {
        container: (provided, state) => ({
            ...provided,
            width: "90%",
            height: "110%"
        }),
        control: (provided, state) => ({
            ...provided,
            margin: "8px 8px",
            padding: "8px 18px"
          }),
    }

    const countryStyle1 = {
        height:'20px',
        width:'20px',
        marginRight: '10px',
        borderRadius:'70%',
        overflow:'hidden',
        objectFit: 'cover'
    }

    const countryStyle2 = {
        height:'25px',
        width:'25px',
        marginRight: '10px',
        borderRadius:'70%',
        overflow:'hidden',
        objectFit: 'cover'
    }

    const transferClick = async(e) => {
    }

    return (
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor: 'pointer'}}
                    onClick={() => history.push('/personal')}/>
                <HeaderText style={{marginLeft: 40}}>해외송금</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Body>
                <div style={{color: '#212121', fontSize: '3.5vw', width: '90vw', marginTop: '3vw', marginBottom: '2vw', fontWeight: '600'}}>송금 보낼 국가</div>
                <Select
                    placeholder="선택하여 주세요"
                    onMenuOpen={onMenuOpen}
                    value={selectcountry}
                    styles={selectSytles}
                    >
                </Select>

                <div style={{color: '#212121', fontSize: '3.5vw', width: '90vw', marginTop: '5vw', fontWeight: '600'}}>보내는 방법</div>
                <Select
                    styles={selectSytles}
                    placeholder="선택하여 주세요" 
                    options={send_method}>
                </Select>

                <div style={{color: '#212121', fontSize: '3.5vw', width: '90vw', marginTop: '5vw', fontWeight: '600'}}>보내는 금액</div>
                <Amount>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <PriceInput defaultValue="0" value={CBDCAmount} onChange={onChangeCBDCAmount}/>
                        <div style={{fontSize: '3.8vw', marginLeft: 10}}>D-THB</div>
                    </div>
                </Amount>
                <div>
                    <FontAwesomeIcon icon={faArrowsAltV} style={{color: "#000", fontSize: '5vw', marginRight: '16vw'}}/>
                </div>
                <Amount>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <PriceOutput defaultValue="0" value={ExchangeAmount} readOnly={true}/>
                        <div style={{fontSize: '3.8vw', marginLeft: 10}}>D-KRW</div>
                    </div>
                </Amount>
            </Body>
            <ExRunButton onClick={transferClick}>이체하기</ExRunButton>
            {countrymodal && <Modal>
                <ModalBackground onClick={() => setCountryModal(false)}></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div style={{marginLeft: 150, fontSize: '4.7vw'}}>송금 보낼 국가</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '5vw', marginRight:20, cursor:'pointer', marginRight: '8vw'}} onClick={() => setCountryModal(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <div style={{display:'flex', justifyContent: 'space-between', position: 'relative'}}>
                        <CButton onClick={()=> {
                            setCountry({value: "usa", label:
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{color: '#000', fontSize:'3.5vw'}}>
                                        <img src={"/images/usa.png"} 
                                        style={countryStyle2}></img>미국</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/usa.png"}
                                alt="usa"
                                style={countryStyle1}></img>
                        미국</CButton>
                        <CButton onClick={()=> {
                            setCountry({value: "can", label: 
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/canada.png"} 
                                style={countryStyle2}></img>캐나다</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/canada.png"}
                                alt="canada"
                                style={countryStyle1}></img>
                        캐나다</CButton>
                    </div>
                    <div style={{display:'flex', justifyContent: 'space-between', position: 'relative'}}>
                        <CButton onClick={()=> {
                            setCountry({value: "uk", label: <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/uk.png"} 
                                style={countryStyle2}></img>영국</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/uk.png"}
                                alt="uk"
                                style={countryStyle1}></img>
                        영국</CButton>
                        <CButton onClick={()=> {
                            setCountry({value: "aus", label:
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/uaustrailia.png"} 
                                style={countryStyle2}></img>호주</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/austrailia.png"}
                                alt="austrailia"
                                style={countryStyle1}></img>
                        호주</CButton>
                    </div>
                    <div style={{display:'flex', justifyContent: 'space-between', position: 'relative'}}>
                        <CButton onClick={()=> {
                            setCountry({value: "jap", label: 
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/japan.png"} 
                                style={countryStyle2}></img>일본</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/japan.png"}
                                alt="japan"
                                style={countryStyle1}></img>
                        일본</CButton>
                        <CButton onClick={()=> {
                            setCountry({value: "fra", label:
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/france.png"} 
                                style={countryStyle2}></img>프랑스</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/france.png"}
                                alt="france"
                                style={countryStyle1}></img>
                        프랑스</CButton>
                    </div>
                    <div style={{display:'flex', justifyContent: 'space-between', position: 'relative'}}>
                        <CButton onClick={()=> {
                            setCountry({value: "ger", label: 
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/germany.png"} 
                                style={countryStyle2}></img>독일</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/germany.png"}
                                alt="germany"
                                style={countryStyle1}></img>
                        독일</CButton>
                        <CButton onClick={()=> {
                            setCountry({value: "new", label: 
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/newzealand.png"} 
                                style={countryStyle2}></img>뉴질랜드</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/newzealand.png"}
                                alt="newzealand"
                                style={countryStyle1}></img>
                        뉴질랜드</CButton>
                    </div>
                    <div style={{display:'flex', justifyContent: 'space-between', position: 'relative'}}>
                        <CButton onClick={()=> {
                            setCountry({value: "thb", label: 
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/taiwan.png"} 
                                style={countryStyle2}></img>태국</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/taiwan.png"}
                                alt="taiwan"
                                style={countryStyle1}></img>
                        태국</CButton>
                        <CButton onClick={()=> {
                            setCountry({value: "sin", label: 
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/singapore.png"} 
                                style={countryStyle2}></img>싱가포르</div></div>})
                            setCountryModal(false)
                            } }>
                            <img
                                src={"/images/singapore.png"}
                                alt="singapore"
                                style={countryStyle1}></img>
                        싱가포르</CButton>
                    </div>
                </ModalContent>
            </Modal>}
        </div>
    )
}

export { OverseasTransferpage}

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
    width: 71vw;
    height: 7.5vh;
    font-size: 4vw;
    padding-right: 20px;
`
const PriceOutput = styled.input`
    border: 1px solid #cfcccc;
    border-radius: 5px;
    text-align: right;
    width: 71vw;
    height: 7.5vh;
    font-size: 4vw;
    padding-right: 20px;
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
    top: 20%;
    height: 80%;
    width: 100%;
    border-radius: 35px;
    position: fixed;
    z-index: 1000;
    font-size: 13px;
    background-color: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
`
const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 6.08vh;
    background-color: #fff;
    color: #000;
    font-size: 3.3vw;
    font-weight: 400;
`
const Mline = styled.div`
    height: 1.4px;
    width: 110%;
    background-color: #808080;
`
const CButton = styled.div`
    width: 100%;
    color: #000000;
    height: 2vh;
    background-color: #ffffff;
    font-size: 3.5vw;
    outline: none;
    padding: 3.5vw 2.5vh;
    cursor: pointer; 
    font-weight:500;
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
`
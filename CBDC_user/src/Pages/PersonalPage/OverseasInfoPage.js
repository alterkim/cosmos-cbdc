import { faChevronLeft, faHome, faBars, faTimes, faArrowsAltV } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { feeDelegatedValueTransfer } from "caver-js/packages/caver-transaction"
import React, {useEffect, useState} from "react"
import Select, {defaultTheme} from "react-select"
import styled from "styled-components"
import { dbService } from "../../fbase"
import { history } from "../../_helpers"
import GetDatetime from "../../_helpers/GetDatetime"

const OverseasInfoPage = ({userInfo}) => {
    const [CBDCAmount, setCBDCAmount] = useState(0)
    const [ExchangeAmount, setExchangeAmount] = useState(0)
    const [countrymodal, setCountryModal] = useState(false)
    const [bankModal, setBankModal] = useState(false)
    const [selectcountry, setCountry] = useState({value:'not', label:'선택하여 주세요'})
    const [selectbank, setBank] = useState({value:'not', label: '선택하여 주세요'})
    const [selectaddress, setAddress] = useState("")
    const [selectfname, setFname] = useState("")
    const [selectlname, setLname] = useState("")
    const [selectnumber, setNumber] = useState("")
    const [id, setId] = useState("")

    const onCountryOpen = () => {
        setCountryModal(true)
    }

    const onBankOpen = () => {
        setBankModal(true)
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

    useEffect(()=> {
        var randomNum = (Math.floor(Math.random()*(10000-1)) + 1)+'';
            while(randomNum.length < 5){
                randomNum = '0'+randomNum
            }
        setId("OS2021-" + randomNum)
    },[])

    const onClickAddInfo = async(e) => {

        await dbService
            .collection(`OverseasInfo`)
            .add({
                id: id,
                receiver_address: selectaddress,
                receiver_bank: selectbank.value,
                receiver_country: selectcountry.value,
                receiver_fname: selectfname,
                receiver_lname: selectlname,
                receiver_number: selectnumber,
                transaction_date: GetDatetime()
            })
    }

    const onChangeAddress = (e) => {
        setAddress(e.target.value)
    }
    const onChangeFname = (e) => {
        setFname(e.target.value)
    }
    const onChangeLname = (e) => {
        setLname(e.target.value)
    }
    const onChangeNumber = (e) => {
        setNumber(e.target.value)
    }

    return (
        <div>
            <Header>
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor: 'pointer'}}
                    onClick={() => history.push('/personal/CBDC')}/>
                <HeaderText style={{marginLeft: 40}}>CBDC 해외송금</HeaderText>
                <div>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw'}}/>
                </div>
            </Header>
            <Mline/>
            <div style={{width:'100%', height:'10vh', backgroundColor:'white', fontSize:'3.5vw', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'600'}}>
                받는 분의 송금 정보를<br/> 정확히 입력해주세요.
            </div>
            <Body>
                <div style={{color: '#212121', fontSize: '3.5vw', width: '90vw', marginTop: '3.5vw', marginBottom: '2vw', fontWeight: '600'}}>송금 보낼 국가</div>
                <Select
                    placeholder="선택하여 주세요"
                    onMenuOpen={onCountryOpen}
                    value={selectcountry}
                    styles={selectSytles}
                    >
                </Select>

                <div style={{color: '#212121', fontSize: '3.5vw', width: '90vw', marginTop: '5.5vw', marginBottom: '2vw', fontWeight: '600'}}>입금은행</div>
                <Select
                    placeholder="선택하여 주세요"
                    onMenuOpen={onBankOpen}
                    value={selectbank}
                    styles={selectSytles}>
                </Select>

                <div style={{marginTop:'5vw', fontSize: '3.3vw', width:'85vw', fontWeight: '400', color:'#696969'}}>입금지갑주소 (Address)</div>
                <Info>
                    <div style={{marginLeft:'3.5vw'}}>
                        <InfoInput placeholder="주소를 입력하세요" value={selectaddress} onChange={onChangeAddress} />
                    </div>
                </Info>

                <div style={{marginTop:'4.3vw', fontSize: '3.3vw', width:'85vw', fontWeight: '400', color:'#696969'}}>이름 (First name)</div>
                <Info>
                    <div style={{marginLeft:'3.5vw'}}>
                        <InfoInput placeholder="이름을 입력하세요" value={selectfname} onChange={onChangeFname}/>
                    </div>
                </Info>

                <div style={{marginTop:'4.3vw', fontSize: '3.3vw', width:'85vw', fontWeight: '400', color:'#696969'}}>성 (Last name)</div>
                <Info>
                    <div style={{marginLeft:'3.5vw'}}>
                        <InfoInput placeholder="성을 입력하세요" value={selectlname} onChange={onChangeLname}/>
                    </div>
                </Info>

                <div style={{marginTop:'4.3vw', fontSize: '3.3vw', width:'85vw', fontWeight: '400', color:'#696969'}}>연락처 (Phone Nubmer)</div>
                <Info>
                    <div style={{marginLeft:'3.5vw'}}>
                        <InfoInput placeholder="연락처를 입력하세요" value={selectnumber} onChange={onChangeNumber}/>
                    </div>
                </Info>
            </Body>
            <ExRunButton onClick={()=>{
                onClickAddInfo()
                history.push({
                    pathname: '/personal/overseasamount',
                    state: {txId: id}})
            }}>다음</ExRunButton>
            {countrymodal && <Modal>
                <ModalBackground onClick={() => setCountryModal(false)}></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div style={{marginLeft: 170, fontSize: '4vw'}}>송금 보낼 국가</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '5vw', marginRight:20, cursor:'pointer', marginRight: '8vw'}} onClick={() => setCountryModal(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <div style={{display:'flex', justifyContent: 'space-between', position: 'relative'}}>
                        <CButton onClick={()=> {
                            setCountry({value: "미국", label:
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
                            setCountry({value: "캐나다", label: 
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
                            setCountry({value: "영국", label: <div style={{display: 'flex', flexDirection: 'column'}}>
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
                            setCountry({value: "호주", label:
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{color: '#000', fontSize:'3.5vw'}}>
                                <img src={"/images/austrailia.png"} 
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
                            setCountry({value: "일본", label: 
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
                            setCountry({value: "프랑스", label:
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
                            setCountry({value: "독일", label: 
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
                            setCountry({value: "뉴질랜드", label: 
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
                            setCountry({value: "태국", label: 
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
                            setCountry({value: "싱가포르", label: 
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
            {bankModal && <Modal>
                <ModalBackground onClick={() => setBankModal(false)} ></ModalBackground>
                <ModalContent2>
                    <ModalHeader>
                        <div style={{marginLeft: 140, fontSize:'4vw'}}>입금은행 선택</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setBankModal(false)}/>
                    </ModalHeader>
                    <Mline style={{width:'100%'}}/>
                    <BButton onClick={() => {
                        setBank({value:'방콕은행', label: '방콕은행(Bangkok Bank Public Company)'})
                        setBankModal(false)
                        }}>방콕은행(Bangkok Bank Public Company)</BButton>
                    <Mline style={{width:'100%'}}/>
                    <BButton>직접입력</BButton>
                    <Mline style={{width:'100%'}}/>
                </ModalContent2>
            </Modal>}
        </div>
    )
}

export {OverseasInfoPage}

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
const Info = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90vw;
    margin: 2vw 0;
`
const InfoInput = styled.input`
    border: 1px solid #cfcccc;
    border-radius: 5px;
    text-align: right;
    width: 80vw;
    height: 4.5vh;
    font-size: 3.5vw;
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
const ModalContent2 = styled.div`
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
    height: 6.08vh;
    background-color: #fff;
    color: #000;
    font-size: 3.3vw;
    font-weight: 400;
`
const Mline = styled.div`
    height: 1.4px;
    width: 110%;
    background-color: #e2e2e2;
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
    font-weight: 600;
`
const BButton = styled.div`
    width: 100%;
    color: #000000;
    height: 4.5vh;
    background-color: #ffffff;
    font-size: 3.5vw;
    cursor: pointer;
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
`
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';
import { dbService } from "../../fbase";


const CBDCPage = ({userInfo}) => {
    const [modalshow, setModalshow] = useState(false)
    const [modalcommon, setModalcommon] = useState(false)
    const [modalextinct, setModalextinct] = useState(false)
    const [modalreduce, setModalreduce] = useState(false)
    const totalCBDC = userInfo.common_cbdc_balance + userInfo.reduce_cbdc_balance + userInfo.extinct_cbdc_balance
    const [extinctValidity,setExtinctValidity] = useState("")
    const [reduceValidity,setReduceValidity] = useState("")
    const [language, setLanguage] = useState(true)
    const getIssueData = async(e) =>{
        try{
            dbService
            .collection(`IssueInfo`)
            .get().then((snpashot)=>{
                snpashot.forEach((doc)=>{
                    if(doc.data().account_setting === "감소형"){
                        setReduceValidity(doc.data().validity)
                    }else if(doc.data().account_setting ==="소멸형"){
                        setExtinctValidity(doc.data().validity)
                    }
                })
            })
            return 0
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        getIssueData()
    },[])

    const onClickTranslate = async(e) => {
        if(language == true) {
            setLanguage(false)
        } else {
            setLanguage(true)
        }
    }

    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor:'pointer'}}
                    onClick={() => history.push('/personal')}
                />
                <HeaderText style={{marginLeft: 40}}>{language? "전계좌조회" : "Accounts"}</HeaderText>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <ToggleButton style={{marginRight: 15}} onClick={onClickTranslate}>{language ? "KR": "EN"}</ToggleButton>
                    <FontAwesomeIcon icon={faHome} style={{color: "#000", fontSize: '4vw', marginRight: 15, marginTop: 3}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#000", fontSize: '4vw', marginRight: '5vw', marginTop: 3}}/>
                </div>
            </Header>
            <Body>
                <CardHeader>
                    <CardName>CBDC</CardName>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <CardName>{totalCBDC&& totalCBDC.toLocaleString()}</CardName>
                        <CardMoney>D-KRW</CardMoney>    
                    </div>
                </CardHeader>
                <CardBody>
                    <CardChild>
                        <CardChildName>{language? "일반자금": "General Money"}</CardChildName>
                        <span style={{marginLeft:20}}>123-1231-1231</span>
                        <span style={{marginLeft:20}}>(cosmos1x92f6)</span>
                        
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 30, fontWeight: 600, fontSize: '6vw'}}>
                            {userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString()} <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display: 'flex', marginTop:10, justifyContent: 'space-evenly', position: "relative"}}>
                            <Button1 onClick={() => setModalcommon(true)}
                            >{language? "거래선택" : "Select"}
                            </Button1>
                            <Button1  onClick={() => history.push('/personal/deal/cbdc/common')}
                            >{language? "거래내역" : "History"}
                            </Button1>
                        </div>
                    </CardChild>
                    {(userInfo.extinct_cbdc_balance>0)&&
                    <CardChild>
                        <CardChildName>{language? "재난지원금(소멸형)" : "Disaster Assistance (Extinct)"}</CardChildName>
                        <div style={{marginLeft: 20, marginTop:5, fontSize: '2.7vw', color: '#00b2a7'}}>{language? "유효기간" : "Validity"} {extinctValidity}</div>
                        <span style={{marginLeft:20}}>456-4564-4564</span>
                        <span style={{marginLeft:20}}>(cosmos2y933z)</span>
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 10, fontWeight: 600, fontSize: '6vw'}}>
                            {userInfo.extinct_cbdc_balance&&userInfo.extinct_cbdc_balance.toLocaleString()}  <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display:'flex', justifyContent: 'space-evenly', position: 'relative', marginTop:10}}>
                            <Button1
                                onClick={() => setModalextinct(true)}
                            >{language? "거래선택" : "Select"}
                            </Button1>
                            <Button1
                                onClick={() => history.push('/personal/deal/cbdc/disaster/Extinct')}
                            >{language? "거래내역" : "History"}
                            </Button1>
                        </div>
                    </CardChild>}
                    
                    {(userInfo.reduce_cbdc_balance>0)&&
                    <CardChild>
                        <CardChildName>{language? "재난지원금(감소형)" : "Disaster Assistance (Reduced)"}</CardChildName>
                        <div style={{marginLeft: 20, marginTop:5, fontSize: '2.7vw', color: '#00b2a7'}}>{language? "유효기간" : "Validity"} {reduceValidity}</div>
                        <span style={{marginLeft:20}}>789-7897-7897</span>
                        <span style={{marginLeft:20}}>(cosmos543z3t)</span>
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 10, fontWeight: 600, fontSize: '6vw'}}>
                            {userInfo.reduce_cbdc_balance&&userInfo.reduce_cbdc_balance.toLocaleString()}  <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-around', position: 'relative', marginTop: 10}}>
                            <Button2 
                                style={{
                                    fontSize: '2.7vw'
                                }}
                                onClick={() => setModalshow(true)}
                            >
                                {language ? "기간별": "Check"}
                                <br/> {language ? "잔액 확인" : "by period"}
                            </Button2>
                            <Button2 
                                onClick={() => setModalreduce(true)}
                            >
                                {language? "거래선택" : "Select"}
                            </Button2>
                            <Button2 
                                onClick={() => history.push('/personal/deal/cbdc/disaster/Reduction')}
                            >
                                {language? "거래내역" : "History"}
                            </Button2>
                        </div>
                    </CardChild>}
                </CardBody>
                
            
            </Body>
            {modalshow && <Modal>
                <ModalBackground onClick={() => setModalshow(false)}></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div>기간별 잔액 확인하기</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', cursor: 'pointer'}} onClick={()=>setModalshow(false)}/>
                    </ModalHeader>
                    <div style={{color: '#000', fontSize: '2.93vw'}}>
                        재난지원금(감소형)의 사용가능잔액은
                    </div>
                    <div style={{marginBottom: 20, color: '#f53737', fontSize: '2.93vw'}}>
                        매달 최초배정금액의 20%인 100,000 D-KRW이 감소됩니다.
                    </div>
                    <div style={{marginBottom: 40, color: '#000', fontSize: '2.93vw'}}>
                        아래 기간별 사용가능 잔액을 확인하세요.
                    </div>
                    <div 
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            position: 'relative',
                            padding: '0 20px'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 10,
                            right: '3.7vw'
                        }}>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    fontSize: '3vw'
                                }}
                            >
                                2021년
                            </Button1> <br />
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    marginTop: 5,
                                    fontSize: '3vw'
                                }}
                            >
                                D-KRW
                            </Button1>
                        </div>
                        <ChartBar>
                            <Value>500,000</Value>
                            <div 
                                style={{
                                    height: 60 * 5,
                                    width: 20,
                                    background: '#37a5a5',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                            </div>
                        </ChartBar>
                        <ChartBar>
                            <Value>400,000</Value>
                            <div 
                                style={{
                                    height: 60 * 4,
                                    width: 20,
                                    background: '#37a5a5',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                            </div>
                        </ChartBar>
                        <ChartBar>
                            <Value>300,000</Value>
                            <div 
                                style={{
                                    height: 60 * 3,
                                    width: 20,
                                    background: '#37a5a5',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                            </div>
                        </ChartBar>
                        <ChartBar>
                            <Value>200,000</Value>
                            <div 
                                style={{
                                    height: 60 * 2,
                                    width: 20,
                                    background: '#37a5a5',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                            </div>
                        </ChartBar>
                        <ChartBar>
                            <Value>100,000</Value>
                            <div 
                                style={{
                                    height: 60 * 1,
                                    width: 20,
                                    background: '#37a5a5',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                            </div>
                        </ChartBar>
                        <ChartBar>
                            <Value>0</Value>
                            <div 
                                style={{
                                    height: 0,
                                    width: 20,
                                    background: '#ffffff',
                                    borderRadius: '4px 4px 0 0'
                                }}
                            >
                            </div>
                        </ChartBar>
                    </div>
                    <Xline />
                    <div 
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 20px'
                        }}
                    >
                        <Xlabel>1/31</Xlabel>
                        <Xlabel>2/28</Xlabel>
                        <Xlabel>3/31</Xlabel>
                        <Xlabel>4/30</Xlabel>
                        <Xlabel>5/31</Xlabel>
                        <Xlabel>6/30</Xlabel>
                    </div>                    
                </ModalContent>
            </Modal>}
            {modalcommon && <Modal>
                <ModalBackground onClick={() => setModalcommon(false)}></ModalBackground>
                <ModalContent2>
                <ModalHeader>
                        <div style={{marginLeft: 180, fontSize: '4.5vw'}}>거래 선택</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setModalcommon(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <MButton onClick={() => history.push('/personal/Exchange')}>교환</MButton>
                    <Mline/>
                    <MButton onClick={() => history.push('/personal/transfer')}>이체</MButton>
                    <Mline/>
                    <MButton
                        onClick={() => history.push({
                            pathname :'/personal/payment'
                            ,state : {cbdcType : "common"}
                            })}>결제</MButton>
                    <Mline/>
                    <MButton
                        onClick={() => history.push({
                            pathname: '/personal/cancel'
                        })}>결제취소요청</MButton>
                    <Mline/>
                    <MButton onClick={() => history.push('/personal/overseas')}>해외송금</MButton>
                    <Mline/>
                </ModalContent2>
            </Modal>}
            {modalextinct && <Modal2>
                <ModalBackground onClick={() => setModalextinct(false)}></ModalBackground>
                <ModalContent2>
                    <ModalHeader>
                        <div style={{marginLeft: 180, fontSize: '4.5vw'}}>거래 선택</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setModalextinct(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <MButton
                        onClick={() => history.push({
                            pathname :'/personal/payment'
                            ,state : {cbdcType : "extinct"}
                            })}>결제</MButton>
                    <Mline/>
                    <MButton>결제취소요청</MButton>
                    <Mline/>
                </ModalContent2>
            </Modal2>}
            {modalreduce && <Modal2>
                <ModalBackground onClick={() => setModalreduce(false)}></ModalBackground>
                <ModalContent2>
                    <ModalHeader>
                        <div style={{marginLeft: 180, fontSize: '4.5vw'}}>거래 선택</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw', marginRight:20, cursor: 'pointer'}} onClick={() => setModalreduce(false)}/>
                    </ModalHeader>
                    <Mline/>
                    <MButton
                        onClick={() => history.push({
                            pathname :'/personal/payment'
                            ,state : {cbdcType : "reduce"}
                            })}>결제</MButton>
                    <Mline/>
                    <MButton>결제취소요청</MButton>
                    <Mline/>
                </ModalContent2>
                </Modal2>}
        </div>
    )
}

export { CBDCPage }

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
    height: 11vh;
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
    min-height: 150px;
    margin-bottom: 4vw;
`
const CardChild = styled.div`
    width: 90vw;
    height: 19vh;
    padding-top: 1vh;
    padding-bottom: 2.5vh;
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
    padding: 0px 35px;
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
const Modal2 = styled.div`
    width: 100%;
    height: 50%;
    position: fixed;
    z-index: 1000;
`
const ModalContent2 = styled.div`
    top: 58%;
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
    height: 6.08vh;
    background-color: #fff;
    color: #000;
    font-size: 3.7vw;
    font-weight: 600;
    font-weight: 600;
`
const ChartBar = styled.div`
    display: flex;
    flex-direction: column;
`
const Value = styled.div`
    margin-top: auto;
    width: 40px;
    font-size: 2.93vw;
    text-align: center;
`
const Xline = styled.div`
    height: 1px;
    width: 100%;
    background-color: #888888;
`
const Xlabel = styled.div`
    width: 40px;
    text-align: center;
    margin-top: 3px;
    font-size: 2.93vw;
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
const Mline = styled.div`
    height: 1.4px;
    width: 110%;
    background-color: #808080;
`
const ToggleButton = styled.div`
    color: #00b2a7;
    background-color: #ffffff;
    font-size: 4vw;
    cursor: pointer;
`
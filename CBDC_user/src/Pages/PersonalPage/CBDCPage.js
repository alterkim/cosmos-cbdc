import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { faChevronLeft, faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { history } from '../../_helpers';
import { dbService } from "../../fbase";


const CBDCPage = ({userInfo}) => {
    const [modalshow, setModalshow] = useState(false)
    const totalCBDC = userInfo.common_cbdc_balance + userInfo.reduce_cbdc_balance + userInfo.extinct_cbdc_balance
    const [extinctValidity,setExtinctValidity] = useState("")
    const [reduceValidity,setReduceValidity] = useState("")
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

    return (
        <div>
            <Header>
                <FontAwesomeIcon 
                    icon={faChevronLeft} 
                    style={{color: "#000", fontSize: '4vw', marginLeft: '5vw', cursor:'pointer'}}
                    onClick={() => history.push('/personal')}
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
                        <CardName>{totalCBDC&& totalCBDC.toLocaleString()}</CardName>
                        <CardMoney>D-KRW</CardMoney>    
                    </div>
                </CardHeader>
                <CardBody>
                    <CardChild>
                        <CardChildName>일반자금</CardChildName>
                        <span style={{marginLeft:20}}>123-1231-1231</span>
                        <span style={{marginLeft:20}}>(cosmos1x92f6)</span>
                        
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 30, fontWeight: 600, fontSize: '6vw'}}>
                            {userInfo.common_cbdc_balance&&userInfo.common_cbdc_balance.toLocaleString()} <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                            <Button1 
                                style={{marginLeft: 'auto'}}
                                onClick={() => history.push('/personal/Exchange')}
                            >교환</Button1>
                            <Button1 
                                style={{marginLeft: 5}}
                                onClick={() => history.push('/personal/transfer')}
                            >
                                이체
                            </Button1>
                            <Button1 
                                style={{marginLeft: 5}}
                                onClick={() => history.push({
                                    pathname :'/personal/payment'
                                    ,state : {cbdcType : "common"}
                                    })}
                            >
                                결제
                            </Button1>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    marginRight: 20
                                }}
                                onClick={() => history.push('/personal/deal/cbdc/common')}
                            >
                                거래내역
                            </Button1>
                        </div>
                    </CardChild>
                    {(userInfo.extinct_cbdc_balance>0)&&
                    <CardChild>
                        <CardChildName>재난지원금(소멸형)</CardChildName>
                        <div style={{marginLeft: 20, marginTop:5, fontSize: '3vw', color: '#00b2a7'}}>유효기간 {extinctValidity}</div>
                        <span style={{marginLeft:20}}>456-4564-4564</span>
                        <span style={{marginLeft:20}}>(cosmos2y933z)</span>
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 30, fontWeight: 600, fontSize: '6vw'}}>
                            {userInfo.extinct_cbdc_balance&&userInfo.extinct_cbdc_balance.toLocaleString()}  <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                            <Button1 
                                style={{marginLeft: 'auto'}}
                                onClick={() => history.push({
                                    pathname :'/personal/payment'
                                    ,state : {cbdcType : "extinct"}
                                    })}
                            >
                                결제
                            </Button1>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    marginRight: 20
                                }}
                                onClick={() => history.push('/personal/deal/cbdc/disaster/Extinct')}
                            >
                                거래내역
                            </Button1>
                        </div>
                    </CardChild>}
                    
                    {(userInfo.reduce_cbdc_balance>0)&&
                    <CardChild>
                        <CardChildName>재난지원금(감소형)</CardChildName>
                        <div style={{marginLeft: 20, marginTop:5, fontSize: '3vw', color: '#00b2a7'}}>유효기간 {reduceValidity}</div>
                        <span style={{marginLeft:20}}>789-7897-7897</span>
                        <span style={{marginLeft:20}}>(cosmos543z3t)</span>
                        <div style={{display: 'flex' }}>
                            <div style={{marginLeft: 'auto', marginRight: 30, marginTop: 30, fontWeight: 600, fontSize: '6vw'}}>
                            {userInfo.reduce_cbdc_balance&&userInfo.reduce_cbdc_balance.toLocaleString()}  <span style={{fontSize: '4vw'}}>D-KRW</span>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10}}>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    fontSize: '3vw'
                                }}
                                onClick={() => setModalshow(true)}
                            >
                                기간별 잔액 확인하기
                            </Button1>
                            
                            <Button1 
                                style={{marginLeft: 5}}
                                onClick={() => history.push({
                                    pathname :'/personal/payment'
                                    ,state : {cbdcType : "reduce"}
                                    })}
                            >
                                결제
                            </Button1>
                            <Button1 
                                style={{
                                    marginLeft: 5, 
                                    marginRight: 20
                                }}
                                onClick={() => history.push('/personal/deal/cbdc/disaster/Reduction')}
                            >
                                거래내역
                            </Button1>
                        </div>
                    </CardChild>}
                </CardBody>
                
            
            </Body>
            {modalshow && <Modal>
                <ModalBackground onClick={() => setModalshow(false)}></ModalBackground>
                <ModalContent>
                    <ModalHeader>
                        <div>기간별 잔액 확인하기</div>
                        <FontAwesomeIcon icon={faTimes} style={{color: "#000", fontSize: '4vw'}} onClick={()=>setModalshow(false)}/>
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
    height: 18vh;
    padding-top: 1vh;
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
    margin-left: 45px;
    background-color: #888888;
`
const Xlabel = styled.div`
    width: 40px;
    text-align: center;
    margin-top: 3px;
    font-size: 2.93vw;
`


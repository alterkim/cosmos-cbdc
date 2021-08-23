//CentralBank Tab

import React, {useState, useEffect,Fragment } from 'react'
import { dbService } from '../fbase';
import Base from '../components/Layout/Base';
import styled from "styled-components"

import ContentWrapper from '../components/Layout/ContentWrapper'
import {Tabs} from 'react-simple-tabs-component'
import 'react-simple-tabs-component/dist/index.css'
import TokenTransfer from '../_helpers/TokenTransfer';
import {USER_ID,AFFILIATE_ID} from '../constants/Constants'

const TabOne = () =>{
    const [state, setState] = useState({});
    const [disabledValidity, setDisabledValidity] = useState(true);
    const [disabledAccountSetting, setDisabledAccountSetting] = useState(true);
    const [disabledSetRate, setDisabledSetRate] = useState(true);

    
    const handleChange = (event) => {
        if(event.target.name === "issued_amount"){
            var val = Number(event.target.value.replace(/\D/g, ''))
            setState({
                ...state,
                [event.target.name]: val.toLocaleString()
            });         
        }else{
            if(event.target.name === "issue_purpose"){
                // account_setting 활성화
                
                if(event.target.value === "재난지원"){
                    setDisabledAccountSetting(false);
                    setState({
                        ...state,
                        [event.target.name] : event.target.value,
                        ["account_setting"]: ""
                    })
                }else{
                    setState({
                        ...state,
                        [event.target.name] : event.target.value,
                        ["account_setting"]: "일반형"
                    });
                }
            }else if(event.target.name === "account_setting"){
                // set_rate 활성화 (감소형일때)
                if(event.target.value === "감소형"){
                    setDisabledSetRate(false);
                }else{
                    setDisabledValidity(false);
                }
                setState({
                    ...state,
                    [event.target.name]: event.target.value
                });

            }else if(event.target.name === "set_rate"){
                //validity 설정
                var theDate = new Date(state["issue_day"])
               
                var newDate = new Date(theDate.setMonth(theDate.getMonth()+(100/parseInt(event.target.value))))
                var dateString = newDate.getUTCFullYear().toString()+'-'
                    + ((newDate.getMonth()+1)<10? "0"+(newDate.getMonth()+1).toString() : (newDate.getMonth()+1).toString()) +'-'
                    + (newDate.getDate()<10? "0"+newDate.getDate().toString():newDate.getDate().toString())
                
                //setDisabledValidity(false)
                setState({
                    ...state,
                    ["validity"]: dateString,
                    [event.target.name]: event.target.value
                })
                
            }else{
                setState({
                    ...state,
                    [event.target.name]: event.target.value
                });
            }
            
        }
        
    }
    //발행 값 state에 저장완료
    const onClickIssue = async() => {
        var val = Number(state['issued_amount'].replace(/\D/g, ''))

        var randomNum = (Math.floor(Math.random()*(10000-1)) + 1)+'';
        while(randomNum.length < 5){
            randomNum = '0'+randomNum
        }
        await dbService
            .collection(`IssueInfo`)
            .add({
                ...state,
                ["issue_number"]: "DC2021-"+randomNum,
                ['processing_status'] : '미배정',
                ['issued_amount'] : val
            })
        if (state['account_setting']==="감소형"){
            await dbService
                .collection(`UserInfo`)
                .doc(USER_ID)
                .update({
                    reduce_cbdc_balance : 500000
                })
                
        }else if(state['account_setting']==="소멸형"){
            await dbService
                .collection(`UserInfo`)
                .doc(USER_ID)
                .update({
                    extinct_cbdc_balance : 500000
                })
        }

        TokenTransfer(val)
        window.location.reload();
    }
    return (
        <Fragment>
            <div className="topbar">
                <nav className="navbar-custom">
                    <ul className="list-inline menu-left mb-0">
                        <li className="list-inline-item">
                            <button type="button" className="button-menu-mobile open-left waves-effect">
                                <i className="ion-navicon"></i>
                            </button>
                        </li>
                        <li className="hide-phone list-inline-item app-search">
                            <h3 className="page-title">CBDC 발행</h3>
                        </li>
                    </ul>

                    <div className="clearfix"></div>
                </nav>
            </div>
            <div className="modal-body" style={{backgroundColor:'#99CCFF'}}>     
                <div className="row mr-3" style={{marginBottom:20}}>
                    <div className="col-3 d-flex align-items-center" >
                        <label style={{whiteSpace: 'nowrap'}}>발행일자</label>
                        <div className="mx-2">
                            <input className="form-control" 
                                type="date" 
                                name="issue_day"
                                value={state.issue_day} 
                                onChange={handleChange}
                                style={{width:200}}
                                />
                        </div>
                    </div>
                </div>
                <div className="row mr-3"  style={{marginBottom:20}}>
                    <div className="col-3 d-flex align-items-center">
                        <label style={{whiteSpace: 'nowrap'}}>발행금액</label>
                        <div className="mx-2">
                            <input type="text" 
                                style={{width: 200, textAlign:'right'}} 
                                className="form-control" 
                                name="issued_amount"
                                value={state.issued_amount} 
                                onChange={handleChange} />
                        </div>
                        <label style={{whiteSpace: 'nowrap'}}>D-KRW</label>
                    </div>
                   
                </div>
                <div className="row mr-3" style={{marginBottom:20}}>
                    <div className="col-3 d-flex align-items-center" >
                        <label style={{whiteSpace: 'nowrap'}}>발행목적</label>
                        <div className="mx-2">
                            <select className="form-control" name="issue_purpose" value={state.issue_purpose} onChange={handleChange}>
                                <option>발행목적 선택</option>
                                <option value="일반자금">일반자금</option>
                                <option value="재난지원">재난지원</option>  
                            </select>
                        </div>
                    </div>
                    <div className="col-3 d-flex align-items-center">
                        <label className="">계정설정</label>
                        <div className="mx-2">
                            <select className="form-control"  disabled={disabledAccountSetting} name="account_setting" value={state.account_setting} onChange={handleChange}>
                                <option>계정 선택</option>
                                {/* <option value="일반형">일반형</option> */}
                                <option value="소멸형">소멸형</option>
                                <option value="감소형">감소형</option> 
                            </select>
                        </div>
                    </div>
                   
                    <div className="col-3 d-flex align-items-center">
                        <label className="">월 감소비율</label>
                        <div className="mx-2">
                            <select className="form-control"  disabled={disabledSetRate} name="set_rate" value={state.set_rate} onChange={handleChange}>
                                <option>감소율 선택</option>
                                <option value="10">10.0 %</option>
                                <option value="20">20.0 %</option>
                                <option value="30">30.0 %</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row mr-3" style={{marginBottom:20}}>
                    <div className="col-3 d-flex align-items-center">
                        <label style={{whiteSpace: 'nowrap'}}>유효기간</label>
                        <div className="mx-2">
                            <input className="form-control"
                                disabled={disabledValidity}
                                type="date" 
                                id="example-date-input"
                                name="validity"
                                value={state.validity} 
                                onChange={handleChange}
                                style={{width:200}} />
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div className="modal-footer border-0">
                <Button2 
                        data-dismiss="modal" aria-hidden="true"
                        onClick={onClickIssue} >발행</Button2>
                <Button2 
                        data-dismiss="modal" aria-hidden="true">취소</Button2>
            </div>
        </Fragment>
      )
}

const TabTwo = () =>{

    const [data, setData] = useState([]);
    const [state, setState] = useState([]);
    const [assignBank, setAssignBank] = useState("");

    const [modalshow, setModalshow] = useState(false)
    const [modalValue,setModalValue] = useState({})
    const tableColumn = ["발행일", "발행번호","발행금액","자금목적","계정설정","유효기간","배정은행","배정번호","처리상태"]

    const [showData, setShowData] = useState([]) 

    //DB에서 data값 가져오기
    useEffect(() => {
        getIssueData();
    }, [state]);

    const onChangeShowData=(e)=>{
        setShowData({
            ...showData,
            [e.target.name] : e.target.value 
        })
    }
    const onClickShow = () =>{
        for (var key in showData){
            if(key ==="start_date"){
                setData(data.filter(e=>e["issue_day"] >= showData[key]))
            }else if(key ==="end_date"){
                setData(data.filter(e=>e["issue_day"] <= showData[key]))
            }else{
                setData(data.filter(e=>e[key] === showData[key]))
            }
        }
    }

    const getIssueData = async()=>{
        try{
            const issueQuerySnapshot = await dbService
                .collection(`IssueInfo`)
                .orderBy('issue_day','desc')
                .get()
            const dataArray = issueQuerySnapshot.docs.map((doc)=>({
                ...doc.data()
            }))
            setData(dataArray)
        }catch(error){
            console.log(error)
        }
    }

    const onChangeAssignBank = (e)=>{
        setAssignBank(e.target.value)
    }

    const onClickDelete = async(e) => {
        try{
            const deleteSnapshot = await dbService
                .collection(`IssueInfo`)
                .where('issue_number','==',e.target.value)
                .get()
            await dbService.collection(`IssueInfo`).doc(deleteSnapshot.docs[0].id).delete()
            window.location.reload();
        }catch(error){
            console.log(error)
        }
    }

    const onClickAssign = async(e) => {
        try{
            if (!assignBank){
                return
            }
            const assignSnapshot = await dbService
                .collection(`IssueInfo`)
                .where('issue_number','==',e.target.value)
                .get()
            var randomNum = (Math.floor(Math.random()*(10000-1)) + 1)+'';
            while(randomNum.length < 5){
                randomNum = '0'+randomNum
            }
            if (assignBank==="하나은행"){
                randomNum = "HN2021-"+randomNum
            }else{
                randomNum = "PT2021-"+randomNum
            }
            
            await dbService.collection(`IssueInfo`).doc(assignSnapshot.docs[0].id).update({
                processing_status : "배정완료",
                assign_number : randomNum,
                assign_bank : assignBank
            })
            setModalshow(true)

            setModalValue({
                assign_number: randomNum,
                assign_bank : assignBank,
                issued_amount: assignSnapshot.docs[0].data().issued_amount,
            })
            //window.location.reload();
        }catch(error){
            console.log(error)
        }
    }

    return(
        <Fragment>
            <div className="topbar">
                <nav className="navbar-custom">
                    <ul className="list-inline menu-left mb-0">
                        <li className="list-inline-item">
                            <button type="button" className="button-menu-mobile open-left waves-effect">
                                <i className="ion-navicon"></i>
                            </button>
                        </li>
                        <li className="hide-phone list-inline-item app-search">
                            <h3 className="page-title">CBDC 배정 및 조회</h3>
                        </li>
                    </ul>

                    <div className="clearfix"></div>
                </nav>
            </div>
            <div className="card m-b-20" style={{backgroundColor:'#99CCFF'}}>
                <div className="card-block">
                    <div className="d-flex justify-content-between">
                        <div className="">
                            <div className="d-flex">
                                <div className="d-flex align-items-center mr-3">
                                    <label className="">발행일자</label>
                                    <div className="mx-2">
                                        <div className="form-group form-check-inline">
                                            <div className="form-check-inline">
                                                <input name='start_date' onChange={onChangeShowData} className="form-control" type="date" id="example-date-input"></input>
                                            </div>
                                            <span className="mx-3">-</span>
                                            <div className="form-check-inline">
                                                <input name='end_date' onChange={onChangeShowData} className="form-control" type="date" id="example-date-input"></input>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            

                            <div className="d-flex">
                                <div className="d-flex align-items-center mr-3">
                                    <label className="">배정은행</label>
                                    <div className="mx-2">
                                        <select name='assign_bank' onChange={onChangeShowData} className="form-control">
                                            <option value='하나은행'>하나은행</option>
                                            <option value='포스텍은행'>포스텍은행</option>
                                            <option value='카이스트'>카이스트은행</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center mr-3">
                                    <label className="">자금목적</label>
                                    <div className="mx-2">
                                        <select name='issue_purpose' onChange={onChangeShowData} className="form-control">
                                            <option>전체</option>
                                            <option value='일반자금'>일반자금</option>
                                            <option value='재난지원'>재난지원</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <label className="">처리상태</label>
                                    <div className="mx-2">
                                        <select name='processing_status' onChange={onChangeShowData} className="form-control">
                                            <option>전체</option>
                                            <option value='미배정'>미배정</option>
                                            <option value='배정완료'>배정완료</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex flex-column justify-content-between">
                            <div>
                                <Button2 onClick={onClickShow}>조회</Button2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between mb-2">
                <div>총 {data.length}건</div>
                <div>(단위: D-KRW)</div>
            </div>
            <table id="datatable" className="table table-bordered" >
                <thead>
                    <tr>
                        <th></th>
                        {
                            tableColumn.map((e,i)=>(
                                <th style={{textAlign:'center'}} key={i}>{e}</th>
                            ))
                        }
                        <th></th>
                    </tr>
                </thead>
                <tbody style={{textAlign:'center'}} >
                    {
                        data.map((el, i) => (
                            <tr key={i} >
                                <td>{i+1}</td>
                                <td> {el.issue_day} </td>
                                <td> {el.issue_number} </td>
                                <td> {el.issued_amount.toLocaleString()} </td>
                                <td> {el.issue_purpose} </td>
                                <td> {el.account_setting} 
                                     {
                                        el.set_rate !== '0' && el.set_rate !== undefined? <> ({el.set_rate}%)</> : <></>
                                     }
                                      </td>
                                <td> {el.validity} </td> 
                                <td style={{width:150}}>
                                    {
                                        el.assign_number ? (
                                            <>
                                                {el.assign_bank}
                                            </>
                                        ):
                                        (
                                            <>
                                                <select className="form-control" onChange={onChangeAssignBank}>
                                                    <option></option>
                                                    <option value="하나은행">하나은행</option>
                                                    <option value="포스텍은행">포스텍은행</option>
                                                </select>
                                            </>
                                        )
                                        
                                    }
                                    
                                </td>
                                <td> {el.assign_number} </td>
                                <td> {el.processing_status} </td>
                                <td> 
                                    <div className="d-flex justify-content-center" >      
                                        {el.assign_number!==undefined?(
                                        <>
                                            <Button1 style={{width:'100%'}} >배정</Button1>
                                            <Button1 style={{width:'100%'}} >삭제</Button1>
                                        </>
                                        ):(
                                        <>
                                            <Button2 style={{width:'100%'}} value={el.issue_number} onClick={onClickAssign}>배정</Button2>
                                            <Button2 style={{width:'100%'}} value={el.issue_number} onClick={onClickDelete}>삭제</Button2>
                                        </>)}
                                    </div>
                                </td>
                                
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className="d-flex justify-content-end">
                <div className="mt-3">
                    ※ 배정완료 후에는 수정, 삭제 불가능합니다.
                </div>
            </div>
            {modalshow && <Modal>
                <ModalBackground></ModalBackground>
                <ModalBody>
                    <div
                        style={{fontSize: '20px', fontWeight: 600}}
                    >
                        [배정완료]
                    </div>
                    <div style={{
                        marginTop: 20,
                        width: '80%',
                        textAlign: 'center',
                        fontSize: '20px',
                        color: "#6c6969"
                    }}>
                        금액 : {modalValue.issued_amount && modalValue.issued_amount.toLocaleString()} D-KRW <br/>
                        배정은행 : {modalValue.assign_bank} <br/>
                        배정번호 : {modalValue.assign_number} <br/>
                    </div>
                    <button
                        onClick={() => {
                            setModalshow(false)
                            window.location.reload();
                        }}
                        style={{
                            marginTop: 40,
                            width: '80%',
                            height: '50px',
                            backgroundColor: '#00b2a7',
                            color: '#ffffff',
                            fontSize: '20px',
                            border: 'none',
                            borderRadius: 3,
                            outline: 'none'
                        }}
                    >
                        닫기
                    </button>
                </ModalBody>
            </Modal>}
        </Fragment>
    )
}

const tabs = [
    {
      label: 'CBDC 발행', // Tab title
      index: 1,         // Tab index
      Component: TabOne // Tab Component
    },
    {
      label: 'CBDC 배정 및 조회',
      index: 2,
      Component: TabTwo
    },
]
  
const Home = ({history}) => {
    
    const [selectedTab, setSelectedTab] = useState(tabs[1].index)

    return (
        <Base bankName={"중앙은행"} history={history}>
        <ContentWrapper>
            <Tabs tabs={tabs} onClick={setSelectedTab} selectedTab={selectedTab}/>
            
        </ContentWrapper>
        </Base>
    );
}

export default Home;


const Modal = styled.div`   
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
    top: 200px;
    right: 300px;
    left: 300px;
    padding: 20px 10px;
    border-radius: 5px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Button2 = styled.button`
    color: #ffffff;
    border-radius: 0.5vh;
    border: none;
    background-color: #00b2a7;
    outline: none;
    padding: 0.5vw 1.5vh;
    cursor : pointer;
    margin-right : 5px;
    margin-left : 5px;
`
const Button1 = styled.button`
    color: #adacac;
    border-radius: 0.5vh;
    background-color: #ffffff;
    border: 1px solid #adacac;
    outline: none;
    padding: 0.5vw 1.5vh;
    margin-right : 5px;
    margin-left : 5px;
`

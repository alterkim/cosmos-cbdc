//Commercial Bank Tab One

import React, { useEffect, useState,Fragment } from 'react'

import styled from 'styled-components';
import Base from '../components/Layout/Base';

import ContentWrapper from '../components/Layout/ContentWrapper'
import { dbService } from '../fbase';
import {Tabs} from 'react-simple-tabs-component'
import 'react-simple-tabs-component/dist/index.css'


const TabOne=()=>{
    const IssueDetailData = [
        {
            issue_day: '2021-01-15 09:30:00',
            user_number: 1234567,
            user_name: '한정수',
            issue_amount: '1,000,000',
            user_wallet: '0xDndyf9nbhdjskrFGHd',
            user_account: '111-1111-1111'
        },
        {
            issue_day: '2021-01-15 10:00:00',
            user_number: 3455678,
            user_name: '이두나',
            issue_amount: '1,000,000',
            user_wallet: '0xDndyf9nbhdjskrFGHd',
            user_account: '111-1111-1111'
        },
        {
            issue_day: '2021-01-15 10:30:00',
            user_number: 3727585,
            user_name: '전삼나',
            issue_amount: '1,000,000',
            user_wallet: '0xDndyf9nbhdjskrFGHd',
            user_account: '111-1111-1111'
        },
        {
            issue_day: '2021-01-15 11:00:00',
            user_number: 1756349,
            user_name: '윤사나',
            issue_amount: '1,000,000',
            user_wallet: '0xDndyf9nbhdjskrFGHd',
            user_account: '111-1111-1111'
        },
        {
            issue_day: '2021-01-15 11:30:00',
            user_number: 6065330,
            user_name: '김오나',
            issue_amount: '1,000,000',
            user_wallet: '0xDndyf9nbhdjskrFGHd',
            user_account: '111-1111-1111'
        },

        
    ];

    const [data, setData] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [detailSetting, setDetailSetting] = useState({})
    const IssueManagingColumn = ["배정일","배정번호","배정금액","배정잔액","자금목적","계정설정","유효기간"]
    const IssueDetailManagingColumn = ["일시","고객번호","고객명","금액","지갑주소","계좌번호"]

    //DB에서 data값 가져오기
    useEffect(() => {
        getIssueData();
    }, []);

    const onClickShowDetail = (el)=>{
        setShowDetail(!showDetail)
        setDetailSetting({...el})
    }
    const getIssueData = async()=>{
        try{
            const issueQuerySnapshot = await dbService
                .collection(`IssueInfo`)
                .orderBy('issue_day','desc')
                .get()
            const dataArray = issueQuerySnapshot.docs.map((doc)=>({
                ...doc.data(),
            }))
            setData(dataArray.filter(e=>e["assign_bank"]==="하나은행"))
        }catch(error){
            console.log(error)
        }
    }

    return(
        <Fragment>  
            {
                showDetail ? (
                    <> 
                    <div className="topbar">
                        <nav className="navbar-custom">
                            <ul className="list-inline menu-left mb-0">
                                <li className="list-inline-item">
                                    <button type="button" className="button-menu-mobile open-left waves-effect">
                                        <i className="ion-navicon"></i>
                                    </button>
                                </li>
                                <li className="hide-phone list-inline-item app-search">
                                    <h3 className="page-title">CBDC 배정관리(상세내역)</h3>
                                </li>
                            </ul>
                            <div className="clearfix"></div>
                        </nav>
                    </div>
                    <div className="card m-b-20" style={{backgroundColor:'#99CCFF'}}>
                        <div className="card-block">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div className="form-group">
                                        <div className="d-flex align-items-center mr-3">
                                            <label className="mr-3">배정번호</label>
                                            <input disabled defaultValue={detailSetting.issue_number} style={{width:150, textAlign:'center'}} className="form-control" type="text" ></input>
                                            
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="d-flex align-items-center mr-3">
                                            <label className="mr-3">자금목적</label>
                                            <div className="form-check-inline">
                                                <input disabled style={{width:150, textAlign:'center'}} className="form-control" type="text" defaultValue={detailSetting.issue_purpose}></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="d-flex align-items-center mr-3">
                                            <label className="mr-3">계정설정</label>
                                            <div className="form-check-inline">
                                                <input disabled style={{width:150, textAlign:'center'}} className="form-control" type="text" defaultValue={detailSetting.account_setting+"("+detailSetting.set_rate+"%)"}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <div>총 {IssueDetailData.length}건</div>
                        <div>(단위: D-KRW)</div>
                    </div>
                    <table id="datatable" className="table table-bordered">
                        <thead>
                            <tr >
                                <th></th>
                                {
                                    IssueDetailManagingColumn.map((e,i)=>(
                                        <th style={{textAlign:'center'}} key={i}>{e}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                IssueDetailData.map((el, i) => (
                                    <Item style={{textAlign:'center'}} key={i} >
                                        <td> {i+1} </td>
                                        <td> {el.issue_day} </td>
                                        <td> {el.user_number} </td>
                                        <td> {el.user_name} </td>
                                        <td> {el.issue_amount} </td>
                                        <td> {el.user_wallet} </td>
                                        <td> {el.user_account} </td>
                                        
                                    </Item>
                                ))
                            }
                        </tbody>
                    </table>
                    </>
                ) :(
                    <>
                    <div className="topbar">
                        <nav className="navbar-custom">
                            <ul className="list-inline menu-left mb-0">
                                <li className="list-inline-item">
                                    <button type="button" className="button-menu-mobile open-left waves-effect">
                                        <i className="ion-navicon"></i>
                                    </button>
                                </li>
                                <li className="hide-phone list-inline-item app-search">
                                    <h3 className="page-title">CBDC 배정관리</h3>
                                </li>
                            </ul>
                            <div className="clearfix"></div>
                        </nav>
                    </div>
                    <div className="card m-b-20" style={{backgroundColor:'#99CCFF'}}>
                        <div className="card-block">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <div className="form-group">
                                        <div className="d-flex align-items-center mr-3">
                                            <label className="mr-3">배정은행</label>
                                            <div className="form-check-inline">
                                                <input disabled style={{width:100}} className="form-control" type="text" defaultValue="하나은행"></input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="mr-3">배정일자</label>
                                        <div className="form-check-inline">
                                            <input className="form-control" type="date" id="example-date-input"></input>
                                        </div>
                                        <span className="mx-3">-</span>
                                        <div className="form-check-inline">
                                            <input className="form-control" type="date" id="example-date-input"></input>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div className="d-flex align-items-center mr-3">
                                            <label className="">자금목적</label>
                                            <div className="mx-3">
                                                <select className="form-control">
                                                    <option>전체</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="d-flex flex-column justify-content-end">
                                    <div>
                                        <Button2>조회</Button2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <div>총 {data.length}건</div>
                        <div>(단위: D-KRW)</div>
                    </div>
                    <table id="datatable" className="table table-bordered">
                        <thead>
                            <tr>
                                <th></th>
                                {
                                    IssueManagingColumn.map((e,i)=>(
                                        <th style={{textAlign:'center'}} key={i}>{e}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((el, i) => (
                                    <Item key={i} >
                                        <td> {i+1} </td>
                                        <td> {el.issue_day} </td>
                                        <td  onClick={()=>onClickShowDetail(el)}> {el.issue_number} </td>
                                        <td> {el.issued_amount&&el.issued_amount.toLocaleString()} </td>
                                        <td> {el.issued_amount&&(el.issued_amount*0.7).toLocaleString()} </td>
                                        <td> {el.issue_purpose} </td>
                                        <td> {el.account_setting} ({el.set_rate}%) </td>
                                        <td> {el.validity} </td>
                                    </Item>
                                ))
                            }
                        </tbody>
                    </table>
                    </>

                )
            }
            
        </Fragment>
    )
}

const TabTwo=()=>{
     const DummyData = [
        {
            transaction_date: '2021-01-15 11:00:00',
            sender_number: "1234567",
            sender_name: '한정수',
            user_wallet: '0xDndyf9nbhdjskrdnjUh',
            user_account: '111-1111-1111',
            transaction_type: '교환',
            receiver_name: '한정수',
            bank_name: '하나은행',
            receiver_wallet:'-',
            receiver_account:'777-7777-7777',
            amount:'-200,000',
            issue_number: 'HN2021-002'
        },
        {
            transaction_date: '2021-01-15 11:30:00',
            sender_number: "1234567",
            sender_name: '한정수',
            user_wallet: '0xDndyf9nbhdjskrdnjUh',
            user_account: '111-1111-1111',
            transaction_type: '이체',
            receiver_name: '강두나',
            bank_name: '하나은행',
            receiver_wallet:'0xDndyf9nbhdjskrdnjUh',
            receiver_account:'222-2222-2222',
            amount:'-100,000',
            issue_number: 'HN2021-002'
        },
        {
            transaction_date: '2021-01-15 12:00:00',
            sender_number: "3456789",
            sender_name: '강두나',
            user_wallet: '0xahah88dadjskrdnjUh',
            user_account: '222-2222-2222',
            transaction_type: '결제',
            receiver_name: '하나분식',
            bank_name: '하나은행',
            receiver_wallet:'0xT99ga5nbhdjskrdnjUh',
            receiver_account:'555-5555-5555',
            amount:'-200,000',
            issue_number: 'HN2021-002'
        },
        {
            transaction_date: '2021-01-15 13:00:00',
            sender_number: "3456789",
            sender_name: '강두나',
            user_wallet: '0xahah88dadjskrdnjUh',
            user_account: '222-2222-2222',
            transaction_type: '교환',
            receiver_name: '강하나',
            bank_name: '하나은행',
            receiver_wallet:'-',
            receiver_account:'666-6666-6666',
            amount:'-100,000',
            issue_number: 'HN2021-002'
        },
        {
            transaction_date: '2021-01-15 14:00:00',
            sender_number: "4567890",
            sender_name: '강세나',
            user_wallet: '0xByndyf9nbh8djs8njUh',
            user_account: '333-3333-3333',
            transaction_type: '입금',
            receiver_name: '재난지원',
            bank_name: '-',
            receiver_wallet:'-',
            receiver_account:'-',
            amount:'+600,000',
            issue_number: 'HN2021-002'
        },
        {
            transaction_date: '2021-01-15 15:00:00',
            sender_number: "4567890",
            sender_name: '강세나',
            user_wallet: '0xByndyf9nbh8djs8njUh',
            user_account: '333-3333-3333',
            transaction_type: '교환',
            receiver_name: '강하나',
            bank_name: '하나은행',
            receiver_wallet:'-',
            receiver_account:'444-4444-4444',
            amount:'-500,000',
            issue_number: 'HN2021-002'
        },
        
    ]
    const [data, setData] = useState([]);
    const [showData, setShowData] = useState([]) 

    const TableColumnHeader = ["거래일시","고객번호","고객명","지갑주소","계좌번호","거래종류","사용처","사용은행","지갑주소(계좌번호)","거래금액","배정번호"]
   
    //DB에서 data값 가져오기
    useEffect(() => {
        //getIssueData();
        setData(DummyData)
    }, []);

    const getIssueData = async()=>{
        try{
            const issueQuerySnapshot = await dbService
                .collection(`TxInfo`)
                .orderBy('transaction_date','desc')
                .get()
            const dataArray = issueQuerySnapshot.docs.map((doc)=>({
                ...doc.data(),
            }))
            setData(dataArray)
        }catch(error){
            console.log(error)
        }
    }
    
    const onChangeShowData=(e)=>{
        setShowData({
            ...showData,
            [e.target.name] : e.target.value 
        })
    }
    const onClickShow = () =>{

        for (var key in showData){
            if(key ==="start_date"){
                setData(data.filter(e=>e["transaction_date"] >= showData[key]))
            }else if(key ==="end_date"){
                setData(data.filter(e=>e["transaction_date"] <= showData[key]))
            }else{
                setData(data.filter(e=>e[key] === showData[key]))
            }
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
                            <h3 className="page-title">CBDC 거래내역</h3>
                        </li>
                    </ul>
                    <div className="clearfix"></div>
                </nav>
            </div>
            <div className="card m-b-20" style={{backgroundColor:'#99CCFF'}}>
                <div className="card-block">
                    <div className="d-flex justify-content-between">
                        <div>
                            <div className="form-group">
                                <div className="d-flex align-items-center mr-3">
                                    <label className="mr-3">고객번호</label>
                                    <div className="form-check-inline mr-5">
                                        <input style={{width:100}} className="form-control" type="text" name='sender_number' onChange={onChangeShowData}></input>
                                    </div>
                                    <label className="mx-3">거래종류</label>
                                    <div className="form-check-inline mr-5">
                                        <select name='transaction_type' onChange={onChangeShowData} className="form-control">
                                            <option>전체</option>
                                            <option value='입금'>입급</option>
                                            <option value='이체'>이체</option>
                                            <option value='결제'>결제</option>
                                            <option value='교환'>교환</option>
                                        </select>
                                    </div>
                                    <label className="mx-3">계좌번호</label>
                                    <div className="form-check-inline mr-5">
                                        <input name='sender_account' onChange={onChangeShowData} style={{width:200}} className="form-control" type="text" ></input>
                                    </div>
                                    <label className="mx-3">배정은행</label>
                                    <div className="form-check-inline">
                                        <input style={{width:100, textAlign:'center'}} className="form-control" type="text" defaultValue="하나은행" readOnly={true}></input>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="d-flex align-items-center mr-3">
                                    <label className="mr-4">고객명&nbsp;&nbsp;</label>
                                    <div className="form-check-inline mr-5">
                                        <input name='sender_name' onChange={onChangeShowData} style={{width:100}} className="form-control" type="text"></input>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="mr-3">거래일자</label>
                                <div className="form-check-inline">
                                    <input name='start_date' onChange={onChangeShowData} className="form-control" type="date" defaultValue="" id="example-date-input"></input>
                                </div>
                                <span className="mx-3">-</span>
                                <div className="form-check-inline">
                                    <input name='end_date' onChange={onChangeShowData} className="form-control" type="date" defaultValue="" id="example-date-input"></input>
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex flex-column justify-content-end">
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
            <table id="datatable" className="table table-bordered">
                <thead>
                    <tr>
                        <th>순서</th>
                        {
                            TableColumnHeader.map((e,i)=>(
                                <th key={i} style={{textAlign:'center'}}>{e}</th>
                                ))
                        }
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((el, i) => (
                            <Item key={i}>
                                <td> {i+1} </td>
                                <td> {el.transaction_date} </td>
                                <td> {el.sender_number} </td>
                                <td> {el.sender_name} </td>
                                <td> {el.user_wallet} </td>
                                <td> {el.user_account} </td>
                                <td> {el.transaction_type} </td>
                                <td> {el.receiver_name} </td>
                                <td> {el.bank_name} </td>
                                <td> {el.receiver_wallet}<br/>({el.receiver_account})</td>
                                <td> {el.amount} </td>
                                <td> {el.issue_number} </td>
                            </Item>
                        ))
                    }
                </tbody>
            </table>
        </Fragment>
    )
}

const tabs = [
    {
      label: 'CBDC 배정관리', // Tab title
      index: 1,         // Tab index
      Component: TabOne // Tab Component
    },
    {
      label: 'CBDC 거래내역',
      index: 2,
      Component: TabTwo
    },
]


const Distribution = ({history}) => {

    const [selectedTab, setSelectedTab] = useState(tabs[1].index)

  

    return (
        <Base bankName={"하나은행"} history={history}>
        <ContentWrapper>
            <Tabs tabs={tabs} onClick={setSelectedTab} selectedTab={selectedTab}/>
        </ContentWrapper>
        </Base>
    );
}

export default Distribution;

const Item = styled.tr`
    cursor: pointer;
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
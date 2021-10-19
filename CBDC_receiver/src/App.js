import React from 'react'
import {Router, Route, Switch, Redirect} from 'react-router-dom'

import { history } from './_helpers';

import {
	OverseasInfoPage,
	OverseasDeatailPage} from './Pages/PersonalPage'

function App(){
	return (
		<div className="jumbotron">
			<div className="container">
				<div className="col-md-8 offset-md-2">
					{alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
					<Router history={history}>
						<Switch>
							<Route exact path="/" component={OverseasInfoPage}/>
							<Route path="/detail" render = {()=><OverseasDeatailPage/>}/>
						</Switch>
					</Router>
				</div>
			</div>
		</div>
	);
}

export default App;
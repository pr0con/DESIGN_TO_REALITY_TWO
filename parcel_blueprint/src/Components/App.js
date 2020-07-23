import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { navigate, useRoutes } from 'hookrouter';


import AppProvider from './AppProvider.js'; 
import { AppContext } from './AppProvider.js';


const StyledApp = styled.div`
	position: relative;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
`;


import { Login } from './Login.js';
import { Admin } from './Admin.js';
import { Public } from './Public.js';

function App() {
	const routes = {
		'/': () => <Public />,
		'/login': () => <Login />,
		'/admin': () => <Admin />,
	}
	const routeResult = useRoutes(routes);
	//const handleRoute = (r) => { navigate(r); }
	
	return(
		<AppProvider>
			<AppContext.Consumer>
				{({  }) => (			
					<StyledApp>
						{ routeResult }
					</StyledApp>
				)}
			</AppContext.Consumer>
		</AppProvider>
	)
}


if (document.getElementById('react_root')) {
    ReactDOM.render(<App />, document.getElementById('react_root'));
}

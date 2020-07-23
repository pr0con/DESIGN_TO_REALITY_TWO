import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';

const StyledLogin = styled.div`
	#centered-login-panel {
		position: absolute;
		
		top: 50%;
		left: 50%;
		
		width: 55rem;
		height: 35rem;

		transform: translate(-50%,-50%);
		
		display: flex;
		flex-direction: column;
		
		.centered-login-panel.top-row {
			display: flex;
			justify-content: center;
		}
		.centered-login-panel.center-row {
			flex-grow: 1;
		}
		.centered-login-panel.bottom-row {	
			display: flex;
			flex-direction: column;
			
			.centered-login-panel-bottom-row {
				min-height: 4.7rem;
				max-height: 4.7rem;
				width: 100%;
				
				&.row-one { margin-bottom: 3.6rem; }
				
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.login-panel-input-label {
					color: #9F3434;
					font-size: 3rem;
				}
				.login-panel-input-input {
					min-width: 34.8rem;
					min-height: 4.7rem;
					border: 1px solid #9F3434;
					
					color: #1C1C1C;
					font-size: 3rem;
					font-style: italic;
					
					text-indent: .5rem;
				}
			}
		}
	}
`;

export function Login() {
	const { request }  = useContext(AppContext);
		
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	
	const doLogin = () => {
		if(username != "" && password != "") {
			request('noop','get-jwt-token', JSON.stringify({ user: btoa(username), password: btoa(password) }));
			setUsername('');
			setPassword('');
		}
	}
	
	return(
		<StyledLogin>	
		
			<div id="centered-login-panel">
				<div className="centered-login-panel top-row">
					{/* Your Login Logo Here */ }
				</div>
				<div className="centered-login-panel center-row">
					
				</div>
				<div className="centered-login-panel bottom-row">
					<div className="centered-login-panel-bottom-row row-one">
						<span className="login-panel-input-label">UserName</span>
						<input type="text" className="login-panel-input-input" value={username} onChange={(e) => setUsername(e.target.value)}/>
					</div>
					<div className="centered-login-panel-bottom-row row-two">
						<span className="login-panel-input-label">Password</span>
						<input type="password" className="login-panel-input-input" 
							value={password} onChange={(e) => setPassword(e.target.value)}
							onKeyPress={(e) => {  (e.key === 'Enter') ? doLogin() : ''; }}
						/>
					</div>					
				</div>
			</div>
		</StyledLogin>
	)
}
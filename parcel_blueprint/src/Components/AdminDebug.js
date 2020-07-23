import React, { useContext } from 'react';
import styled from 'styled-components';
import ReactJson from 'react-json-view';
import { AppContext } from './AppProvider.js';

const StyledAdminDebug = styled.div`
	position: relative;
	width: 155rem;
	height: 100%;
	margin: 0 auto;
`

//<ReactJson src={ appContext } collapsed={true} /> //or false
export function AdminDebug() {
	//const appContext = useContext(AppContext);
	const { menuItems, adminOthers } = useContext(AppContext);	
	return(
		<StyledAdminDebug>
			<ReactJson src={{ menuItems, adminOthers }} collapsed={false} />
		</StyledAdminDebug>	
	)
}
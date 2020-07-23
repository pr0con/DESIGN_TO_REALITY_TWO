import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledSwitch = styled.div`
	min-width: 4rem;
	max-width: 4rem;
	height: 2.4rem;
	border: 1px solid rgba(159, 52, 52, .3);
	border-radius: 2.4rem;
	bacground: #fff;
	transition: all .2s;
	
	.switch-sliding-circle {
		position: relative;
		min-width: 2.4rem;
		min-height: 2.4rem;
		max-width: 2.4rem;
		max-height: 2.4rem;	
		border: 1px solid rgba(159, 52, 52, .3);
		border-radius: 50%;
		background: #fff;
		top: -1px;
		left: -1px; 
	}
	
	&:hover {
		cursor: pointer;	
	}

	&.switched-on {
		border: 0px;
		background: #9f3434;	
		
		.switch-sliding-circle {
			border: 1px solid #9f3434;
			top: 0px;
			left: 1.8rem;
		}
	}
`;

export function Switch({ swid, defaultState, exportValue }) {
	const [ on, setOn ] = useState(defaultState);	
	
	
	const handleClick = () => {
		setOn(!on);
		exportValue(!on);
	}
	
	useEffect(() => {
		setOn(defaultState);
	},[defaultState]);
	
	return(
		<StyledSwitch id={swid} onClick={ handleClick } className={on ? 'switched-on' : 'swtiched-off'}>
			<div className="switch-sliding-circle"></div>
		</StyledSwitch>
	)
}

import React, { useContext } from "react";
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';

const StyledHamburger = styled.div`
	position: absolute;
	top: 4.5rem;
	right: 10.8rem;
`;



export function Hamburger() {
	const { modalState, setModalState } = useContext(AppContext);
	
	return(
		<StyledHamburger>
			<button className={`hamburger hamburger--collapse ${modalState}`} type="button" onClick={(e) => setModalState('is-active')}>
			  <span className="hamburger-box">
			    <span className="hamburger-inner"></span>
			  </span>
			</button>
		</StyledHamburger>
	)
	
}
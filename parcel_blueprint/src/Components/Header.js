import React, { useEffect } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
	position: relative;
	background: #9F3434;
	width: 100%;
	 
	#header-mountain-svg {
		min-width: 100%;
		max-width: 100%;
		height: auto;
	}
	
	#header-logo-container { 
		position: relative;
		width: 100%;
			
		display: flex;
		justify-content: center;
		
		#header-logo-wrapper {	
			display: flex;
			flex-direction: column;
			justify-content: center;	
			align-items: center;
		
			#header-sub-title-bullets-wrapper {
				display: flex;
				color: #fff;
				font-size: 4.5rem;
				font-family: 'Kanit', sans-serif;
				font-weight: 200 !important;
				
				
				.header-sub-title-bullet:not(:last-child) {
					&::after {
						content: '\\00B7';
						padding-left: .5rem;
						padding-right: .5rem;
					}	
				}
			}
		}
	}
	
	padding: 0 0 25rem 0;
	clip-path: polygon(50vw 100%,100% 90%,100% 0,0 0,0 90%);
`;


import { Hamburger } from './Hamburger.js';

export function Header() {	
	return(
		<StyledHeader>
			 {/* full width Header SVG Here was ID header-mountain-svg */}.
			 
			<div id="header-logo-container">
				<div id="header-logo-wrapper">
					
					 {/* Center Header Logo SVG Here */}.
					<div id="header-sub-title-bullets-wrapper">
						<span className="header-sub-title-bullet">Design</span>
						<span className="header-sub-title-bullet">Illustration</span>
						<span className="header-sub-title-bullet">Photography</span>
					</div>
				</div>
			</div>
			
			<Hamburger />
		</StyledHeader>
	)
}	

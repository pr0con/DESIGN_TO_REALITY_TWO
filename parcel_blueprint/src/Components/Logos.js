import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { AppContext } from './AppProvider.js';


const StyledLogos = styled.div`
	position: relative;
	width: 100%;
	height: auto;
	padding-bottom: 24rem;
	
	#public-logos-display-grid {	
		position: relative;
		margin: 0 auto;
		margin-top: -15rem;
		width: 155rem;
		
		display: grid;
		grid-template-columns: repeat(3,  49.8rem);
		grid-gap: 2.4rem;

		.public-logo-wrapper {
			box-shadow: 0px 3px 6px rgba(0,0,0,.16);
			border-radius: .9rem;
			overflow: hidden;
		}
	}
	
`;


export function Logos() {
	const { publicLogos } = useContext(AppContext);

	return(
		<StyledLogos>
			<div id="public-logos-display-grid">
				{ (publicLogos !== null && publicLogos.length > 0) && publicLogos.map((pl) => ( 
					<div className="public-logo-wrapper" key={shortid.generate()}><img src={pl.bw_image_data} /></div>
				))}
			</div>
		</StyledLogos>	
	)
}
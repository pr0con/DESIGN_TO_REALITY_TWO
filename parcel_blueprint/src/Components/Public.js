import React from 'react';
import styled from 'styled-components';


const StyledPublic = styled.div`
	
`;

import { Header } from './Header.js';
import { Logos } from './Logos.js';
import { About } from './About.js';
import { Others } from './Others.js';
import { Footer } from './Footer.js';
import { Modal } from './Modal.js';

export function Public() {
	return(
		<StyledPublic>	
			<Header />
			<Logos />
			<About />
			<Others />
			<Footer />
			<Modal />
		</StyledPublic>
	)
}
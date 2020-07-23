import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';


const StyledAbout = styled.div`
	position: relative;
	width: 100%;
	background: #9F3434;
	height: 50rem;
	

	
	#public-about-content-wrapper {
		position: relative;
		width: 100rem;
		left: 50%;
		transform: translateX(-50%);
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items:center;		
		
		
		
		#public-about-profile-wrapper {
			position: relative;
			width: 30.4rem;
			height: 30.4rem;
			border-radius: 50%;
			display:flex;
			justify-content:center;
			align-items:center;
			margin-top: -12rem;
			
			img {
				
			}
		}
		#public-about-title {
			color: #F7F7F7;
			font-size: 3rem;
			margin: 6rem 0 3.4rem 0;
			font-weight: 400;
		}
		#public-about-bio {
			text-align: center;
			color: #F7F7F7;
			font-size: 2rem;
		}
	}
	
`;

export function About() {
	const { publicAbout } = useContext(AppContext);
	
	return(
		<StyledAbout>
			{publicAbout !== null && 
				<div id="public-about-content-wrapper">
					<div id="public-about-profile-wrapper"><img src={publicAbout['profile_image_data']} /></div>
					<div id="public-about-title">{ publicAbout['title'] }</div>
					<div id="public-about-bio">{ publicAbout['bio'] }</div>
				</div>
			}
		</StyledAbout>
	)
}
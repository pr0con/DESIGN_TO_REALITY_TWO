import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
	position: relative;
	width: 100vw;
	height: auto;
	margin-top: 10rem;
		
	#footer-top {
		position: relative;
		min-height: 25rem;
		height: 25rem;
		
		#footer-top-center-content {
			position: relative;
			width: 155rem;
			margin: 0 auto;
			border-top: 1px solid #333333;
			min-height: 100%;
			
			display: flex;
			
			justify-content: center;
			align-items: center;

			
			#footer-top-center-button {
				width: 45.8rem;
				height: 9rem;
				
				background: #9F3434;
				border-radius: .5rem;
				
				text-transform: uppercase;
				display: flex;
				
				justify-content: center;
				align-items: center;
				
				font-size: 3.5rem;
				color: #ffffff;
				
				&:hover { cursor: pointer; }			
			}
		}
	}
	
	#footer-bottom {
		position: relative;
		height: 34.6rem;
		background: #1C1C1C;
		width: 100%;	
		
		
		
		#footer-bottom-content-rows {
			width: 155rem;
			position: relative;
			margin: 0 auto;
			
			display: flex;
			flex-direction: column;
			
			#footer-bottom-row-one {
				height: 12rem;
			}
			#footer-bottom-row-two {
				display: flex; 
				align-items: flex-end;

				
				#footer-bottom-row-two-left {
					flex-grow: 1;
					display: flex;
					justify-content: center;
				}
				#footer-bottom-row-two-right {
					#footer-instagram-svg {
						margin-right: 2rem;
						margin-bottom: 1.8rem;
					}
					#footer-facebook-svg {
						margin-bottom: 2.3rem;
					}
				}
			}
			#footer-bottom-row-three {
				color: #CBCBCB;
				font-size: 2.5rem;
				text-align: right;
				font-weight: 400;
			}
		}
	}	
`;

export function Footer() {
	return(
		<StyledFooter>
			<div id="footer-top">
				<div id="footer-top-center-content">
					<div id="footer-top-center-button">
						Lets get started
					</div>
				</div>
			</div>
			<div id="footer-bottom">
				<div id="footer-bottom-content-rows">
					<div id="footer-bottom-row-one"></div>
					<div id="footer-bottom-row-two">
						<div id="footer-bottom-row-two-left">
							
							{/* Your Footer Svg Logo Here */}
							
						</div>
						<div id="footer-bottom-row-two-right">
							<svg id="footer-instagram-svg" xmlns="http://www.w3.org/2000/svg"  width="39.125" height="39.125" viewBox="0 0 39.125 39.125">
							  <defs>
							    <clipPath id="clip-path">
							      <rect id="Rectangle_6" width="39.125" height="39.125" fill="#cbcbcb"/>
							    </clipPath>
							  </defs>
							  <g id="Group_4">
							    <g id="Group_3"  clipPath="url(#clip-path)">
							      <g id="Group_2" clipPath="url(#clip-path)">
							        <path id="Path_15"  d="M77.544,63a1.9,1.9,0,0,1-1.888-1.824,1.843,1.843,0,0,1,1.829-1.856,1.777,1.777,0,0,1,1.862,1.8A1.845,1.845,0,0,1,77.544,63m6.705-2.418a8.108,8.108,0,0,0-7.73-6.445c-.351-.02-.7-.093-1.047-.142H63.2c-.827.12-1.664.192-2.477.369a8.152,8.152,0,0,0-6.582,7.781c-.02.353-.093.7-.142,1.052v12.27c.116.8.189,1.613.353,2.405a8.165,8.165,0,0,0,7.8,6.645c.4.022.8.1,1.2.152H75.165c.977-.141,1.974-.205,2.93-.432a8.1,8.1,0,0,0,6.425-7.722c.027-.453.1-.9.153-1.354V63.346c-.138-.924-.209-1.864-.425-2.769m-2.491,15.4a5.855,5.855,0,0,1-1.34,3.83,5.64,5.64,0,0,1-4.35,1.93c-2.272.068-4.547.016-6.819.016v.007c-2.172,0-4.346.06-6.514-.014-3.579-.123-5.737-2.215-5.812-5.789-.093-4.469-.079-8.942.005-13.41A5.276,5.276,0,0,1,61.2,57.108a17.088,17.088,0,0,1,3.426-.321c3.756-.005,7.515,0,11.269.114,3.678.112,5.792,2.217,5.863,5.9.084,4.394.039,8.789,0,13.184M69.389,61.457A7.866,7.866,0,1,0,77.2,69.4a7.817,7.817,0,0,0-7.81-7.941m-.081,12.951a5.084,5.084,0,1,1,5.11-5.078,5.043,5.043,0,0,1-5.11,5.078" transform="translate(-49.775 -49.765)" fill="#cbcbcb"/>
							      </g>
							    </g>
							  </g>
							</svg>
													
							
							
							<svg id="footer-facebook-svg" xmlns="http://www.w3.org/2000/svg" width="14.009" height="30.109" viewBox="0 0 14.009 30.109">
							  <defs>
							    <clipPath id="clip-path">
							      <rect id="Rectangle_8"  width="14.009" height="30.109" fill="#cbcbcb"/>
							    </clipPath>
							  </defs>
							  <g id="Group_7" >
							    <g id="Group_6" clipPath="url(#clip-path)">
							      <g id="Group_5"  clipPath="url(#clip-path)">
							        <path id="Path_16"  d="M14.008,9.674c-.187,1.936-.367,3.628-.547,5.442H9.2V30.109H3.028v-15c-.36-.032-.682,0-1,0-.334-.006-.682.006-1.016.006H.057c-.064-.244-.084-4.837-.026-5.442H2.983v-.3c.013-1.2-.006-2.386.026-3.589a6.4,6.4,0,0,1,.708-2.747A5.282,5.282,0,0,1,7.511.18,12.021,12.021,0,0,1,10.142,0c1.151.006,2.309.006,3.467.013h.309V5.2H13.6c-.958,0-1.917-.013-2.875-.013A1.321,1.321,0,0,0,9.222,6.657c0,.939-.019,1.872-.019,2.811v.206Z" transform="translate(0.001 0)" fill="#cbcbcb"/>
							      </g>
							    </g>
							  </g>
							</svg>
						</div>							
					</div>
					<div id="footer-bottom-row-three">
						Copyright 2020
					</div>
				</div>
			</div>
		</StyledFooter>	
	)
}

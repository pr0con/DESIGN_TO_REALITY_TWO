import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';


const StyledModal = styled.div`
	display:none;
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100vw;
	height: 100vh;
	background: rgba(28, 28, 28, .8);
	
	&.is-active {
		display: block;
		z-index: 999999;
	}
	
	#modal-center-menu {
		position: absolute;
		width: 54rem;
		height: 90rem;
		background: #fff;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 5px 10px 30px;
		
		#modal-center-menu-underlay {
			background: rgba(203, 203, 203, 1);
			postion: absolute;
			top:0px;
			left: 0px;
			width: 100%;
			height: 100%;
			overflow: hidden;		
	
	
			#modal-overlay-menu {
				position: relative;
				top:0px;
				left:0px;
				width: 100%;
				height: 65rem;
				background: #1C1C1C;
				box-shadow: 5px 10px 30px;
				
				display: flex;
				flex-direction: column;	
				
				#modal-overlay-menu-logo-wrapper {
					margin-top: 8rem;
					display: flex;
					flex-direction: row;
					justify-content: center;
					margin-bottom: 9.5rem;
				}
				
				#modal-overlay-menu-items-wrapper {
					display: flex;
					flex-direction: column;	
					
					.modal-menu-item {
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-left: 8rem;
						margin-right: 8rem;
					
						.modal-menu-item-indicator {
							width: 2rem;
							height: 2rem;
							border-radius: 50%;
							border: 1px solid #9F3434;
						}
						
						.modal-menu-item-text {
							width: 100%;
							text-align:center;
							color: #CBCBCB;
							font-size: 3.5rem;
						}	
						
						&:hover {
							cursor:pointer;
						}						
					}					
				}							
			}
		}
	}	
	
`;

export function Modal() {
	const { menuItems, modalState, setModalState } = useContext(AppContext);
	
	return(
		<StyledModal className={`${modalState}`} onClick={(e) => setModalState('')}>
			<div id="modal-center-menu">
				<div id="modal-center-menu-underlay">
					<div id="modal-overlay-menu">
						<div id="modal-overlay-menu-logo-wrapper">
							{/* Your Modal Logo Here */}.					
						</div>
						<div id="modal-overlay-menu-items-wrapper">
							{	(menuItems !== null && menuItems.length > 0) && menuItems.map((mi) => (
								<div className="modal-menu-item"><div className="modal-menu-item-indicator"></div><div className="modal-menu-item-text">{ mi }</div></div>
							))}		
						</div>
					</div>
				</div>
			</div>	
		</StyledModal>
	)
}
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';

import 'antd/dist/antd.css';
import { AppContext } from './AppProvider.js';

const StyledAdmin = styled.div`
	position: relative;
	top:0px;
	left: 0px;
	width: 100%;
	height: 100%;
	
	display: flex;
	flex-direction: column;
	
	
	
	#admin-nav-bar {
		width: 100vw;
		height: 8rem;
		background: #1C1C1C;
		display: flex;
		justify-content: center;
		
		#admin-nav-bar-centered-elements {
			width: 80vw;
			height: 100%;	
			display: flex;
			
			#admin-nav-bar-logo {
				position: relative;
				top: 2.5rem;
				left: -3.8rem;
			}
			#admin-nav-bar-centered-elements-menu-items {
				flex-grow: 1;
				display: flex;
				padding-top: 2.5rem;
				font-weight: 300;

				.admin-menu-item-wrapper {
					display: flex;
					align-items: center;
					color: #FFFFFF;
					font-size: 2.5rem;
					margin-right: 4rem;
					
					.admin-menu-item-circle {
						width: 1.2rem;
						height: 1.2rem;
						border: 1px solid #9F3434;
						border-radius: 50%;
						margin-right: 1.5rem;					
					}
					.admin-menu-item-text {
					
					}
					
					&:hover { cursor: pointer; }
					&.selected {
						color: #9F3434;
					}	
				}
			}		
		}	
	}
	
	
	#admin-content-area {
		flex-grow: 1;
		
		#admin-home-content {
			position: relative;
			width: 100%;
			height: 100%;
			 
			#admin-home-large-red-logo {
				position: relative;
				
				top: 50%;
				left: 50%;
				
				transform: translate(-50%,-50%);
			}
		}
	}	
	
	.admin-form-label {
		color: #9f3434;
		font-size: 1.4rem;
	}
`;

import { AdminLogos } from './AdminLogos.js';
import { AdminOther } from './AdminOther.js';
import { AdminSiteContent } from './AdminSiteContent.js';
import { AdminSiteDesign } from './AdminSiteDesign.js';
import { AdminDebug } from './AdminDebug.js';
import { AdminToDo } from './AdminToDo.js';

export function Admin() {
	
	const [ selected, setSelected ] = useState('Home');
	const [ menu, setMenu ] = useState(['Home','Logos','Other','Site Content', 'Site Design', 'Debug', 'ToDo', 'Logout'])
	
	const { user, verifiedJwt, navigate, doLogOut } =  useContext(AppContext)
	
	
	useEffect(() => {
		if(user === null || !verifiedJwt) {
			navigate('/');
		}
	},[user, verifiedJwt]);
	
	const doSelected = (e, mi) => {
		console.log(mi);
		switch(mi) {
			
			case "Home":
			case "Logos":
			case "Other":
			case "Site Content":
			case "Site Design":
			case "Debug":
			case "ToDo":
				setSelected(mi)				
				break;
			case "Logout":
				doLogOut();
				break;
			default:
				break;
		}
		
		/*
			let menu_items = document.querySelectorAll('.admin-menu-item-wrapper');
			menu_items.forEach((mi) => {
				mi.classList.remove('selected');
			});
			
			e.currentTarget.classList.add('selected');
		*/
	}
	
	return(
		<StyledAdmin>	
			{ (user !== null && verifiedJwt) &&
				<>
					<div id="admin-nav-bar">
						<div id="admin-nav-bar-centered-elements">
							
							 {/*your svg logo here */}
							 
							 
							<div id="admin-nav-bar-centered-elements-menu-items">
								{ menu.length > 0 && menu.map((mi) => (
									<div className={`admin-menu-item-wrapper ${mi.replace(' ','-').toLowerCase()}  ${mi === selected ? 'selected' : ''}`} onClick={(e) => doSelected(e, mi)} key={shortid.generate()}>
										<span className="admin-menu-item-circle"></span>
										<span className="admin-menu-item-text">{ mi }</span>
									</div>
								))}
									
								
							</div>
						</div>
					</div>
					<div id="admin-content-area">
						{ selected === "Home" &&
							<div id="admin-home-content">
								{/* Your Admin Home SVG Logo Here */}
							</div>
						}
						{ selected === "Logos" && <AdminLogos /> }
						{ selected === "Other" && <AdminOther /> }
						{ selected === "Site Content" && <AdminSiteContent /> }
						{ selected === "Site Design" && <AdminSiteDesign /> }
						{ selected === "Debug" && <AdminDebug /> }
						{ selected === "ToDo" && <AdminToDo /> }
					</div>
				</>
			}
		</StyledAdmin>
	)
}
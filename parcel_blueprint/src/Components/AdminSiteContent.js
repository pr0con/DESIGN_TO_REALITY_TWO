import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';

const StyledAdminSiteContent = styled.div`
	position: relative;
	width: 155rem;
	height: 100%;
	margin: 0 auto;
	padding: 7rem 0 7rem 0;
	
	#admin-site-content-centered-containers
		position: relative;
		width: 104.5rem;
		margin: 0 auto;
		
		#admin-about-wrapper {
			#admin-about-section-label {
			}
			#admin-about-image-wrapper {
				width: 100%;
				display: flex;
				justify-content: center;
				
				.about-image-uploader {
					width: auto;
					
					.ant-upload-select {
						border-radius: 50%;	
					}	
				}
				margin-bottom: 1rem;
			}	
			
			#admin-site-content-bio-title {
				width: 100%;
				height: 5rem;
				text-indent: 1rem;
				
				border: 1px solid #9f3434;
				font-size: 2rem;
				
				::placeholder {
					color: rgba(159,52,52,.5);
				}	
				
				border-bottom: 0px;
				color: rgba(159,52,52,1);
			}
			
			#admin-site-content-bio {
				width: 100%;
				height: 28.6rem;
				border: 1px solid #9F3434;
				padding: 1rem;		
	
				::placeholder {
					color: rgba(159,52,52,.5);
				}	
				color: rgba(159,52,52,1);	
				font-size: 2rem;		
			}
			#admin-about-form-actions {
				padding-top: 2.8rem;
				display: flex;
				justify-content: right;
			}
		}
		#admin-site-content-lower-deck-grid {
			display: grid;
			grid-template-columns: 72rem 32rem;
			
			margin-top: 6.5rem;
			
			border-top: 1px solid #9F3434;
			padding-top: 3.6rem;
			
			#admin-site-content-header-form {
				padding: 3.4rem 6rem 0 0;
				border-right: 1px solid #9F3434;
				
				#admin-site-content-header-form-label {
				}
			}
			#admin-site-content-menu-items-form {
				padding: 3.4rem 0 0 6rem;
				
				#admin-site-content-menu-items-form-label {
					padding-top: 3.4rem 0 0 6rem;
					width: 100%;
					display: flex;
					justify-content: space-between; 
					align-items: center;
					margin-bottom: 2.8rem;
					
					.admin-site-content-menu-plus-sign {
						width: 1.4rem;
						height: 1.4rem;
					}
													
				}
				
				
				.admin-site-menu-item-input {
					min-width: 26rem;
					min-height: 4.7rem;
					border: 1px solid #9F3434;
					color: #1C1C1C;
					font-size: 2rem;
					text-indent: .5rem;	
					
					font-size: 1.4rem;
					color: #9F3434;	
					
					::placeholder {
						color: rgba(159,52,52,.5);
					}	
					&:not(:first-child) {
						margin-top: 1rem;
					}							
				}
				
			} 
		}
	}
	
	.red-button,
	.green-button {
		min-width: 9.6rem;
		min-height: 4rem;
		max-width: 9.6rem;
		max-height: 4rem;	
			
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: .4rem;
		
		&:hover { cursor:pointer; }
		color: #fff;
	}

	.red-button {
		background: #9F3434;
		margin-left: 2rem;
	}
	.green-button {
		background: #008374;
	}	
	

`;


import { Avatar, Upload } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export function AdminSiteContent() {
	const [ imageUploading, setImageUploading ] = useState(false);
	
	const [ bio, setBio ] = useState('');
	const [ title, setTitle ] = useState('');
	const [ imageBase64About, setImageBase64About ] = useState(null);	

	const [ sod, setSod ] = useState(false); //show on desktop
	const [ som, setSom ] = useState(false); //show on mobile	
	const [ imageBase64Header, setImageBase64Header ] = useState(null);
	
	const { jwt, request, adminAbout, menuItems, setMenuItems } = useContext(AppContext);
	
	
	const getBase64Value = (imgData, cb) => {
		const reader = new FileReader();
		reader.readAsDataURL(imgData);
		reader.onload = () => {
			cb(reader.result);
		}	
	}
		
	/* 
		Dummy request for antd upload customReqeust 
		At this point just send base64 data over 
		and store in DB...
	*/
	const dummyRequest = ({file, onSuccess}) => {
		setTimeout(() => {
			onSuccess('ok');
		},0);
	}	

	const validateImageUpload = (file) => {
		//console.log(file);
		const a = (file.type == "image/jpeg" || file.type == "image/png") ? true : false;
		const b = ((file.size / 1024 / 1024) < 1) ? true : false;
		
		(!a || !b) ? console.log('Invalid Image size') : '';
		return (!a || !b) ? false : true;
	}
	
	const handleImageUpload = async (info, forWhat) => {
		//console.log('i-fire-twice-by-design', info);
		const { file } = info;
		
		if(file.status === 'uploading') {
			setImageUploading(true);
			return;
		}
		
		if (file.status === 'done' && file.originFileObj) {			
			getBase64Value(
				file.originFileObj,
				B64Value => {
					(forWhat === "about") ? setImageBase64About(B64Value) : (forWhat === "header") ? setImageBase64Header(B64Value) : '';
					setImageUploading(false);
				}	
			);
		}	
				
	}
	
	
	const handleSaveAbout = () => {
		const about = {
			site_content_id: 'about',
			title: title,
			bio: bio,
			profile_image_data: imageBase64About
		}
		
		if(adminAbout === null) {	
			request(jwt, 'add-site-content-about-data', JSON.stringify(about));
		} else if(adminAbout !== null) {
			request(jwt, 'update-site-content-about-data', JSON.stringify(about));
		}
	}
	
	
	useEffect(() => {
		if(adminAbout) {
			setImageBase64About(adminAbout['profile_image_data']);
			setTitle(adminAbout['title']);
			setBio(adminAbout['bio']);
		} 
	},[adminAbout])		
	
	
	//https://stackoverflow.com/questions/3163615/how-to-scroll-html-page-to-given-anchor
	const handleAddMenuItem = () => {
		let nmii = menuItems.length; //new menu item index
		let payload = {
			menu_item_index: nmii,
			menu_item_text: `new item ${nmii}`	
		}
		request(jwt, "update-menu-items", JSON.stringify(payload));			
	}
	
	let lmii = -1; //last menu item index
	const [ mITimeout, setMITimeout ] = useState(null);
	const setMenuItem = (v,i) => {
		lmii = i;
		
		let mic = menuItems; //mic == menu item copy
		mic[i] = v;
		
		setMenuItems([...mic])
		clearTimeout(mITimeout)
		
		setMITimeout(setTimeout(function() {
			if(v != "") {
				let payload = {
					menu_item_index: lmii,
					menu_item_text: mic[i]	
				}			
				request(jwt, "update-menu-items", JSON.stringify(payload));
			}	
		},2000));	
	}
	
	return(
		<StyledAdminSiteContent>
			<div id="admin-site-content-centered-container">
				<div id="admin-about-wrapper">
					<div id="admin-about-section-label" className="admin-form-label">About</div>
					<div id="admin-about-image-wrapper">
						<Upload 
							name="about-image"
							className="about-image-uploader"
							listType="picture-card"
							showUploadList={false}
							customRequest={dummyRequest}
							beforeUpload={validateImageUpload}
							onChange={(info) => handleImageUpload(info, 'about')}
						>
							{ imageBase64About ? (
								<img src={imageBase64About} alt="admin-other" />										
							) : (
								<Avatar size={128} icon={<UserOutlined />} />
							)}				
						</Upload>
					</div>
					
					<input type="text" id="admin-site-content-bio-title" placeholder="Enter title text" value={title} onChange={(e) => setTitle(e.target.value)} />		
					<textarea id="admin-site-content-bio" placeholder="Enter about title" value={bio} onChange={(e) => setBio(e.target.value)} />
					<div id="admin-about-form-actions">
						<div className="green-button" onClick={(e) => handleSaveAbout() }>Save</div>
					</div>
				</div>		
				<div id="admin-site-content-lower-deck-grid">
					<div id="admin-site-content-header-form">
						<span id="admin-site-content-header-form-label" className="admin-form-label">Header Image</span>
					</div>
					<div id="admin-site-content-menu-items-form">
						<span id="admin-site-content-menu-items-form-label" className="admin-form-label">
							Menu Items
							<svg onClick={(e) => handleAddMenuItem()} focusable="false"  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="admin-site-content-menu-plus-sign  svg-inline--fa fa-plus fa-w-12 fa-2x"><path fill="currentColor" d="M368 224H224V80c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v144H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h144v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V288h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z"></path></svg>
						</span>
						{ menuItems.length > 0 && menuItems.map((mi,i) => (
							<input type="text" className="admin-site-menu-item-input" value={menuItems[i]} onChange={(e) => setMenuItem(e.target.value, i)}/>
						))}
					</div>					
				</div>
			</div>
		</StyledAdminSiteContent>	
	)
}







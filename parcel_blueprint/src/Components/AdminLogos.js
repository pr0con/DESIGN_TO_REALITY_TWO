import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';

const StyledAdminLogos = styled.div`
	position: relative;
	width: 155rem;
	height: 100%;
	margin: 0 auto;
	padding-top: 7rem;
	
	#admin-logos-top-grid {
		display: grid;
		grid-template-columns: 1fr 130rem;
		
		#admin-logos-top-grid-left {
			padding: 2rem;
			
			#admin-logos-large-red-plus-button {
				width: 22.5rem;
				height: 22.5rem;
				box-shadow: 0px 3px 6px rgba(0,0,0,.16);
				background: #9F3434;
				border-radius: .9rem;
				
				&:hover { cursor:pointer; }
				
				display: flex;
				align-items: center;
				justify-content:center;
				
				#admin-logos-large-red-plus-button-circle {
					width: 3.8rem;
					height: 3.8rem;
					background: #fff;
					border-radius: 50%;
					
					display: flex;
					align-items: center;
					justify-content:center;					
				}
			}		
		}
		padding-bottom: 7.5rem; 
		
	}
	
	
	.admin-logos-new-logo-form-container {
		position: relative;
		width: 104.5rem;
		margin: 0 auto;
		border-top: 1px solid #9F3434;
		
		.admin-logos-new-logo-form {
			position: relative;
			marign: 0 auto; 
			
			width: 64rem;
			height: 18rem;
			margin: 0 auto;
			margin-top: 7rem;
			
			display: grid;
			grid-template-columns: 1fr 24rem;
			
			.admin-logos-new-logo-form-left { 
				.logo-uploader {
					min-width: 14rem;
					min-height: 14rem;
					max-width: 14rem;
					max-height: 14rem;
					overflow: hidden;
					margin: 0 2rem 0 0;
					
					.ant-upload-select-picture-card {
						min-width: 14rem;
						min-height: 14rem;
						max-width: 14rem;
						max-height: 14rem;
						overflow: hidden;				
						margin: 0px;
						display: flex;
						align-items: center;
						justify-content: center;
						
						
						span.ant-upload {
							display: flex;
							align-items: center;
							justify-content: center;						
							padding: 0px;
						}
						
						img {
							min-width: 14rem;
							min-height: 14rem;
							max-width: 14rem;
							max-height: 14rem;
							width: 100%;
							height: 100%;
							object-fit: cover;
						}					
					}
					
				}
			}
			.admin-logos-new-logo-form-right {
				display: flex;
				flex-direction: column;
				
				.admin-logos-new-logo-form-right-top {
					display: flex;
					flex-direction: column;
					height: 50%;
					
					.admin-logo-properties-wrapper {
						display: flex;
						align-items: center;
						span { flex-grow: 1; color: #9F3434; }
						height: 50%;
						
					}
					
				}
				.admin-logos-new-logo-form-right-bottom {
					flex-grow: 1;
					display: flex;
					justify-content: right;
					padding-top: 1rem;
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
`

import { SlickSlider } from './SlickSlider.js';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; 

import  { Switch } from './Switch.js';


export function AdminLogos() {
	const [ sod, setSod ] = useState(false); //show on desktop
	const [ som, setSom ] = useState(false); //show on mobile
	
	const [ imageUploading, setImageUploading ] = useState(false);
	const [ imageBase64Value_BW, setImageBase64Value_BW ] = useState(null);
	const [ imageBase64Value_FC, setImageBase64Value_FC ] = useState(null);
	
	
	const { jwt, request, adminLogos, insertedLogoId, setInsertedLogoId } = useContext(AppContext); 

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
					(forWhat === "bw") ? setImageBase64Value_BW(B64Value) : (forWhat === "fc") ? setImageBase64Value_FC(B64Value) : '';
					setImageUploading(false);
				}	
			);
		}	
				
	}
	
	const handleSaveLogo = () => {
		let logo = {
			show_on_desktop: sod,
			show_on_mobile: som,
			bw_image_data: imageBase64Value_BW, 
			fc_image_data: imageBase64Value_FC
		}
		
		//console.log(logo);
		if(insertedLogoId === null) {
			request(jwt, 'create-new-logo', JSON.stringify(logo));
		}else if(insertedLogoId !== null) {
			logo['_id'] = insertedLogoId;
			request(jwt, 'update-existing-logo', JSON.stringify(logo));
		}
		
	}

	const resetForm = () => {
		setSod(false);
		setSom(false);
		setInsertedLogoId(null)
		setImageUploading(false);
		setImageBase64Value_BW(null);
		setImageBase64Value_FC(null);
	}


	//https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objectss
	useEffect(() => {
		if( insertedLogoId !== null && adminLogos !== null) {
			let cl = adminLogos.find(x => x._id === insertedLogoId); //cl == current logo
			
			/* Its possible this is a new Logo*/
			if(cl) {
				setImageBase64Value_BW(cl['bw_image_data']);
				setImageBase64Value_FC(cl['fc_image_data']);
				setSod(cl['show_on_desktop']);
				setSom(cl['show_on_mobile']);
			}
		}
	},[insertedLogoId])
	
	const handleDeleteLogo = () => {
		if( insertedLogoId !== null) {
			request(jwt, 'delete-existing-logo', insertedLogoId);	
			resetForm();
		}
	}
	
	
	return(
		<StyledAdminLogos>
			
			<div id="admin-logos-top-grid">
				<div id="admin-logos-top-grid-left">
					<div id="admin-logos-large-red-plus-button" onClick={(e) => resetForm()}>
						<div id="admin-logos-large-red-plus-button-circle">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
							  <path id="Union_1" data-name="Union 1" d="M6.563,15V8.438H0V6.562H6.563V0H8.438V6.562H15V8.438H8.438V15Z" fill="#9f3434"/>
							</svg>
						</div>
					</div>
				</div>
				<SlickSlider sliderFor="logos"  dataObjAry={(adminLogos !== null && adminLogos.length > 0) ? adminLogos : []} setInsertedLogoId={setInsertedLogoId} resetFunc={resetForm}/>
			</div>
			
			<div className="admin-logos-new-logo-form-container">
				<div className="admin-logos-new-logo-form">
					<div className="admin-logos-new-logo-form-left">
						<Upload 
							name="bw-image"
							className="logo-uploader"
							listType="picture-card"
							showUploadList={false}
							customRequest={dummyRequest}
							beforeUpload={validateImageUpload}
							onChange={(info) => handleImageUpload(info, 'bw')}
						>
							{ imageBase64Value_BW ? (
								<img src={imageBase64Value_BW} alt="admin-logo" />										
							) : (
								<div>
									{ imageUploading ? ( <LoadingOutlined /> ):( <PlusOutlined /> ) }
									Black & White
								</div>
							)}				
						</Upload>
						
						
						<Upload 
							name="fc-image"
							className="logo-uploader"
							listType="picture-card"
							showUploadList={false}
							customRequest={dummyRequest}
							beforeUpload={validateImageUpload}
							onChange={(info) => handleImageUpload(info, 'fc')}
						>
							{ imageBase64Value_FC ? (
								<img src={imageBase64Value_FC} alt="admin-logo" />										
							) : (
								<div>
									{ imageUploading ? ( <LoadingOutlined /> ):( <PlusOutlined /> ) }
									Full Color
								</div>
							)}				
						</Upload>
						<div className="current-logo-id">{ insertedLogoId }</div>					
					</div>
					
					<div className="admin-logos-new-logo-form-right">
						<div className="admin-logos-new-logo-form-right-top">
							<div className="admin-logo-properties-wrapper"><span>Show on Desktop</span><Switch defaultState={sod} exportValue={setSod} /></div>
							<div className="admin-logo-properties-wrapper"><span>Show on Mobile</span><Switch defaultState={som} exportValue={setSom} /></div>
						</div>
						<div className="admin-logos-new-logo-form-right-bottom">
							<div className="green-button" onClick={(e) => handleSaveLogo() }>Save</div>
							<div className="red-button" onClick={(e) => handleDeleteLogo()}>Delete</div>
						</div>
					</div>						
				</div>			
			</div>			
		</StyledAdminLogos>	
	)
}

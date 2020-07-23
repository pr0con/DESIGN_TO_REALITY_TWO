import React, { useState, useEffect, useContext }  from 'react';
import styled from 'styled-components';
import { AppContext } from './AppProvider.js';

const StyledAdminOther = styled.div`
	position: relative;
	width: 155rem;
	height: 100%;
	margin: 0 auto;
	padding-top: 7rem;
	
	#admin-other-top-grid {	
		display: grid;
		grid-template-columns: 1fr 126rem;
	
		#admin-other-top-grid-left {
			padding: 2rem;
			
			#admin-other-large-red-plus-button {
				width: 22.5rem;
				height: 22.5rem;
				box-shadow: 0px 3px 6px rgba(0,0,0,.16);
				background: #9F3434;
				border-radius: .9rem;
				
				&:hover { cursor:pointer; }
				
				display: flex;
				align-items: center;
				justify-content:center;
				
				#admin-other-large-red-plus-button-circle {
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
	
	.admin-other-new-other-form-container {
		position: relative;
		width: 104.5rem;
		margin: 0 auto;
		border-top: 1px solid #9F3434;
		display: grid;
		grid-template-columns: 1fr auto;
		
		.admin-other-new-other-title-wrapper {
			position: relative;
			margin-top: 7rem;
			
			input.admin-other-new-other-title {
				min-width: 34.8rem;
				min-height: 4.7rem;
				border: 1px solid #9F3434;
				
				color: #1C1C1C;
				font-size: 2rem;
				
				text-indent: .5rem;	
				
				::placeholder,
				::-webkit-input-placeholder {	
					color: #9F3434;
				}	
			}
		}
		.admin-other-new-other-form {
			position: relative;
			marign: 0 auto; 
			
			width: 64rem;
			height: 18rem;
			margin-top: 7rem;
			
			display: grid;
			grid-template-columns: 1fr 24rem;
			
			.admin-other-new-other-form-left { 
				.other-uploader {
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
			.admin-other-new-other-form-right {
				display: flex;
				flex-direction: column;
				
				.admin-other-new-other-form-right-top {
					display: flex;
					flex-direction: column;
					height: 50%;
					
					.admin-other-properties-wrapper {
						display: flex;
						align-items: center;
						span { flex-grow: 1; color: #9F3434; }
						height: 50%;
						
					}
					
				}
				.admin-other-new-other-form-right-bottom {
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
`;

import { SlickSlider } from './SlickSlider.js';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; 

import  { Switch } from './Switch.js';

export function AdminOther() {
	const [ sod, setSod ] = useState(false); //show on desktop
	const [ som, setSom ] = useState(false); //show on mobile	
	
	const [ imageUploading, setImageUploading ] = useState(false);
	const [ imageBase64Value_FG, setImageBase64Value_FG ] = useState(null);
	const [ imageBase64Value_BG, setImageBase64Value_BG ] = useState(null);
	
	const [ title, setTitle ] = useState('');
	
	const { jwt, request, adminOther, insertedOtherId, setInsertedOtherId } = useContext(AppContext); 	
	
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
					(forWhat === "fg") ? setImageBase64Value_FG(B64Value) : (forWhat === "bg") ? setImageBase64Value_BG(B64Value) : '';
					setImageUploading(false);
				}	
			);
		}	
				
	}	
	
	
	const handleSaveOther = () => {
		let other = {
			title: title,
			show_on_desktop: sod,
			show_on_mobile: som,
			fg_image_data: imageBase64Value_FG, 
			bg_image_data: imageBase64Value_BG
		}
		
		//console.log(other);
		if(insertedOtherId === null) {
			request(jwt, 'create-new-other', JSON.stringify(other));
		} else if(insertedOtherId !== null) {
			
			other['_id'] = insertedOtherId;
			request(jwt, 'update-existing-other', JSON.stringify(other));
		}
		
	}
	
	const resetForm = () => {
		setSod(false);
		setSom(false);
		setInsertedOtherId(null)
		setImageUploading(false);
		setImageBase64Value_FG(null);
		setImageBase64Value_BG(null);
		setTitle('');
	}

	//https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objectss
	useEffect(() => {
		if( insertedOtherId !== null && adminOther !== null) {
			let cl =  adminOther.find(x => x._id === insertedOtherId); //cl == current logo
			
			/* Its possible this is a new Other*/
			if(cl) {
				setTitle(cl['title']);
				setImageBase64Value_FG(cl['fg_image_data']);
				setImageBase64Value_BG(cl['bg_image_data']);
				setSod(cl['show_on_desktop']);
				setSom(cl['show_on_mobile']);
			}
		}
	},[insertedOtherId])	
	
	
	const handleDeleteOther = () => {
		if( insertedOtherId !== null) {
			request(jwt, 'delete-existing-other', insertedOtherId);	
			resetForm();
		}
	}
	
		
	return(
		<StyledAdminOther>
			<div id="admin-other-top-grid">
				<div id="admin-other-top-grid-left">
					<div id="admin-other-large-red-plus-button" onClick={(e) => resetForm()}>
						<div id="admin-other-large-red-plus-button-circle">
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
							  <path id="Union_1" data-name="Union 1" d="M6.563,15V8.438H0V6.562H6.563V0H8.438V6.562H15V8.438H8.438V15Z" fill="#9f3434"/>
							</svg>
						</div>
					</div>
				</div>
				<SlickSlider sliderFor="other"  dataObjAry={(adminOther !== null && adminOther.length > 0) ? adminOther : []} setInsertedOtherId={setInsertedOtherId} resetFunc={resetForm} />
			</div>
			<div className="admin-other-new-other-form-container">
				<div className="admin-other-new-other-title-wrapper"> 
					<input type="text" className="admin-other-new-other-title" value={title} onChange={(e) => setTitle(e.target.value) } placeholder="Title"/>
				</div>
				<div className="admin-other-new-other-form">
					<div className="admin-other-new-other-form-left">
						<Upload 
							name="bw-image"
							className="other-uploader"
							listType="picture-card"
							showUploadList={false}
							customRequest={dummyRequest}
							beforeUpload={validateImageUpload}
							onChange={(info) => handleImageUpload(info, 'fg')}
						>
							{ imageBase64Value_FG ? (
								<img src={imageBase64Value_FG} alt="admin-other" />										
							) : (
								<div>
									{ imageUploading ? ( <LoadingOutlined /> ):( <PlusOutlined /> ) }
									Forground
								</div>
							)}				
						</Upload>
						
						
						<Upload 
							name="fc-image"
							className="other-uploader"
							listType="picture-card"
							showUploadList={false}
							customRequest={dummyRequest}
							beforeUpload={validateImageUpload}
							onChange={(info) => handleImageUpload(info, 'bg')}
						>
							{ imageBase64Value_BG ? (
								<img src={imageBase64Value_BG} alt="admin-other" />										
							) : (
								<div>
									{ imageUploading ? ( <LoadingOutlined /> ):( <PlusOutlined /> ) }
									Backround
								</div>
							)}				
						</Upload>
						<div className="current-other-id">{ insertedOtherId }</div>					
					</div>
					
					<div className="admin-other-new-other-form-right">
						<div className="admin-other-new-other-form-right-top">
							<div className="admin-other-properties-wrapper"><span>Show on Desktop</span><Switch defaultState={sod} exportValue={setSod} /></div>
							<div className="admin-other-properties-wrapper"><span>Show on Mobile</span><Switch defaultState={som} exportValue={setSom} /></div>
						</div>
						<div className="admin-other-new-other-form-right-bottom">
							<div className="green-button" onClick={(e) => handleSaveOther() }>Save</div>
							<div className="red-button" onClick={(e) => handleDeleteOther()}>Delete</div>
						</div>
					</div>						
				</div>			
			</div>						
		</StyledAdminOther>	
	)
}
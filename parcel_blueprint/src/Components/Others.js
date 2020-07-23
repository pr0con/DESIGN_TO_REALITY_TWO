import React, { useState, useEffect, useContext } from 'react';
import styled, { css, keyframes } from 'styled-components';
import shortid from 'shortid';
import { AppContext } from './AppProvider.js';

const fadeIn = keyframes`
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

const fadeOut = keyframes`
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
`; 


//https://github.com/pr0con/VAR2_D2D_FRONTEND/blob/master/src/Components/Archived/KFAnime.js
//width: 70rem;
//height: 42rem;
const StyledOthers = styled.div`
	position: relative;
	width: 100%;
	height: 94rem;
	min-height: 94rem;

	#public-carousel-center-overlay,
	.public-carousel-background-image {
		position: absolute;
		top: 0px;
		left: 0px;
	}
	.public-carousel-background-image {
		opacity: 0;
		animation-name: ${fadeOut};
		animation-duration: .5s;	
		animation-iteration-count: 1;
		animation-fill-mode: forwards;  		
		
		&.index-${({currentIndex}) => currentIndex}	{
			animation-name: ${fadeIn};
			animation-duration: .8s;	
			animation-iteration-count: 1;
			animation-fill-mode: forwards;  
		}
	}
	
	#public-carousel-center-overlay {
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.8);
	}
	
	#public-carousel-center-content {
		position: relative;
		margin: 0 auto;
		width: 155rem;
		height: 100%;
		
		display: grid;
		grid-template-columns: auto 1fr auto;	
		
		#public-carousel-center-carousel-prev-wrapper {
			display: flex;
			align-items:center;
			&:hover { cursor:pointer; }
		}
		#public-carousel-center-carousel-container {
			display: flex;
			flex-direction: column;
			align-items:center;
			justify-content:center;
			
			#public-carousel-center-carousel-titles {
				height: 4.5rem;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: -2rem;
				
				.public-carousel-set-title {
					color: #fff;
					display: none;
					font-size: 4.5rem;
					
					&.index-${({currentIndex}) => currentIndex} {
						display: block;
					}
				}	
			}
			#public-carousel-center-carousel-fg-images {
				display: flex;
				margin-top: 8rem;
				justify-content: center;
				
				.public-carousel-foreground-image-wrapper {
					position: relative;
					
					width: 35rem;
					height: 21rem;
					
					background: #FFFFFF;
					box-shadow: 10px 10px 30px rgba(0,0,0,.62);
					border-radius: .9rem;
				
					z-index: 1;
					transform: scale(1);
					transition: all .34s linear;
					
					filter: blur(2px);
					
					.public-carousel-foreground-image {
						min-width: 100%;
						min-height: 100%;
						max-width: 100%;
						max-height: 100%;
						object-fit: cover;
					}
				
					&.index-${({currentIndex}) => currentIndex} {
						transform: scale(1.5);	
						z-index: 2;
						filter: blur(0);
					}	
					
					&:hover { cursor:pointer; }
				}
			}	
			#public-carousel-center-carousel-dots {
				display: flex;
				align-items: center;
				margin-top: 10rem;
				
				.public-carousel-dot {	
					width: 1.7rem;
					height: 1.7rem;					
					min-width: 1.7rem;
					min-height: 1.7rem;
					border-radius: 50%;
					background: #FFFFFF;
					
					&:nth-child( even ) {
						margin: 0 1rem 0 1rem;
					}
					&.index-${({currentIndex}) => currentIndex} {
						background: #9F3434;
					}
				}
			}
		}
		#public-carousel-center-carousel-next-wrapper {
			display: flex;
			align-items:center;
			&:hover { cursor:pointer; }
		}	
	}
`;

//key={shortid.generate()}
//https://codepen.io/Batmatt/full/MYvPEb
//https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascripts
export function Others() {
	const { publicOther } = useContext(AppContext);
	
	const [ currentIndex, setCurrentIndex ] = useState(1)
	
	
	const handleSetCurrentIndex = (op) => {
		switch(op) {
			case "prev":
				(currentIndex !== 0) ? setCurrentIndex(currentIndex - 1) : '';
				break;
			case "next":
				(currentIndex != (publicOther.length - 1)) ? setCurrentIndex(currentIndex + 1) : '';
				break;
			default:
				break;
		}
	}
	
	useEffect(() => {
		console.log(currentIndex);
	},[currentIndex])
	
	return(
		<StyledOthers currentIndex={currentIndex}>
			{	(publicOther !== null && publicOther.length > 0 ) && publicOther.map((po, i) => (
				<img src={po['bg_image_data']} className={`public-carousel-background-image index-${i}`} key={shortid.generate()}/>		
			))}	
			<div id="public-carousel-center-overlay"></div>

			
			<div id="public-carousel-center-content">
				<div id="public-carousel-center-carousel-prev-wrapper" onClick={(e) => handleSetCurrentIndex('prev') }>
					<svg xmlns="http://www.w3.org/2000/svg" width="35.1" height="60.4" viewBox="0 0 35.1 60.4">
					  <path id="Path_36" data-name="Path 36" d="M30.2,35.1,0,8.056,9,0,30.2,18.989,51.4,0l9,8.056Z" transform="translate(35.1) rotate(90)" fill="#fff"/>
					</svg>
				</div>
				
				<div id="public-carousel-center-carousel-container">
					<div id="public-carousel-center-carousel-titles">
						{	(publicOther !== null && publicOther.length > 0 ) && publicOther.map((po, i) => (
							<div className={`public-carousel-set-title index-${i}`} key={shortid.generate()}>{po['title']}</div>		
						))}							
					</div>
					<div id="public-carousel-center-carousel-fg-images">
						{	(publicOther !== null && publicOther.length > 0 ) && publicOther.map((po, i) => (
							<div className={`public-carousel-foreground-image-wrapper index-${i}`} onClick={(e) => setCurrentIndex(i)}>
								<img src={po['fg_image_data']} className={`public-carousel-foreground-image index-${i}`} key={shortid.generate()}/>	
							</div>
						))}
					</div>
					<div id="public-carousel-center-carousel-dots">
						{ (publicOther !== null && publicOther.length > 0 ) && Array.apply(null, Array(publicOther.length)).map((n,i) =>  (
							<span className={`public-carousel-dot index-${i}`}></span>
						))}
						
					</div>
				</div>
				
				<div id="public-carousel-center-carousel-next-wrapper" onClick={(e) => handleSetCurrentIndex('next') }>
					<svg xmlns="http://www.w3.org/2000/svg" width="35.1" height="60.4" viewBox="0 0 35.1 60.4">
					  <path id="Path_36" data-name="Path 36" d="M30.2,0,0,27.044,9,35.1,30.2,16.112,51.4,35.1l9-8.056Z" transform="translate(35.1) rotate(90)" fill="#fff"/>
					</svg>
				</div>	
			</div>
		</StyledOthers>
	)
}
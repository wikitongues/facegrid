import styled from 'styled-components';

export const Container = styled.div`
  padding: 24px 0 24px 24px;
  font-family: Arial, sans-serif;
	background-color: ${(props) => props.$bgColor || '#101010'};
`;

export const ToggleButton = styled.button`
  padding: 8px 12px;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  margin-bottom: 16px;
`;

export const SidebarContainer = styled.div.attrs((props) => ({
  style: {
	transform: props.$isOpen ? 'translateX(0)' : 'translateX(calc(100%))',
	width: props.$isOpen ? '288px' : '0',
	padding: props.$isOpen ? '32px' : '0',
	// marginLeft: props.$isOpen ? '0' : '24px',
  },
}))`
  height: 100%;
	float: right;
	margin-left: 24px;
	box-sizing: border-box;
  background: #fffcef;
  box-shadow: -2px 0 5px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  padding: 32px;
`;

export const ControlsContainer = styled.div`
	display: flex;
	gap: 16px;
	flex-direction: column;
`;

export const SettingsHeader = styled.h3`
	margin: 0;
`;

export const Label = styled.label`
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
`;

export const Input = styled.input`
  margin: 5px;
  padding: 8px;
  width: 50px;
	border-width: 0 0 2px 0;
	border-color: #3814a5;
	background-color: transparent;
`;

export const ColorSet = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const ColorInput = styled.div`
  width: 50px;
  border: none;
	background-color: ${(props)=>props.title } ;
	width: 30px;
	height: 30px;
	cursor: pointer;
	border-radius:8px;
	box-shadow: inset 0 0 2px rgba(0,0,0,0.75);
`;

export const Button = styled.button`
  padding: 16px;
  cursor: pointer;
	color: #fffcef;
	background-color: #3814a5;
	border-radius: 8px;
	border: none;
`;

export const GridContainer = styled.div`
	${'' /* width: 100%; */}
	${'' /* float: left; */}
  display: grid;
  padding: ${(props) => props.$gap}px;
  background-color: ${(props) => props.$bgColor || '#101010'};
  grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
  gap: ${(props) => props.$gap}px;
`;

export const GridElement = styled.a`
	position: absolute;
	background-color: #000;
	padding: 8px;
	border-radius: 8px;
	opacity: 0;
	transition: opacity 0.1s ease-in-out;
`;

export const Img = styled.img`
	width: 100%;
`;

export const GridItemLinkCMS = styled(GridElement)`
	top: 4px;
	left: 4px;
	width: 30px;
	cursor: pointer;
`;

export const GridItemLinkHome = styled(GridElement)`
	bottom: 4px;
	left: 4px;
	width: 30px;
	cursor: pointer;
`;

export const GridItemText = styled(GridElement)`
	bottom: 4px;
	right: 4px;
	text-align: right;
	color: white;
	font-size: 12px;
	cursor: copy;
`;

export const GridItemContainer = styled.div`
	text-align: center;
	background-color: #4C4B48;
	background-image: url('${(props) => props.$imageUrl}');
	background-size: ${(props) => {
    if (props.$aspectRatio > 1) {
      return props.$orientation === 'landscape' ? 'cover' : 'contain';
    } else {
      return props.$orientation === 'landscape' ? 'contain' : 'cover';
    }
  }};
	background-position: center;
	height: calc((100vw / ${(props) => props.$columns}) / ${(props) => props.$aspectRatio});
	border-radius: ${(props) => props.$radius }px;
	position: relative;

	&:hover ${GridItemLinkHome}, &:hover ${GridItemLinkCMS}, &:hover ${GridItemText} {
		opacity: 1;
	}
`;

export const CopyFeedback = styled(GridElement)`
  bottom: 40px;
  right: 4px;
  color: #fff;
  font-size: 12px;
  pointer-events: none;
  animation: fadeInOut 2s forwards;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
`;
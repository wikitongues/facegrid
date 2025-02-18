import React, { useState } from "react";
import { GridItemContainer, GridItemLinkHome, GridItemLinkCMS, GridItemText, Img, CopyFeedback } from "./ThumbnailGrid.styled";

const GridItem = ({ $id, $columns, $radius, $orientation, $imageUrl, $identifier, onReroll, aspectRatio, onCopy }) => {
	const airtableRecordUrl = `https://airtable.com/${process.env.REACT_APP_AIRTABLE_BASE_ID}/tblKP5UCG2Hj8ILKw/${$id}`;
  const [copied, setCopied] = useState(false);

	const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
			if (onCopy) onCopy(text);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

	return(
		<GridItemContainer key={$id}
			$imageUrl={$imageUrl}
			onClick={onReroll}
			title="Click to load a new thumbnail"
			$columns={$columns}
			$radius={$radius}
			$orientation={$orientation}
			$aspectRatio={aspectRatio}
			>
			<GridItemLinkHome
				href={`https://wikitongues.org/videos/${$identifier}`}
				onClick={(e) => e.stopPropagation()}
				title="Watch on Wikitongues.org"
				>
				<Img src="WT LogoMark-Wht.svg" alt="WT Logo" />
			</GridItemLinkHome>
			<GridItemLinkCMS
				href={airtableRecordUrl}
				onClick={(e) => e.stopPropagation()}
				title="Edit in Airtable"
				>
				<Img src="Airtable_logo 1.svg" alt="WT Logo" />
			</GridItemLinkCMS>
			<GridItemText
				title="Click to copy to clipboard"
				onClick={(e) => {
					e.stopPropagation()
					copyToClipboard($identifier);
					}}>
				{$identifier}
			</GridItemText>
			{copied && <CopyFeedback>Copied to clipboard!</CopyFeedback>}
		</GridItemContainer>
	)
};

export default GridItem;

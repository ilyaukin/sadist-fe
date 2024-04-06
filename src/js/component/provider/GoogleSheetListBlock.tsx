import React, { ReactNode } from 'react';
import Block from '../common/Block';

interface GoogleSheetLIstBlockProps {
  children: ReactNode;
}

const GoogleSheetListBlock = ({ children }: GoogleSheetLIstBlockProps) => {
  return <Block className="block google-sheet-list-block">
    {children}
  </Block>
}

export default GoogleSheetListBlock;

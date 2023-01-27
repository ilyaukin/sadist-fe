import React, { ReactNode } from 'react';

interface GoogleSheetLIstBlockProps {
  children: ReactNode;
}

const GoogleSheetListBlock = ({ children }: GoogleSheetLIstBlockProps) => {
  return <div className="google-sheet-list-block">
    {children}
  </div>
}

export default GoogleSheetListBlock;

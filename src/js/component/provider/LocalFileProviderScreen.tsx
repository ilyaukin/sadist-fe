import React from 'react';

interface LocalFileProviderScreenProps {
  fileError?: string;

  setFile(file: File): void;
}

export default function (props: LocalFileProviderScreenProps) {
  const { fileError, setFile } = props;

  function onChangeFile(this: any) {
    setFile(this.input.files[0]);
  }
  
  return <>
    <label htmlFor="source-file">File:</label><br/>
    <wired-input
        type="file"
        id="source-file"
        style={{ width: '100%' }}
        onchange={onChangeFile}
    >
    </wired-input>
    {!fileError && <span className="comment" style={{ color: 'magenta' }}>*.csv, *.xls, *.xlsx</span>}
    {fileError && <span className="field-error">{fileError}</span>}
  </>;
}
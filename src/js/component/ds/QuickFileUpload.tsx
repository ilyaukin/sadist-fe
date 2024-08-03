import React from 'react';
import Block from '../common/Block';
import ErrorDialog from '../common/ErrorDialog';
import Loader from '../common/Loader';
import LocalFileProvider from '../provider/LocalFileProvider';
import { createDs } from '../../helper/data-helper';
import { DsMeta } from '../../model/ds';

interface QuickFileUploadProps extends React.HTMLProps<HTMLDivElement> {
  onDsCreated(item: DsMeta): any;
}

interface QuickFileUploadState {
  loading: boolean;
}

/**
 * shortcut to drag&drop file
 * @param props
 * @constructor
 */
const QuickFileUpload = (props: QuickFileUploadProps) => {
  const { onDsCreated } = props;
  const [state, setState] = React.useState<QuickFileUploadState>({ loading: false });

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setState({ ...state, loading: true });
    const provider = new LocalFileProvider({});
    provider.setFile(e.dataTransfer.files[0]);
    provider.loadCSV()
        .then(createDs)
        .then(onDsCreated)
        .catch((e) => {
          ErrorDialog.raise(e.toString());
        })
        .finally(() => {
          setState({ ...state, loading: false });
        });
  };
  return <Block
      className="block quick-file-upload"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
  >
    <Loader loading={state.loading}/>
    {props.children}
  </Block>
}

export default QuickFileUpload;

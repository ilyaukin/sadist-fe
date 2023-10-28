import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '../../css/index.scss';
import './common/CustomElement';
import UserContextProvider from './user/UserContextProvider';
import SPAContent from './SPAContent';
import { renderPage } from '../helper/react-helper';

const SPA = () => {
  return <BrowserRouter>
    <UserContextProvider>
      <SPAContent/>
    </UserContextProvider>
  </BrowserRouter>;
};

export default SPA;

renderPage(<SPA/>);

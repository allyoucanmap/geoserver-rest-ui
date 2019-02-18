/* copyright 2019, stefano bovio @allyoucanmap. */

import React from 'react';
import Container from './components/Container';
import Auth from './components/Auth';
import List from './components/List';
import Tree from './components/Tree';
import MapCanvas from './components/MapCanvas';
import BackgroundColor from './components/BackgroundColor';
import Options from './components/Options';
import LayersList from './components/LayersList';
import StylesList from './components/StylesList';
import Loader from './components/Loader';
import Logo from './components/Logo';

const App = () => (
    <Container
        className="geoserver-rest-ui"
        header={[
            <Auth key="auth"/>,
            <Loader key="loader"/>
        ]}
        background={
            <MapCanvas />
        }
        footer={[
            <BackgroundColor key="background-color"/>,
            <Options key="options"/>,
            <LayersList key="layers-list"/>,
            <StylesList key="styles-list"/>
        ]}>
        <Logo />
        <Tree />
        <List />
    </Container>
);

export default App;

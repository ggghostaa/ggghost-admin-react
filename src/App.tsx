import React from 'react';
import './App.css';
import Vertify from "./components/vertiry/vertify";
import {Button, message} from "antd";


function App() {
    const a1 = () => {
        message.error('登录异常')
    }

    return (
        <div className="App">
            <Vertify></Vertify>
        </div>
    );
}

export default App;

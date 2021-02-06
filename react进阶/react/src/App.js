import './App.css';
import Context from "./context/class-context"
import Hoc from "./hoc/hocPage"
import Redux from "./redux/reduxPage"
import React, { Component } from "react"
import FormPage from "./form/formPage"
import DialogPage from "./dialog/dialogPage"
import ReactReduxPage from './react-redux/react-reduxPage';
import RouterPage from './react-router/react-routerPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>context</h1>
        <Context></Context>
        <Hoc></Hoc>
        <Redux></Redux>
        <FormPage></FormPage>
        <DialogPage></DialogPage>
        <ReactReduxPage></ReactReduxPage>
        <RouterPage></RouterPage>
      </div>
    )
  };
}

export default App;

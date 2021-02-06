import React,{Component} from "react"
import {createBrowserHistory} from "history"
import Router from "./myRouter"


export default class BrowserRouter extends Component{
    constructor(props){
        super(props)
        this.history=createBrowserHistory()//history.push(stateobj,title,url?)
    }
    render(){
        return <Router history={this.history} children={this.props.children}></Router>
    }
}
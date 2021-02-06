import React,{Component} from "react"
import {createPortal}  from "react-dom"
export default class DialogPage extends Component{
    constructor(props){
        super(props)
        this.state={
            showDialog:false
        }
        const doc=window.document
        this.node=doc.createElement("div")
        doc.body.appendChild(this.node)
    }
    componentWillUnmount(){
        if(this.node){
            window.document.body.removeChild(this.node)
        }
    }
    render(){
        const {showDialog}=this.state
        return(
            <div>
                <h3>DialogPage</h3>
                <button onClick={()=>{
                    this.setState({showDialog:!showDialog})
                }}>toggle</button>
                {showDialog ? createPortal(<div>Dialog show</div>,this.node) :null}
            </div>
        )
    }
}
import React from "react"
import { connect } from "dva"


export default connect(({ user }) => ({ state: user }))(
    function Userpage(props) {
        console.log("userpage", props)
        return (
            <div>
                <h3>UserPage</h3>
                <h5>{props.state.name}</h5>
            </div>
        )
    }
)
/**
 * Created by Home PC on 16.06.2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'

export default function(ComposedComponent) {
    class Authenticate extends React.Component {

        render() {
            const {isAuthenticated} = this.props.auth
            return (
                <div>
                    { isAuthenticated ? <ComposedComponent {...this.props} /> : <Redirect to="/login"/> }
                </div>


            );
        }
    }

    function mapStateToProps(state) {
        return {
            auth: state.auth
        };
    }

    return connect(mapStateToProps)(Authenticate);
}
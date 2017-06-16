/**
 * Created by Home PC on 16.06.2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'

export default function(ComposedComponent) {
    class userAuthenticate extends React.Component {

        render() {
            const {isAuthenticated} = this.props.auth
            return (
                <div>
                    { !isAuthenticated ? <ComposedComponent {...this.props} /> : <Redirect to="/news"/> }
                </div>


            );
        }
    }

    function mapStateToProps(state) {
        return {
            auth: state.auth
        };
    }

    return connect(mapStateToProps)(userAuthenticate);
}
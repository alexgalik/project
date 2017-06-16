/**
 * Created by Home PC on 15.06.2017.
 */
import {SET_CURRENT_USER} from '../actions/action'
import isEmpty from 'lodash/isEmpty'
const initialState = {
    isAuthenticated: false,
    user: {}
};

export default (state = initialState, action={}) => {
    switch (action.type){
        case SET_CURRENT_USER:
            return {
                isAuthenticated: !isEmpty(action.user),
                user: action.user
            }
        default: return state
    }
}
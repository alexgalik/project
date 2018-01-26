import {SET_NEWS, NEWS_FETCHED, NEWS_DELETED} from '../actions/action'

export default function news(state=[], action = {}){
    switch(action.type){
        case SET_NEWS:
            return action.news

        case NEWS_DELETED:
           return state.filter(item => item.news_id !== action.newsId);

        case NEWS_FETCHED:
            const index = state.findIndex(item => item.news_id == action.payload.news_id);
            if (index > -1){
                return state.map(item => {
                    if(item.news_id == action.payload.news_id) return action.payload[0];
                    return item[0];
                });
            } else{
                return [
                    ...state,
                    action.payload[0]
                ]
            }
        default: return state
    }
}
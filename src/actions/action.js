import setAuthorizationToken from "../utils/setAuthorizationToken"
import jwtDecode from 'jwt-decode'

export const SET_NEWS = 'SET_NEWS';
export const NEWS_FETCHED = 'NEWS_FETCHED';
export const NEWS_UPDATED = 'NEWS_UPDATED';
export const NEWS_DELETED = 'NEWS_DELETED';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}

function handleResponse(response) {
	if(response.ok){
		return response;
	}else {
		let error = new Error(response.statusText);
		error.response = response;
		console.log(error);
		throw error;
	}
}

export function setNews(news) {
    return {
        type: SET_NEWS,
        news
    }
}

export function newsFetched(payload) {
    return {
        type: NEWS_FETCHED,
        payload
    }
}

function handleResponseLogin(response) {
    if(response.ok){
        localStorage.setItem('font', 'Helvetica');
        return response;
    }else {
        let error = {error: ""+response.statusText+". Uncorrect name or password"};
        console.log(error);
        throw error;
    }
}


export function newsDeleted(newsId) {
    return{
        type: NEWS_DELETED,
        newsId
    }
}

export function newsUpdate(updatedNews) {
	return{
		type: NEWS_UPDATED,
		updatedNews
	}
}

export function newsDelete(id) {
    return dispatch => {
        return fetch(`/api/news/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
            .then(data => dispatch(newsDeleted(id)))
    }
}

export function updateNews(data) {
	return dispatch => {
        return fetch(`/api/news/${data.news_id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
	}
}

export function saveNews(data) {
    return dispatch => {
        return fetch('/api/news', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse);
    }
}


export function fetchNews() {
    return dispatch => {
        fetch('/api/news')
            .then(res => res.json())
            .then(data => dispatch(setNews(data.rows)));
    }
}

export function fetchOneNews(id) {
    return dispatch => {
        fetch(`/api/games/${id}`)
            .then(res => res.json())
            .then(data => dispatch(newsFetched(data)));
    }
}

export function login(data) {
    return dispatch => {
        return fetch('/api/auth', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponseLogin)
            .then(response => {
                response.json().then(({token}) => {
                    localStorage.setItem('jwtToken', token);
                    setAuthorizationToken(token);
                    dispatch(setCurrentUser(jwtDecode(token)));
                });
            })
    }
}

export function logout() {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}
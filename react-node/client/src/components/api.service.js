import {API_HOST} from './config';
import axios from 'axios';

export function securefetch(url){
	globalState.setData({isLoading: true})
	return new Promise((resolve, reject)=>{
		axios.get(API_HOST + url).then((response)=>{
			globalState.setData({isLoading: false})
			resolve(response)
		}).catch((err)=>{
			globalState.setData({isLoading: false})
			reject(response)
		})
	})
}

export function securePost(url, body){
	globalState.setData({isLoading: true})
	return new Promise((resolve, reject)=>{
		axios.post(API_HOST + url , body).then((response)=>{
			globalState.setData({isLoading: false})
			resolve(response)
		}).catch((err)=>{
			globalState.setData({isLoading: false})
			reject(response)
		})
	})
}


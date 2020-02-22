import {API_HOST} from './config';
import axios from 'axios';

export function secureFetch(path){
return axios.get(API_HOST + path);

}

export function securePost(url, body){

    try{

        return axios.post(API_HOST + url , body);
    }catch(err){
        console.error(err);
    }
}


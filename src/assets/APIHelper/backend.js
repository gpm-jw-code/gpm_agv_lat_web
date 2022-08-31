import axios from 'axios';
export var HostUrl= 'https://localhost:7279';
axios.defaults.baseURL = HostUrl

/**取得AGVC狀態 */
 export async function GetAGVCStates(){
    return await GetReq('/api/agvc/states');
 } 


 export async function GetAGVSSetting(){
    return await GetReq('/api/agvs/settings');
 }

 export async function GetAGVCTypes(){
    return await GetReq('/api/agvc/AgvTypes');
 }

 async function GetReq(api){
    var ret= await axios.get(api);
    return ret.data;
 }
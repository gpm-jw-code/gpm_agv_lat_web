import axios from 'axios';
export var HostUrl = 'http://localhost:5123';

axios.defaults.baseURL = HostUrl


export async function GetAGVCList() {
   return await GetReq('/api/agvc/list');
}

/**取得AGVC狀態 */
export async function GetAGVCStates() {
   return await GetReq('/api/agvc/states');
}

export async function GetAGVCStateByID(agvc_id) {
   return await GetReq(`/api/agvc/state?agvc_id=${agvc_id}`);
}

export async function GetAGVSSetting() {
   return await GetReq('/api/agvs/settings');
}

export async function GetAGVCTypes() {
   return await GetReq('/api/agvc/AgvTypes');
}

export async function GetOrderList() {
   return await GetReq('/api/Orders');
}

export async function GetAGVCNativeDatas(eqName) {
   return await GetReq(`/api/agvc/GetNativeData?eqName=${eqName}`);
}


export async function GetMapInfos() {
   return await GetReq(`/api/Map/GetMapInfos`);
}

export async function CancelNavigating(EqName) {

}

export async function OnlineStateSwitch(eqName, onlineState, currentStation) {
   var ret = await axios.post(`/api/AGVC/OnlineStateSwitch?eqName=${eqName}&onlineMode=${onlineState}&currentStation=${currentStation}`);
   return ret.data;
}


async function GetReq(api) {
   var ret = await axios.get(api);
   return ret.data;
}
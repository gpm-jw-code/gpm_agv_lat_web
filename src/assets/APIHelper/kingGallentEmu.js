import axios from 'axios'
var axios_instance = axios.create({ baseURL: "http://127.0.0.1:5000/api/KingGallentAGVSEmulator" })

const AGVC_RESET_API_PATH = "/AGVSReset_without_SID"
const CREATE_ORDER_TASK_LINK_API_PATH = "/CreateOrderTaskLink"
export async function AGVC_REST(EqName) {
    var res = await axios_instance.get(`${AGVC_RESET_API_PATH}?EQName=${EqName}&resetMode=0`);
    return res.data;
}

export async function CreateOrderTaskLink(SID, EqName, data) {
    var res = await axios_instance.post(`${CREATE_ORDER_TASK_LINK_API_PATH}?SID=${SID}&EQName=${EqName}`, data);
    return res;
}

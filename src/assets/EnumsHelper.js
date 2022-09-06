/** */

/**取得AGVC類型 */
export function GetAGVCTypeName(enum_int) {
    if (enum_int == 0)
        return 'GPM推高機'
    else if (enum_int == 1)
        return '罡豪潛遁'
    else
        return 'Unknown'
}

/**取得AGVS類型 */
export function GetAGVSTypeName(enum_int) {
    if (enum_int == 0)
        return 'GPM'
    else if (enum_int == 1)
        return "晶潔能AGVS";
    else
        return 'Unknown';
}


export function GetConnectionStateName(enum_int) {
    //CONNECTED, CONNECTING, DISCONNECT
    if (enum_int == 0)
        return 'Connected'
    else if (enum_int == 1)
        return 'Connecting'
    else
        return 'Disconnect'
}

export function GetRunningStateName(enum_int) {
    //CONNECTED, CONNECTING, DISCONNECT
    if (enum_int == 0)
        return 'Idle'
    else
        return 'Running'
}

export function GetOrderStateName(enum_int) {
    if (enum_int == 0)
        return 'WAIT_EXECUTE'
    else if (enum_int == 1)
        return 'EXECUTING'
    else if (enum_int == 2)
        return 'COMPLETE'
    else if (enum_int == 3)
        return 'STOPPED'
    else if (enum_int == 4)
        return 'FAILED'
    else if (enum_int == 5)
        return 'ERROR'
    else
        return 'Unknown';
}
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";


//定义响应返回回类型
interface Result {
    code: number,
    msg: string
}

interface ResultData<T = any> extends Result {
    data?: T
}

const URL: string = ''

enum RequestEnums {
    TIMEOUT = 20000, //超时时间
    VOERDUE = 600, //登录失效
    FAIL = 999, //请求失败
    SUCCESS = 200, //请求成功
}

const config = {
    //默认地址
    baseURL: URL as string,
    //设置超时时间
    timeout: RequestEnums.TIMEOUT as number,
    //跨域允许携带凭证
    withCredentials: true
}

class RequestHttp {
    service: AxiosInstance;

    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config);

        // /**
        //  * 请求拦截器
        //  * 客户端发送请求 -> [请求拦截器] -> 服务器
        //  * token校验(JWT) : 接受服务器返回的token,存储本地存储中
        //  */
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                const token = localStorage.getItem('token') || '';
                return {
                    ...config,
                    headers: {
                        'x-access-token': token
                    }
                }
            },
            (error: AxiosError) => {
                Promise.reject(error);
            }
        );

        /**
         * 响应拦截器
         * 服务器响应信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const {data, config} = response;
                //登录信息失效，应跳转等登录界面
                if (data.code === RequestEnums.VOERDUE) {
                    localStorage.setItem('token', '');
                    return Promise.reject(data);
                }
                //全局错误信息拦截（防止下载文件放回数据流，没有code，直接报错）
                if (data.code && data.code !== RequestEnums.SUCCESS) {
                    //antd全局消息通知
                    console.log("非法数据")
                    return Promise.reject(data)
                }
                return data;
            },
            (error: AxiosError) => {
                const {response} = error;
                if (response) {
                    this.handleCode(response.status);
                }
                if (!window.navigator.onLine) {
                    console.log('网络连接失败')
                }
            }
        )



    }

    /**
     * 异常处理
     * @param code
     * @private
     */
    private handleCode(code: number) {
        switch (code) {
            case 400:
                console.log("请求错误(400)");
                break;
            case 401:
                console.log("未授权，请重新登录(401)");
                break;
            case 403:
                console.log("拒绝访问(403)");
                break;
            case 404:
                console.log("请求出错(404)");
                break;
            case 408:
                console.log("请求超时(408)");
                break;
            case 500:
                console.log("服务器错误(500)");
                break;
            case 501:
                console.log("服务未实现(501)");
                break;
            case 502:
                console.log("网络错误(502)");
                break;
            case 503:
                console.log("服务不可用(503)");
                break;
            case 504:
                console.log("网络超时(504)");
                break;
            case 505:
                console.log("HTTP版本不受支持(505)");
                break;
            default:
                console.log(`连接出错(${code})!`);
                break;
        }
    }

    /**
     * get请求
     * @param url
     * @param params
     */
    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, { params });
    }

    /**
     * get请求
     * @param url
     * @param params
     */
    post<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, { params });
    }

    /**
     * put请求
     * @param url
     * @param params
     */
    put<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.put(url, { params });
    }

    /**
     * delete请求
     * @param url
     * @param params
     */
    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.delete(url, { params });
    }

}

export default new RequestHttp(config);
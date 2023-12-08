import logger, { LogType } from '../logger';

class HTTP {
    private GET: HTTPType = HTTPType.GET;
    private POST: HTTPType = HTTPType.POST;
    private PUT: HTTPType = HTTPType.PUT;
    private DELETE: HTTPType = HTTPType.DELETE;
    private PATCH: HTTPType = HTTPType.PATCH;
    private _HTTPDONE: HTTPType = HTTPType._HTTPDONE;
    private _HTTPERROR: HTTPType = HTTPType._HTTPERROR;

    public getRequestType(req: Request): HTTPType | undefined {
        const method: string = req.method;

        switch (method) {
            case 'GET': {
                return this.GET;
            }
            case 'POST': {
                return this.POST;
            }
            case 'PUT': {
                return this.PUT;
            }
            case 'DELETE': {
                return this.DELETE;
            }
            case 'PATCH': {
                return this.PATCH;
            }
        }
    }

    public httpCompleted(
        req: Request,
        method: string,
        httpCode: string
    ): boolean {
        logger.log(LogType.HTTP, this.getIP(req));
        return true;
    }

    /**
     *
     * @param req Type of Request, putting as any to avoid TS type warnings
     */
    public getIP(req: any): string {
        const ip: string =
            req?.headers['x-forwarded-for'] || req?.socket.remoteAddress;
        return ip;
    }
}

enum HTTPType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    _HTTPDONE = 'HTTPDONE',
    _HTTPERROR = 'HTTPERROR',
}

export default new HTTP();
export { HTTPType, HTTP };

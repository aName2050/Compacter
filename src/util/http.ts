import { Request } from 'express';
import { HTTPType } from '../types/http';

class HTTP {
	private GET: HTTPType = HTTPType.GET;
	private POST: HTTPType = HTTPType.POST;
	private PUT: HTTPType = HTTPType.PUT;
	private DELETE: HTTPType = HTTPType.DELETE;
	private PATCH: HTTPType = HTTPType.PATCH;
	private _HTTPDONE: HTTPType = HTTPType._HTTPDONE;
	private _HTTPERROR: HTTPType = HTTPType._HTTPERROR;

	public getIP(req: any): string {
		const ip: string =
			req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		return ip;
	}
}

export default new HTTP();
export { HTTP };

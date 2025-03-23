import { Request } from 'express';
import { HTTPType } from '../types/http';
import logger from './log';
import { LogType } from '../types/log';

class HTTP {
	private GET: HTTPType = HTTPType.GET;
	private POST: HTTPType = HTTPType.POST;
	private PUT: HTTPType = HTTPType.PUT;
	private DELETE: HTTPType = HTTPType.DELETE;
	private PATCH: HTTPType = HTTPType.PATCH;
	private _HTTPDONE: HTTPType = HTTPType._HTTPDONE;
	private _HTTPERROR: HTTPType = HTTPType._HTTPERROR;

	public httpCompleted(req: Request, method: string, code: string): boolean {
		logger.log(req, LogType.HTTP, `${code} ${method} ${req.url}`);
		return true;
	}

	/**
	 *
	 * @param req Request object
	 * @returns IP Address
	 */
	public getIP(req: Request): string {
		const ip: string = (req.headers['x-forwarded-for'] ||
			req.socket.remoteAddress) as string;
		return ip;
	}
}

export default new HTTP();
export { HTTP };

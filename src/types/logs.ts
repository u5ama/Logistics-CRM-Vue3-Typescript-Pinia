import type { HTTPMethod } from "@app-types/http";
import type { IApiObject } from "./api";

/**
 * Interface for the `logs` returned by the backend API
 *
 */
export interface ILog extends IApiObject {
  subject: string;
  url: string;
  method: HTTPMethod;
  ip: string;
  agent: string;
  username: number;
}

import { Log } from "./log";
export declare class LogFacade implements Log {
    log(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}

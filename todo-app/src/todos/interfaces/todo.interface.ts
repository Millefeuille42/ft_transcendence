import { SpawnSyncOptionsWithStringEncoding } from "child_process";

export interface Todo {
    id: number;
    title: string;
    done: boolean;
    description?: string;
}
import {Readable} from 'stream';
import {Artifact} from '../artifact/artifact';
import {createReadStream, existsSync, readFileSync} from "fs";
import {homedir} from "os";
import {CoreOptions, get} from "request";
import {join} from "path";
import {mapIfPresent} from "../utils/utils";

export interface Repository {
    exists(artifact: Artifact): Promise<boolean>

    download(artifact: Artifact): Promise<Readable>
}

export class LocalRepository implements Repository {

    private readonly rootPath: string;

    constructor(path: string) {
        this.rootPath = this.replaceHomeDirectory(path);
    }

    exists(artifact: Artifact): Promise<boolean> {
        return new Promise(resolve => {
            const artifactPath = join(this.rootPath, artifact.uri);
            resolve(existsSync(artifactPath));
        });
    }

    download(artifact: Artifact): Promise<Readable> {
        return new Promise(resolve => {
            const artifactPath = join(this.rootPath, artifact.uri);
            resolve(createReadStream(artifactPath));
        });
    }

    toString(): string {
        return this.rootPath;
    }

    private replaceHomeDirectory(path: string): string {
        return path.startsWith('~') ? path.replace('~', homedir()) : path;
    }
}

export interface RemoteRepositoryOptions {
    baseUrl: string,
    auth?: {
        username: string,
        password: string,
    },
    ssl?: {
        caPath?: string,
        certPath?: string,
        keyPath?: string,
        pfxPath?: string,
        passphrase?: string
    }
}

export class RemoteRepository implements Repository {

    constructor(private options: RemoteRepositoryOptions) {
    }

    exists(artifact: Artifact): Promise<boolean> {
        return new Promise((resolve) => {
            get(artifact.uri, this.createRequestOptions(this.options))
                .on('error', () => resolve(false))
                .on('response', response => resolve(response.statusCode == 200));
        });
    }

    download(artifact: Artifact): Promise<Readable> {
        return new Promise((resolve, reject) => {
            get(artifact.uri, this.createRequestOptions(this.options))
                .on('error', error => reject(error))
                .on('response', response => resolve(response));
        });
    }

    toString(): string {
        return this.options.baseUrl;
    }

    private createRequestOptions(options: RemoteRepositoryOptions): CoreOptions {
        return {
            baseUrl: options.baseUrl,
            auth: options.auth,
            agentOptions: mapIfPresent(options.ssl, options => ({
                ca: mapIfPresent(options.caPath, readFileSync),
                cert: mapIfPresent(options.certPath, readFileSync),
                key: mapIfPresent(options.keyPath, readFileSync),
                pfx: mapIfPresent(options.pfxPath, readFileSync),
                passphrase: options.passphrase
            }))
        };
    }
}
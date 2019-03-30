import {Artifact} from "../artifact/artifact";
import {LocalRepository, RemoteRepository, Repository} from "./repository";
import {Readable} from "stream";

export interface RepositoryManagerOptions {
    offlineMode?: boolean,
    localRepository?: LocalRepository
    remoteRepositories?: RemoteRepository[]
}

export class RepositoryManager {

    private static DEFAULT_OPTIONS: Partial<RepositoryManagerOptions> = {
        offlineMode: false,
        localRepository: new LocalRepository('~/.m2/repository/'),
        remoteRepositories: [new RemoteRepository({
            baseUrl: 'http://central.maven.org/maven2/'
        })]
    };

    private readonly repositories: Repository[] = [];

    constructor(options: RepositoryManagerOptions = {}) {
        const optionsWithDefaults = {...RepositoryManager.DEFAULT_OPTIONS, ...options};
        this.repositories = optionsWithDefaults.offlineMode
            ? [optionsWithDefaults.localRepository]
            : [optionsWithDefaults.localRepository, ...optionsWithDefaults.remoteRepositories]
    }

    async download(artifact: Artifact): Promise<Readable> {
        return this.findRepositoryContainingArtifact(artifact)
            .then(repository => repository.download(artifact));
    }

    private async findRepositoryContainingArtifact(artifact: Artifact): Promise<Repository> {
        return new Promise(async (resolve, reject) => {
            for (const repository of this.repositories) {
                if (await repository.exists(artifact)) {
                    resolve(repository);
                }
            }
            reject(`${artifact} could not be found in any of the declared repositories: [${this.repositories}]`);
        });
    }
}
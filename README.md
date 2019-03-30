## Installation

```sh
npm install maven-repository-manager
```

## RepositoryManager

The main entrypoint of this library is the `RepositoryManager` class. It provides a `download` method to retrieve artifacts from a local or remote repository. 

### Configuration

```typescript
export interface RepositoryManagerOptions {
    offlineMode?: boolean,
    localRepository?: LocalRepository
    remoteRepositories?: RemoteRepository[]
}
```

#### Offline mode

Specifies whether only the local repository will be used when downloading artifacts.

#### Local repository

Specifies the local maven repository to use when downloading artifacts. The local repository is always queried before the remote repositories. 
It will default to `~/.m2/repository/` when omitted.

#### Remote repositories

Specifies a list of remote maven repositories to use when downloading artifacts. Extra configuration can be supplied by using the `RemoteRepositoryOptions` interface. 
It will default to the maven central repository when omitted.

### Usage

```js
const repositoryManager = new RepositoryManager();
const seleniumArtifact = Artifact.from('org.seleniumhq.selenium:selenium-java:1.0.0');

repositoryManager.download(seleniumArtifact)
    .then(readable => readable.pipe(createWriteStream('./selenium.jar')));
```
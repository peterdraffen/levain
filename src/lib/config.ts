import 'reflect-metadata'
import {injectable, Container} from 'inversify'

import Repository from './repository'
import ChainRepository from './repositories/chain'
import NullRepository from './repositories/null'
import FileSystemRepository from './repositories/fs'
import ShellExecAction from './actions/shellExec'
import Action from './action'

@injectable()
export default class Config {
  get repositoryChain(): Repository {
    return new ChainRepository([
      new FileSystemRepository('C:\\bndes-java-env.kit\\repo'),
      new FileSystemRepository('C:\\bndes-java-env.kit\\repo2'),
      new NullRepository()
    ])
  }

  resolveAction(name:string): Action|undefined {
    if (name == "shellExec") {
      return new ShellExecAction();
    }

    return undefined;
  }
}

export const container = new Container()
container.bind<Config>(Config).toSelf()

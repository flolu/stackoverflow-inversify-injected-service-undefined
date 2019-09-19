import 'reflect-metadata';
import { injectable, inject, Container, unmanaged } from 'inversify';

const container = new Container();

const registerProviders = (...providers: any[]) =>
  providers.forEach(provider => container.bind(provider.name).to(provider));

const getProvider = (provider): any => container.get(provider.name);

@injectable()
export class MessageBroker {
  start = () => console.log('init message broker');
}

@injectable()
export abstract class Repository {
  @inject(MessageBroker.name) private mb: MessageBroker;

  constructor(@unmanaged() protected readonly user: any) {}

  initialize = () => this.mb.start();
}

@injectable()
export class UserRepository extends Repository {
  constructor() {
    super({ user: 'some object' });
    this.initialize();
  }
}

registerProviders(UserRepository, Repository, MessageBroker);

const repo: UserRepository = getProvider(UserRepository);

I have a relatively simple setup with three classes. They inject each other with the help of `inversify`. But one of the classes is undefined although injecting it:

```typescript
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

  // this.mb is undefined
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
```

You can try it yourself. I've created a small GitHub repository: https://github.com/flolude/stackoverflow-inversify-injected-service-undefined

When running the script, I get this error:

```
/project/index.ts:22
  initialize = () => this.mb.start();
                             ^
TypeError: Cannot read property 'start' of undefined
    at UserRepository.Repository.initialize (/project/index.ts:22:30)
    at new UserRepository (/project/index.ts:29:10)
    at _createInstance (/project/node_modules/inversify/lib/resolution/instantiation.js:21:12)
    at Object.resolveInstance (/project/node_modules/inversify/lib/resolution/instantiation.js:41:18)
    at /project/node_modules/inversify/lib/resolution/resolver.js:72:42
    at Object.resolve (/project/node_modules/inversify/lib/resolution/resolver.js:96:12)
    at /project/node_modules/inversify/lib/container/container.js:319:37
    at Container._get (/project/node_modules/inversify/lib/container/container.js:310:44)
    at Container.get (/project/node_modules/inversify/lib/container/container.js:230:21)
    at getProvider (/project/index.ts:9:50)
```

P.S. I get pretty much the same error when compiling the code to Javascript

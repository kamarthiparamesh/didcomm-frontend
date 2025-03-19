export class ExampleDIDResolver {
  knownDids = [];

  constructor(knownDids) {
    this.knownDids = knownDids;
  }

  async resolve(did) {
    return (
      this.knownDids.find((ddoc) => ddoc.id === did) ||
      new Error("Did Document not found")
    );
  }
}

export class ExampleSecretsResolver {
  knownSecrets = [];

  constructor(knownSecrets) {
    this.knownSecrets = knownSecrets;
  }

  async get_secret(secretId) {
    return this.knownSecrets.find((secret) => secret.id === secretId) || null;
  }

  async find_secrets(secretIds) {
    return secretIds.filter(
      (id) =>
        this.knownSecrets.find((secret) => secret.id === id) ||
        new Error("Secrets not found")
    );
  }
}

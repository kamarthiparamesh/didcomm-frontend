import "./style.css";
import { Message } from "didcomm"; // Import `init` function
import users from "./users.json";
import { ExampleDIDResolver, ExampleSecretsResolver } from "./resolvers";

async function setupDIDComm() {
  const alice = users.find((u) => u.name === "alice");
  const bob = users.find((u) => u.name === "bob");
  let didResolver = new ExampleDIDResolver(users.map((u) => u.didDocument));
  let senderSecretsResolver = new ExampleSecretsResolver(alice.secrets);
  const recieverSecretsResolver = new ExampleSecretsResolver(bob.secrets);

  document.getElementById("sendMessage").addEventListener("click", async () => {
    // Create a DIDComm Message
    const message = {
      id: "1234567890",
      typ: "application/didcomm-plain+json",
      type: "http://example.com/protocols/lets_do_lunch/1.0/proposal",
      from: alice.did,
      to: [bob.did],
      created_time: 1516269022,
      expires_time: 1516385931,
      body: { messagespecificattribute: "and its value" },
    };

    //Just signed message (Ed25519)
    const { packedMsg, packedMetadata } = await messagePack(message, {
      didResolver,
      secretsResolver: senderSecretsResolver,
    });

    const { unpackedMsg: msg, unpackMetadata } = await messageUnpack({
      encryptedMsg: packedMsg,
      didResolver,
    });

    // //Just signed & encrypted message(X25519)
    const { packedMsg: encryptedMsg, packedMetadata: encryptMetadata } =
      await messagePack(message, {
        encrypted: true,
        didResolver,
        secretsResolver: senderSecretsResolver,
      });

    const { unpackedMsg: msg2, unpackMetadata: meta2 } = await messageUnpack({
      encryptedMsg,
      didResolver,
      secretsResolver: recieverSecretsResolver,
    });
  });
}

async function messagePack(message, options) {
  const msg = new Message(message);

  const [packedMsg, packedMetadata] = options.encrypted
    ? await msg.pack_encrypted(
        message.to[0], //to
        message.from, //from
        message.from, //sign_by
        options.didResolver, //did_resolver
        options.secretsResolver, //secrets_resolver
        {
          forward: false, // Forward wrapping is unsupported in current version
        }
      )
    : await msg.pack_signed(
        message.from, //sign_by
        options.didResolver, //did_resolver
        options.secretsResolver //secrets_resolver
      );

  const resp = { packedMsg, packedMetadata };
  console.log("messagePack: ", resp);
  return resp;
}

async function messageUnpack(params) {
  const [unpackedMsg, unpackMetadata] = await Message.unpack(
    params.encryptedMsg,
    params.didResolver,
    params.secretsResolver,
    {}
  );

  const resp = {
    unpackedMsg: unpackedMsg.as_value(),
    unpackMetadata,
  };
  console.log("messageUnpack: ", resp);
  return resp;
}

setupDIDComm();

"use strict";
const path = require("path");
const fs = require("fs");
const AppClient = require("uu_appg01_server").AppClient;
const Zip = require("uu_appg01_devkit/src/tools/zip");
const OidcToken = require("uu_appg01_devkit-common/src/scripts/oidc-token"); // no better way now

const METAMODEL_FLD_PATH = ["..", "app", "config", "metamodel"];
const ENVIRONMENT = "localhost";
const ENVIRONMENT_MAP = {
  localhost: {
    btBaseUri: "http://localhost:9090/uu-businessterritory-maing01/00000000000000000000000000000002",
    accessCode1: "Holly_Hudson",
    accessCode2: "Cq%iaz#9w-#z7C8yZlZoC$DsebIK2JGWyDK8lg8J7vLFSKXtYFt5tn3eI3WthZtI",
    oidcUri: "https://uuapp-dev.plus4u.net/uu-oidc-maing02/eca71064ecce44b0a25ce940eb8f053d/oidc",
  },
  dev: {
    btBaseUri: "https://uuapp.plus4u.net/uu-businessterritory-maing01/174331d8a9f3419abbb402b88e2286dd",
    loginByDevkit: true,
  },
  fat: {
    btBaseUri: "https://uuapp.plus4u.net/uu-businessterritory-maing01/b3448ae61885458393e9f5db29a3df3e/userGate",
    loginByDevkit: true,
  },
  uat: {
    btBaseUri: "https://uuapp.plus4u.net/uu-businessterritory-maing01/47c6054060494c3184ca1d9802eaaefc",
    loginByDevkit: true,
  },
};

// =======================================================================================

let config = ENVIRONMENT_MAP[ENVIRONMENT];
if (!config) throw "Incorrectly specified environment " + ENVIRONMENT;

async function getCmdClient() {
  let token;
  if (config.loginByDevkit) {
    token = await new OidcToken("..").get();
  } else {
    let getTokenUri = config.oidcUri + "/grantToken";
    let getTokenDtoIn = {
      grant_type: "password",
      username: config.accessCode1,
      password: config.accessCode2,
      scope: "openid " + config.btBaseUri,
    };
    let getTokenDtoOut = await AppClient.post(getTokenUri, getTokenDtoIn);
    token = getTokenDtoOut.data.token_type + " " + getTokenDtoOut.data.id_token;
  }

  return new AppClient({
    headers: { Authorization: token },
    baseUri: config.btBaseUri,
  });
}

async function getZipFile() {
  let mmdFldPath = path.resolve(...METAMODEL_FLD_PATH);
  if (!fs.existsSync(mmdFldPath)) {
    throw "Insomnia file was not found in path " + mmdFldPath;
  }
  let targetPath = path.resolve(mmdFldPath, "..", "metamodel.zip");
  process.chdir(path.resolve(mmdFldPath, ".."));
  await Zip(targetPath, (appPackage) => {
    appPackage.directory("metamodel", "metamodel");
  });
  return targetPath;
}

async function main() {
  let zipFile = await getZipFile();

  let btClient = await getCmdClient();

  let response = await btClient.post("installUuApp", { data: fs.createReadStream(zipFile) });

  console.log("Successfully installed metamodel.");
  console.log(response.data);
}

main();
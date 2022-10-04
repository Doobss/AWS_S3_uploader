const fsp = require('fs').promises;
const { SecretsManager, S3 } = require('aws-sdk');
const { secretMetaFileName } = require('./createSecrets/index')

// NOTE: no credentials entered because this should be called from within an
//       AWS instance with the proper IAM permissions. If so our credentials are
//       supplied by the instance itself
const manager = new SecretsManager();
const s3Client = new S3();






const uploadFiles = async (files) => {
  const secretMetaData = await getSecretMetaData()
  const secrets = await getSecrets(secretMetaData);
  // const { MY_SECRETS } = secrects; (hopefully)

}








const getSecrets = async (secretMetaData) => {
  // secretMetaData = secretMetaData || await getSecretMetaData();
  let getSecretError;
  try {
    if ( secretMetaData.SecretId ) {
      const { error, data } = await manager.getSecretValue(secretMetaData)
      if ( !error ) {
        return data;
      } else {
        getSecretError = error;
        throw new Error(`Error in data retrival by the manager.`)
      }
    } else {
      throw new Error(`SecretId is not defined, the manager will not find the secret data.`)
    }
  } catch ( error ) {
    getSecretError = error;
    console.log(`getSecrets ERROR: `, { secretMetaData, getSecretError });
    return {};
  }
}









const getSecretMetaData = async () => {
  try {
    const readFileRes = await fsp.readFile(`./createSecrets/${secretMetaFileName}`)
    if ( readFileRes ) {
      const parsedMeta = JSON.parse(readFileRes)
      const { ARN, Name, VersionId } = parsedMeta;
      const secretManagerMeta = {
        SecretId: ARN, /* required */
        VersionId: VersionId,
        ...parsedMeta,
      }
      return secretManagerMeta
    } else {
      throw new Error(`getSecretMeta readFile data error readFileRes = ${readFileRes}`);
    }
  }
  catch ( error ) {
    console.log(`COULD NOT FETCH SECRET META DATA`, { readFileError })
    return {}
  }
}
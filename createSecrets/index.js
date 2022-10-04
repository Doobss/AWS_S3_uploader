const fsp = require('fs').promises;
const { SecretsManager } = require('aws-sdk')
const credentials = require('./credentials')();
const { accessKeyId, secretAccessKey, sessionToken } = credentials;
console.log({ accessKeyId, secretAccessKey, sessionToken, credentials })

const manager = new SecretsManager(credentials);

const newSecrectKeyValues = {
  S3_BUCKET_NAME: `example secret`,
  S3_BUCKET_ARN: 'example secret',
  // ...other values to add
};

const newSecretName = 'The name of the secret'
const newSecretDescription = `Describe here`

const createSecretParams = {
  Description: newSecretDescription || '',
  Name: newSecretName,
  SecretString: JSON.stringify(newSecrectKeyValues),
 };

const createNewSecret = (secretParams = createSecretParams ) => {
  return manager.createSecret(secretParams)
    .then(awsRes => {
      console.log('No error ',  { awsRes })
      const { ARN, Name, VersionId } = awsRes;
      if ( (ARN && Name && VersionId ) ) {
        const written = JSON.stringify({ ARN, Name, VersionId });
        fsp.writeFile(written,  'secretMeta.json')
          .then(writeFileRes => console.log(`SECRET CREATED AND STORED`, { written, writeFileRes }))
          .catch(writeFileError => console.log(`SECRET CREATED BUT NOT STORED`, { written, writeFileError }))
      } else {
        console.log('ERROR in AWS createSecret Response, undefined data,', { ARN, Name, VersionId })
      }
    })
    .catch(awsErr =>  console.log('Error ',  { awsRes }))
}


module.exports = createNewSecret;






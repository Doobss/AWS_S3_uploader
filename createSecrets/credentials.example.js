const accessKeyId = ``,
const secretAccessKey = ``
const sessionToken = ``,

const credentialCheck = () => {
  if ( !((accessKeyId && secretAccessKey && sessionToken) || (accessKeyId.length && secretAccessKey.length && sessionToken.length)) ) {
    throw new Error(`ERROR in Credentials: { accessKeyId: ${accessKeyId}, secretAccessKey: ${secretAccessKey}, sessionToken: ${sessionToken} }`)
    return false;
  } else {
    console.log(`Credential check all good.`)
    return true;
  }
}

const credentials = Object.freeze({
  accessKeyId,
  secretAccessKey,
  sessionToken,
})

module.exports = () => {
  if (credentialCheck()) return credentials
  else return null;
};
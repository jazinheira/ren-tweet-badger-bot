const AWS = require("aws-sdk");

module.exports = (secretName = 'RBB', region = 'us-west-1') => {
	const secretsManager = new AWS.SecretsManager({ region });

	return new Promise((resolve, reject) => {
		secretsManager.getSecretValue({ SecretId: secretName }, (err, data) => {
			if (err) {
                console.log('[ERROR] There was an error getting secrets from AWS SecretsManager: ' + err.code);
				reject(err);
			} else {
                // Decrypts secret using the associated KMS CMK.
                // Depending on whether the secret is a string or binary, one of these fields will be populated.
                var secretsObj = new Object();
                if ('SecretString' in data) {
                    secretsObj = JSON.parse(data.SecretString);
                } else {
                    var buff = new Buffer(data.SecretBinary, 'base64');
                    secretsObj = JSON.parse(buff.toString('ascii'));
                }
				resolve(secretsObj);
			}
		});
	});
};

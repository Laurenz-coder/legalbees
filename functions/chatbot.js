exports.handler = function(event, context, callback) {
    console.log(event.queryStringParameters.boopee);
    callback(null,  {
		statusCode: 200,
		body: JSON.stringify({ message: 'hello' })
	});
}
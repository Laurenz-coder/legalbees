const { Configuration, OpenAIApi } = require( "openai");
const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
async function main() {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Hello world"}],
    });
    console.log(completion.data.choices[0].message);
}



exports.handler = async function(event, context, callback) {
    console.log(event.queryStringParameters.boopee);
	const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: "Hello world"}],
    });
    console.log(completion.data.choices[0].message);
    callback(null,  {
		statusCode: 200,
		body: JSON.stringify({ message: 'hello' })
	});
}
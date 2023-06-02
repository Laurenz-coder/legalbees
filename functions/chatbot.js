const { Configuration, OpenAIApi } = require( "openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);



exports.handler = async function(event, context, callback) {
	// return;
    console.log(event.queryStringParameters.question);
	const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: event.queryStringParameters.question}],
    });
    console.log(completion.data.choices[0].message);
    callback(null,  {
		statusCode: 200,
		body: JSON.stringify({ message: completion.data.choices[0].message.content })
	});
}
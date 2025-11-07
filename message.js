
const whatsAppClient = require('@green-api/whatsapp-api-client')

// instance manager https://console.green-api.com
const idInstance = '7103873612'; // your instance id
const apiTokenInstance = '35e150f62b3547689751a8e6aa205a2143863df6072f4176b0'; // your instance api token

const receiverPhoneNumber = '704435999';
const message = 'hello world';

// Send WhatsApp message
(async () => {
    const restAPI = whatsAppClient.restAPI(({
        idInstance,
        apiTokenInstance
    }))
    try {
        const response = await restAPI.message.sendMessage(`${receiverPhoneNumber}@c.us`, null,"hello world");
        console.log(response.idMessage)
    } catch (ex) {
        console.error(ex);
    }
})();

from whatsapp_api_client_python import API

greenAPI = API.GreenApi(
    "7103873612", "35e150f62b3547689751a8e6aa205a2143863df6072f4176b0"
)


def main():
    response = greenAPI.sending.sendMessage("704435999@c.us", "Message text")

    print(response.data)


if __name__ == '__main__':
    main()
from google import genai
from google.genai import types
import time
import os

# basic test
'''
#----------------------------------------------------------------#
# THE FOLLOWING CODE BLOCK IS A BASIC TEST TO GET GEMINI WORKING #
#                                                                #
# it sends a message and prints the contents all at once         #
#----------------------------------------------------------------#

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Describe all major releases in the Pikmin franchise. Include their release dates and a basic description. Do this in a few words."
)

print(response.text)
'''

# streamed response
'''
#--------------------------------------------------------------#
# THE CODE SEGMENT BELOW 'streams' THE RESPONSE FROM THE MODEL #
#                                                              #
# looks way smoother & is what the models use when talking w/  #
# them                                                         #
#--------------------------------------------------------------#

client = genai.Client()

response = client.models.generate_content_stream(
    model="gemini-3.5-flash",
    contents="Describe all major releases in the Pikmin franchise. Include their release dates and a basic description. Do this in a few words."
)

for chunk in response:
    print(chunk.text, end='', flush=True)
'''

# multi-turn conversation
'''
#------------------------------------#
# BELOW IS A MULTI-TURN CONVERSATION #
#------------------------------------#

client = genai.Client()

chat = client.chats.create(model="gemini-3.5-flash")

response1 = chat.send_message_stream("Describe all major releases in the Pikmin franchise. Include their release dates and a basic description. Do this in a few words.")

print("Response 1:")
for chunk in response1:
    print(chunk.text, end='', flush=True)


response2 = chat.send_message_stream("List the consoles each game appears on.")

print("\n\nResponse 2:")
for chunk in response2:
    print(chunk.text, end='', flush=True)

'''

# google search addition
'''
#-----------------------------------------#
# GOOGLE SEARCH CAN BE ADDED TO THE MODEL #
#-----------------------------------------#

client = genai.Client()

config = types.GenerateContentConfig(
    tools=[types.Tool(google_search=types.GoogleSearch())]
)

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="What game won game of the year in 2017? Do this in a few words.",
    config=config
)

print(response.text)

metadata = response.candidates[0].grounding_metadata
if metadata.web_search_queries:
    print("\n\nSearch queries executed:")
    for query in metadata.web_search_queries:
        print(f" - {query}")

if metadata.grounding_chunks:
    print("\n\nSources:")
    for chunk in metadata.grounding_chunks:
        print(f" - [{chunk.web.title}]({chunk.web.uri})")
'''

file_path = 'backend\\sample.png'

if os.path.exists(file_path):
    print("FOUND!")
    # raise FileNotFoundError
else:
    print("NOT FOUND")
    raise FileNotFoundError

client = genai.Client()

file_search_store = client.file_search_stores.create(
    config={
        'display_name': 'image_test',
        'embedding_model': 'models/gemini-embedding-2'
    }
)

operation = client.file_search_stores.upload_to_file_search_store(
    file=file_path,
    file_search_store_name=file_search_store.name,
    config={
        'display_name': 'display-file-name',
    }
)

while not operation.done:
    time.sleep(5)
    operation = client.operations.get(operation)

response = client.models.generate_content_stream(
    model="gemini-3.5-flash",
    contents="Could you describe the character in the image in a simple and short way?",
    config=types.GenerateContentConfig(
        tools=[
            types.Tool(
                file_search=types.FileSearch(
                    file_search_store_names=[file_search_store.name]
                )
            )
        ]
    )
)

for chunk in response:
    print(chunk.text, end='', flush=True)

delete_operation = client.file_search_stores.delete(
    name=file_search_store.name
)

while not delete_operation.done:
    time.sleep(5)
    delete_operation = client.operations.get(delete_operation)
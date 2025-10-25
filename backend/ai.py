from google import genai

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="Provide a list of the most popular RedBull drink flavors"
)

print(response.text)
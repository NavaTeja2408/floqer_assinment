from flask import Flask , jsonify , request
import os
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import LLMChain


app = Flask(__name__)

loader = CSVLoader(file_path="salaries.csv")
documents = loader.load()

api_key = os.getenv("OPENAI_API_KEY") 
if not api_key:
    raise ValueError("The environment variable OPENAI_API_KEY is missing.")

embeddings = OpenAIEmbeddings(openai_api_key=api_key)
db = FAISS.from_documents(documents, embeddings)


def retrieve_info(query):
    similar_response = db.similarity_search(query, k=3)

    page_contents_array = [doc.page_content for doc in similar_response]
    return page_contents_array


llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613" )

template = """
You are Customer support to the user where user asks a question and it's about the employment and salaries of a company.
I will share a question with you and I would like you to answer from the given data,
and you will follow ALL of the rules below:

1. Respond with a proper explanation of the question and give the data they ask for.
2. Either answer with related question or If data is not available, respond with an apology and state that the data is not available.

Below is a question I received from the prospect:
{message}

Here is a list of data which consists of the company's job and employment details:
{data}
"""

prompt = PromptTemplate(
    input_variables=["message", "data"],
    template=template
)

chain = LLMChain(llm=llm, prompt=prompt)


@app.route('/api/getchatdata' , methods = ["POST"])
def generate_response():
    message = request.json.get('message')
    data = retrieve_info(message)
    response = chain.run(message=message, data=data)
    return response


if __name__ == "__main__" :
    app.run(debug=True)
from llama_index.core.agent.legacy.react.base import ReActAgent
from llama_index.llms.openai import OpenAI
from tools.state_tool import all_tools
from tools.customer_tool import all_tools


import os
import psycopg2
import argparse

os.environ["OPENAI_API_KEY"] = "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"
llm = OpenAI(model="gpt-3.5-turbo")
agent = ReActAgent.from_tools(all_tools, llm=llm, verbose=True)


def get_db_connection():
    DB_HOST=os.getenv("DB_HOST")
    DB_PORT=os.getenv("DB_PORT")
    DB_NAME=os.getenv("DB_NAME")
    DB_USER=os.getenv("DB_USER")
    DB_PASSWORD=os.getenv("DB_PASSWORD")


    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

def execute_query(query):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        conn.commit()
        return "Query executed successfully"
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return "Error" + str(error)
    finally:
        cursor.close()
        conn.close()
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='CLI for CRUD operations')
    parser.add_argument('--query', type=str, help='SQL query to execute')

    args = parser.parse_args()
    if args.query:
        response = agent.chat(args.query)
        print(response)
    
    else:
        while True:
            user_input = input("Enter your SQL query(or exit to quit): ")
            if user_input.lower() == "exit":
                break
            response = agent.chat(user_input)
            print(response)
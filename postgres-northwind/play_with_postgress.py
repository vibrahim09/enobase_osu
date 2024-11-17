# Lang chain is using this to interact with the SQL database class allowing u to interact with the database using the OpenAI model
# create an agent that can interact with the DB
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_community.utilities import SQLDatabase


#from langchain_community.llms import OpenAI
from langchain_community.llms.openai import OpenAI
from langchain_openai import OpenAI
from langchain_community.chat_models import ChatOpenAI



#from langchain.sql_database import SQLDatabase
from langchain.agents import AgentExecutor
from langchain.agents.agent_types import AgentType

from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

#from langchain.chat_models import ChatOpenAI
llm = OpenAI()
#db = SQLDatabase.from_uri('sqlite:///chinook.db')
db = SQLDatabase.from_uri('postgresql://postgres:postgres@localhost:5432/northwind')
toolkit = SQLDatabaseToolkit(db=db, llm=llm)
#create an agent that can interact with the DB using the OpenAI model
agent_executor = create_sql_agent(
    llm=llm,
    toolkit=toolkit,
    verbose=True,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    return_full_text=True
)
print([tool.name for tool in toolkit.get_tools()])
#results=agent_executor.run("Describe the playlisttrack table")
#print(results)
#agent_executor.run("Describe the playlisttrack table ")
#The created agent can be used to run queries against the SQL Database
def run_llm_query(query, limit=100, offset=0):
    print(f"Running query: {query} with limit: {limit} and offset: {offset}")
    paginated_query = f"{query} LIMIT {limit} OFFSET {offset}"
    result = agent_executor.run(paginated_query)
    print(f"Query result: {result}")
    print(result)
    return query, result
def generate_table_from_prompt(prompt):
     response = agent_executor.run(prompt)
     lines = response.split("\n")
     headers = lines[0].split(",")
     data = [line.split("\t") for line in lines[1:] if line.strip()]

     return headers, data 



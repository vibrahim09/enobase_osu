
from dotenv import load_dotenv
import os
import psycopg2
from llama_index.core.tools import FunctionTool
from pydantic import Field

load_dotenv()
conn = psycopg2.connect(database = "northwind", 
                        user = os.environ['DB_USER'], 
                        host= 'localhost',
                        password = os.environ['DB_PASSWORD'],
                        port = 5432)


cursor = conn.cursor()
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

def read_states(properties=None) -> str:
    #tool to read the employees table
    try:
        cursor.execute("SELECT state_name FROM us_states")
        us_states= cursor.fetchall()
        return "States: " + ',' .join([state[0] for state in us_states])
    except (Exception, psycopg2.Error) as error:
        return "Error" + str(error)
        

    
def delete_states(properties=None) -> str:
    #tool to read the employees table
    try:
        state = properties.get("state")
        cursor.execute("DELETE FROM us_states where state_name = %s", (state,))
        conn.commit()
        return "Query executed successfully"
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return "Error" + str(error)



def insert_states (properties=None) -> str:
    #tool to read the employees table
    if properties is None:
        return "Error: properties cannot be None"
    state_name = properties.get("state_name")
    state_id = properties.get("state_id")
    state_abbrev = properties.get("state_abbrev")
    state_region = properties.get("state_region")
    if not state_name or not state_id or not state_abbrev or not state_region:
        return "Error: state_name cannot be None"
    conn= get_db_connection()
    cursor = conn.cursor()
    try:
        #state = properties.get("state")
        cursor.execute("INSERT INTO us_states (state_id,state_name,state_abbrev, state_region) VALUES (%s, %s, %s, %s)", (state_id, state_name,state_abbrev,state_region))
        conn.commit()
        return "Query executed successfully" 
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return "Error" + str(error)
    finally:
        cursor.close()
        conn.close()
    
def update_states(properties=None) -> str:
    #tool to read the employees table
    if properties is None:
        return "Error: properties cannot be None"
    state_name = properties.get("state_name")
    new_state_name = properties.get("new_state_name")
    if not state_name or not new_state_name:
        return "Error: state_name cannot be None"
    conn= get_db_connection()   
    cursor = conn.cursor()
    try:
       # query_sentence = f"Update the state name to '{new_state}' for the state with ID {state_id} in the `us_states` table."
        
        # Execute the update SQL query
        cursor.execute("UPDATE us_states SET state_name = %s WHERE state_name = %s", (new_state_name, state_name))
        #cursor.execute("UPDATE us_states SET state_name to '{new_state}' for the state  where state_id= %s", (new_state,state_id))
        conn.commit()
        return "Query executed successfully"
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return "Error" + str(error)
    finally:
        cursor.close()
        conn.close()




read_tool = FunctionTool.from_defaults(fn=read_states)
delete_tool = FunctionTool.from_defaults(fn=delete_states)
update_tool = FunctionTool.from_defaults(fn=update_states)
insert_tool = FunctionTool.from_defaults(fn=insert_states)
all_tools  = [ read_tool,delete_tool,update_tool,insert_tool]
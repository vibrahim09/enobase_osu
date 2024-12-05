
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

def read_customers(properties=None) -> str:
    #tool to read the employees table
    try:
        cursor.execute("SELECT contact_name FROM customers")
        customers = cursor.fetchall()
        return "Customers: " + ',' .join([customer[0] for customer in customers])
    except (Exception, psycopg2.Error) as error:
        return "Error" + str(error)
        
#delete doesnt work yet coz of limitations to foreign key constraints
    
def delete_customers(customer_id) -> str:
    #tool to read the employees table
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        #customer_name  = properties.get("contact_name")
        cursor.execute("DELETE FROM customers where customer_id = %s", (customer_id,))
        conn.commit()
        return "Query executed successfully"
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return "Error" + str(error)
    finally:
        cursor.close()
        conn.close()



def insert_customers (properties=None) -> str:
    #tool to read the employees table
    if properties is None:
        return "Error: properties cannot be None"
    customer_id = properties.get("customer_id")
    company_name = properties.get("company_name")
    contact_name = properties.get("contact_name")
    contact_title = properties.get("contact_title")
    address = properties.get("address")
    city = properties.get("city")
    region = properties.get("region")
    postal_code = properties.get("postal_code")
    country = properties.get("country") 
    phone = properties.get("phone")
    fax = properties.get("fax")

    if not customer_id or not company_name:
        return "Error: customer_id,  company_name must be provided"

    conn= get_db_connection()
    cursor = conn.cursor()
    try:
        #state = properties.get("state")
        cursor.execute("""
        INSERT INTO customers (customer_id,company_name,contact_name, contact_title, address, city, region, postal_code, country, phone, fax)
                      VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (customer_id, company_name, contact_name, contact_title,address, city, region, postal_code, country, phone, fax))
        conn.commit()
        return "Query executed successfully" 
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return f"Error: {str(error)}"

    finally:
        cursor.close()
        conn.close()
    
def update_customers(properties=None) -> str:
    #tool to read the employees table
    if properties is None:
        return "Error: properties cannot be None"
    company_name = properties.get("company_name")
    customer_id = properties.get("customer_id")
    contact_name = properties.get("contact_name")
   
    if not company_name or not customer_id or not contact_name:
        return "Error: company_name, customer_id, and contact_name must be provided"
    
    conn= get_db_connection()   
    cursor = conn.cursor()
    try:
       # query_sentence = f"Update the state name to '{new_state}' for the state with ID {state_id} in the `us_states` table."
        
        # Execute the update SQL query
        cursor.execute("UPDATE customers SET contact_name = %s WHERE customer_id = %s AND company_name = %s",(contact_name, customer_id, company_name))
        #cursor.execute("UPDATE us_states SET state_name to '{new_state}' for the state  where state_id= %s", (new_state,state_id))
        conn.commit()
        return "Query executed successfully"
    except (Exception, psycopg2.Error) as error:
        conn.rollback()
        return "Error" + str(error)
    finally:
        cursor.close()
        conn.close()



read_tool = FunctionTool.from_defaults(fn=read_customers)
delete_tool = FunctionTool.from_defaults(fn=delete_customers)
update_tool = FunctionTool.from_defaults(fn=update_customers)
insert_tool = FunctionTool.from_defaults(fn=insert_customers)
all_tools  = [ read_tool,delete_tool,update_tool,insert_tool]
#Insert a new customer with values (kiarr, MaryEnterprises, MaryKazi, Manager, 123 Main St, Springfield, IL, 62701, USA, 541248901, 501245902) into the customers table.
#Insert a new customer with values (kiarr, MaryEntelrprises, MaryKazi, Manager, 123 Main St, Springfield, IL, 62701, USA, 541248901, 501245902) into the customers table 
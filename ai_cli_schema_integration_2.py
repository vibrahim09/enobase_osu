from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import psycopg2
from sqlalchemy import create_engine
import os
import re
from dotenv import load_dotenv
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
import requests
import datetime

# Load environment variables from .env file
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database connection details
db_url = "postgresql+psycopg2://postgres:postgres@localhost:5432/northwind"
engine = create_engine(db_url)

# Load database schema
def parse_schema_from_file(file_path):
    schema = {}
    current_table = None

    with open(file_path, "r") as file:
        for line in file:
            line = line.strip()
            if line:
                if line.startswith("Table"):
                    current_table = line.split()[1].lower()
                    schema[current_table] = []
                elif line.startswith("-"):
                    column = line.split()[1].lower()
                    schema[current_table].append(column)

    return schema

schema_file_path = "northwind_schema.txt"
schema = parse_schema_from_file(schema_file_path)

prompt = PromptTemplate(
    input_variables=["question"],
    template = """
        You are a helpful assistant who can query the Northwind PostgreSQL database.
        Answer the question by first converting it into an SQL query, then execute the query and return the results.
        You must double-check the SQL query before executing it. If you get an error while executing the query, rewrite the query and try again.
        Ensure that any tables or columns in the query exist in the Northwind database.
        If you are unsure about the SQL syntax, you can ask for help.
        If an error related to a missing table or columns occurs, find the correct table or column name and rewrite the query.

        Database schema:
        Table: territories
        Columns: region_id, territory_id, territory_description

        Table: order_details
        Columns: order_id, product_id, unit_price, quantity, discount

        Table: employee_territories
        Columns: employee_id, territory_id

        Table: us_states
        Columns: state_id, state_name, state_abbr, state_region

        Table: customers
        Columns: customer_id, company_name, contact_name, contact_title, address, city, region, postal_code, country, phone, fax

        Table: orders
        Columns: order_id, employee_id, order_date, required_date, shipped_date, ship_via, freight, ship_country, customer_id, ship_name, ship_address, ship_city, ship_region, ship_postal_code

        Table: employees
        Columns: birth_date, photo, hire_date, reports_to, employee_id, address, city, region, postal_code, country, home_phone, extension, notes, photo_path, last_name, first_name, title, title_of_courtesy

        Table: shippers
        Columns: shipper_id, company_name, phone

        Table: products
        Columns: discontinued, reorder_level, product_id, supplier_id, category_id, unit_price, units_in_stock, units_on_order, product_name, quantity_per_unit

        Table: categories
        Columns: category_id, picture, category_name, description

        Table: suppliers
        Columns: supplier_id, company_name, contact_name, contact_title, address, city, region, postal_code, country, phone, fax, homepage

        Table: region
        Columns: region_id, region_description

        Table: customer_demographics
        Columns: customer_type_id, customer_desc

        Table: customer_customer_demo
        Columns: customer_id, customer_type_id
        
        
        Convert the following question into a valid SQL query using the schema above.
        Return only the SQL query and nothing else. Do not include explanations or results.

        Question: {question}
        SQL Query:
    """
)

llm = OpenAI(
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# Create query generation pipeline
query_generation = prompt | llm
# Validate SQL columns
def validate_sql_columns(sql_query, schema):
    table_pattern = re.compile(r'(\w+)\.')
    column_pattern = re.compile(r'(\w+)\."(\w+)"')

    tables_in_query = set(re.findall(table_pattern, sql_query))
    columns_in_query = set(re.findall(column_pattern, sql_query))

    invalid_tables = [table for table in tables_in_query if table not in schema]
    invalid_columns = [
        f"{table}.{column}"
        for table, column in columns_in_query
        if table in schema and column not in schema[table]
    ]

    return not (invalid_tables or invalid_columns)

# Execute SQL query
import json

def run_query(query):
    try:
        connection = psycopg2.connect(
            dbname="northwind", user="postgres", password="postgres", host="localhost", port="5432"
        )
        cursor = connection.cursor()
        cursor.execute(query)
        results = cursor.fetchall()

        # Retrieve column names from cursor
        column_names = [desc[0] for desc in cursor.description]

        # Format results with column names
        def format_value(value):
            if isinstance(value, memoryview):
                return "<binary data>"  # Replace binary data with a placeholder
            elif isinstance(value, (bytes, bytearray)):
                return value.decode('utf-8', 'ignore')  # Decode bytes to string
            elif isinstance(value, (datetime.date, datetime.datetime)):
                return value.isoformat()  # Format dates and datetimes as strings
            return value  # Return other types unchanged

        formatted_results = {
            f"result {i+1}": {
                column_names[j]: format_value(value) for j, value in enumerate(row)
            }
            for i, row in enumerate(results)
        }

        cursor.close()
        connection.close()

        return formatted_results
    except Exception as e:
        return {"error": str(e)}



def format_results_with_column_names(cursor, results):
    # Retrieve column names from the cursor description
    column_names = [desc[0] for desc in cursor.description]

    # Format the results using actual column names
    formatted_results = {
        f"#{i+1}": {column_names[j]: value for j, value in enumerate(row)}
        for i, row in enumerate(results)
    }

    return formatted_results

# Query endpoint
@app.route('/query', methods=['POST'])
def query_endpoint():
    data = request.json
    user_input = data.get('question')

    if not user_input:
        return jsonify({"error": "No question provided"}), 400

    max_retries = 3
    retry_count = 0
    sql_query = None

    while retry_count < max_retries:
        try:
            # Generate the prompt string
            prompt_string = prompt.format(question=user_input).strip()
            print(f"Formatted Prompt: {prompt_string}")  # Debug log

            # Use the LLM to generate the response
            response = llm.generate([prompt_string])
            sql_query = response.generations[0][0].text.strip()
            print(f"Raw LLM Output: {sql_query}")  # Debug raw output

            # Validate the SQL query
            if not sql_query.upper().startswith("SELECT"):
                raise ValueError(f"Invalid SQL query generated: {sql_query}")

            # Execute the query
            results = run_query(sql_query)
            if isinstance(results, dict) and "error" in results:
                raise Exception(results["error"])  # Raise exception for retry

            print(f"Formatted Results: {results}")  # Debug formatted results

            # Return both the SQL query and results
            return jsonify({"results": results, "sql_query": sql_query})

        except Exception as e:
            print(f"Error during query execution: {e}")  # Debug log
            retry_count += 1
            if retry_count >= max_retries:
                return jsonify({"error": f"Failed after {max_retries} retries", "last_query": sql_query, "exception": str(e)}), 500

    return jsonify({"error": "Unexpected error"}), 500








if __name__ == '__main__':
    app.run(debug=True)

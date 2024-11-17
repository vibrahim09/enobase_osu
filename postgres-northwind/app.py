from flask import Flask, render_template, request
from play_with_postgress import run_llm_query 
from play_with_postgress import generate_table_from_prompt  # Import the function that runs the LLM query

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    query = ""
    result = ""
    limit = 100
    offset = 0
    headers = []
    result = []
    if request.method == 'POST':
        query = request.form['query']
        if query.lower().startswith("Create a table"):
            headers, result = generate_table_from_prompt(query)

        else:
            query , result = run_llm_query(query, limit, offset)
        if result is None:
            result = "No result returned from LLM query."
    # Run the LLM query
    #query = "Describe the customers table"
    #query , result = run_llm_query(query)
    # Check if the result is None
    
    # Render the results in an HTML template
    return render_template('index.html' , query=query , result=result, headers=headers)

if __name__ == '__main__':
    app.run(debug=True)

#GET-Get data from specified resource while post
#Post is used to send data to a server to create/update a resource.
'''
In summary, GET is preferred for requests where data retrieval is needed without modifications, 
while POST is suitable for requests involving data submission or updates, especially where security and larger
data volumes are required.
'''
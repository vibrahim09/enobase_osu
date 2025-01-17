import psycopg2

# Database connection credentials
db_credentials = {
    "dbname": "northwind",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432"
}

def get_schema():
    connection = psycopg2.connect(**db_credentials)
    cursor = connection.cursor()
    schema = {}

    # Get tables
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    tables = cursor.fetchall()

    # Get columns for each table
    for table in tables:
        table_name = table[0].lower()
        cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table_name}';")
        columns = cursor.fetchall()
        schema[table_name] = [col[0].lower() for col in columns]

    cursor.close()
    connection.close()
    return schema

def save_schema_to_file(schema, file_path):
    with open(file_path, 'w') as file:
        for table, columns in schema.items():
            file.write(f"Table: {table}\n")
            file.write("Columns:\n")
            for column in columns:
                file.write(f"  - {column}\n")
            file.write("\n")

def main():
    schema = get_schema()
    save_schema_to_file(schema, 'northwind_schema.txt')
    print("Schema has been saved to 'northwind_schema.txt'")

if __name__ == "__main__":
    main()
# Use the official PostgreSQL image
FROM postgres:latest

#Set the environment variables
ENV POSTGRES_DB=northwind
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Copy the SQL file to the container
COPY init/northwind.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

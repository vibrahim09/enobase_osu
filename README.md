### 1. Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python3 ai_cli_schema_integration_2.py
   ```
   The backend will be available at `http://127.0.0.1:5000`

### 2. Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### 3. Running the Application
1. Ensure all three services are running:
   - PostgreSQL Docker container
   - Python Flask backend
   - Next.js frontend

2. Access the web interface at `http://localhost:3000`
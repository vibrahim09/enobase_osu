import {NextRequest, NextResponse} from 'next/server';
import {Pool} from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'northwind',
    password: 'postgres',
    port: 5432,
});
 async function fetchTables(){
    try{
        const result = await pool.query(

            `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
        );
        return {result: result.rows};

    } catch (error){
        console.error('Error fetching tables:', error);
        return {error: 'Error fetching data'};

    }


 }

 async function fetchTableData(table:string){
    try{
      
      
        const result = await pool.query(
            `SELECT * FROM public."${table}"`, 

        );
        console.log("Result:", result);
       const columnNames = result.fields.map(field => field.name);
       return {columns: columnNames, result: result.rows};
        
        
    } catch (error){
        console.error('Error fetching tables:', error);
        return {error: 'Error fetching data'};

    }


 }
export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url);
       // const database = searchParams.get('database');
        const table = searchParams.get('table');
        console.log("Api request received:", {  table });

        if (!table){
       
        const response = await fetchTables();
        console.log("Api responsed:", response);
        if ('error' in response){
            return NextResponse.json({error: response.error}, {status: 500});
        
    } 
        return NextResponse.json({result: response.result});
    }
    else{
        const datatableresponse = await fetchTableData(table);
        console.log("Api responsedd:", datatableresponse);
        if ('error' in datatableresponse){
            return NextResponse.json({error: datatableresponse.error}, {status: 500});
        }
        return NextResponse.json({columns:datatableresponse.columns,result: datatableresponse.result});
    
    }
        
}
    catch (error){
        console.error('API error:', error);
        return NextResponse.json({error: error instanceof Error ? error.message : 'Internal server error'}, {status: 500});
    }
}
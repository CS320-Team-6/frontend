import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MyTable from './table';

interface Issue {
   id: number;
   equipmentId: number;
   status: string;
   dateReported: {
     year: number;
     month: number;
     day: number;
     hour: number;
     minute: number;
   };
   priority: string;
   description: string | null;
   assignedTo: string | null;
   dateResolved: string | null;
   resolutionDetails: string | null;
   notes: string | null;
 }

export default function Staff() {
   const [Id, setId] = useState('');
   const [data, setData] = useState(new Array<Issue>());
   const [hasData, setHasData] = useState(false);
   const URL = 'http://urepair-env.eba-hnfscrcj.us-east-2.elasticbeanstalk.com/issue'
   
    
   const getData = async () => {
      console.log('getData\n');
      const res = await fetch(URL);
      const resJSON = await res.json();
      const issue_table = resJSON.issue_table;
      setData(issue_table);
      setHasData(true);
   };
   
   return (
      <>
         <h1 className={styles.title}>
            Staff
         </h1>
         {
            !hasData 
            && 
            <Button 
               size="large"
               variant="contained" 
               onClick={getData}
            >
               Fetch Tickets
            </Button>
         }
         {hasData && <MyTable issues={data}/>}
      </>
   );
}
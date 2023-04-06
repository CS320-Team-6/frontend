import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { Button } from '@mui/material';

export default function Staff() {
   const [Id, setId] = useState('');
   const [data, setData] = useState(''); // not used
   const [hasData, setHasData] = useState(false); // not used
   const URL = 'http://urepair-env.eba-hnfscrcj.us-east-2.elasticbeanstalk.com/issue'
   
    
   const getData = async () => {
      console.log('getData\n');
      const res = await fetch(URL);
      const dataObject = await res.json();
      const issue_table = dataObject.issue_table;
      const str = JSON.stringify(issue_table);
      setData(str);
      setHasData(true);
   };
   
   return (
      <>
         <h1 className={styles.title}>
            Staff
         </h1>
         {!hasData && <Button 
            size="large"
            variant="contained" 
            onClick={getData}
         >
            Fetch Tickets
         </Button>}
         {hasData && <p>{data}</p>}
      </>
   );
}
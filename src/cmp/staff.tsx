// import styles from '@/styles/Home.module.css';
import React, { useState } from 'react';
import { Button } from '@mui/material';
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
  const [data, setData] = useState(new Array<Issue>());
  const [hasData, setHasData] = useState(false);
  const URL = 'http://urepair-env.eba-hnfscrcj.us-east-2.elasticbeanstalk.com/issue';

  const getData = async () => {
    const res = await fetch(URL);
    const resJSON = await res.json();
    resJSON.issue_table.sort((a: Issue, b: Issue) => a.id - b.id);
    setData(resJSON.issue_table);
    setHasData(true);
  };

  return (
    <>
      {/* <h1 className={styles.title}>
            Staff
         </h1> */}
      {
            !hasData
            && (
            <Button
              size="large"
              variant="contained"
              onClick={getData}
            >
              Fetch Tickets
            </Button>
            )
}
      {hasData && <MyTable URL={URL} issues={data} getData={getData} />}
    </>
  );
}

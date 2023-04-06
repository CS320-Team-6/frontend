import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { TextField, MenuItem, Box, Button } from '@mui/material';

export default function Form() {
  const [Id, setId] = useState('');
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState('LOW'); // LOW, MEDIUM, HIGH, URGENT
  const [data, setData] = useState(''); // not used
  const URL = 'http://urepair-env.eba-hnfscrcj.us-east-2.elasticbeanstalk.com/issue'
  const dateJSON = {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // add 1 because getMonth() returns 0-based index
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  };

  const priorities = [
    {
      value: 'LOW',
      label: 'Low',
    },
    {
      value: 'MEDIUM',
      label: 'Medium',
    },
    {
      value: 'HIGH',

      label: 'High',
    },
    {
      value: 'URGENT',
      label: 'Urgent',
    },
  ];

  const getData = async () => {
    console.log('getData\n');
    const res = await fetch(URL);
    const dataObject = await res.json();
    const str = JSON.stringify(dataObject);
    setData(str);
  };

  const postData = async () => {
    setDate(new Date());
    const ticket = {
      "id": 1,
      "equipmentId": Id,
      "status": 'NEW',
      "dateReported": {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // add 1 because getMonth() returns 0-based index
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes()
      },
      "priority": priority,
      "description": null,
      "assignedTo": null,
      "dateResolved": null,
      "resolutionDetails": null,
      "notes": null
    };
    console.log(JSON.stringify(ticket));
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(ticket)
    };
    fetch(URL, requestOptions)
      .then(response => response.json())
      .then(data => console.log(JSON.stringify(data)))
      .catch(error => console.log(error));
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };
  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(event.target.value);
  };


  return (
    <>
        <h1 className={styles.title}>
          Welcome to URepair!
        </h1>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="standard-basic"
            label="Equipment-Id"
            value={Id}
            onChange={handleIdChange}
          />
          <TextField
            id="outlined-select-priority"
            select
            label="Priority"
            defaultValue="LOW"
            onChange={handlePriorityChange}
          >
            {priorities.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
            ))}
          </TextField>
          {/* <TextField
            id="standard-basic"
            label="Date"
            value={date}
            disabled
            //onChange={handleDateChange}
          /> */}
        </Box>
        {/* data && <p>{data}</p> */}
        <Button 
          variant="contained" 
          onClick={postData}
        >
          Submit
        </Button>
    </>
  );
}
